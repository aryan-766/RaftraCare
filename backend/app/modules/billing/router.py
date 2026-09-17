from fastapi import APIRouter, Depends, Query, Request, Header
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database.session import get_db
from app.database.models import Invoice, InvoiceItem, Payment, Patient
from app.core.enums import InvoiceStatus, InvoiceItemType, PaymentMethod, PaymentStatus
from app.core.exceptions import NotFoundError, BadRequestError
from app.dependencies import require_permissions
from app.core.responses import created_response, success_response, error_response
from app.modules.audit.service import audit_service
from app.core.enums import AuditAction
from app.modules.auth.security import verify_razorpay_payment_signature, verify_razorpay_webhook_signature
from pydantic import BaseModel, Field
from typing import List
import razorpay
from app.core.config import settings

router = APIRouter(prefix="/billing", tags=["Billing & Payments"])


class InvoiceItemRequest(BaseModel):
    item_type: InvoiceItemType = InvoiceItemType.MISCELLANEOUS
    description: str = Field(min_length=1)
    quantity: int = Field(default=1, ge=1)
    unit_price: float = Field(ge=0)


class CreateInvoiceRequest(BaseModel):
    patient_id: str
    discount_amount: float = Field(default=0.0, ge=0)
    notes: Optional[str] = None
    items: List[InvoiceItemRequest] = Field(min_length=1)


class CreateRazorpayOrderRequest(BaseModel):
    invoice_id: str


class VerifyPaymentRequest(BaseModel):
    invoice_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


# ─── Public Endpoints ───────────────────────────────────────────

@router.post("/webhook")
async def handle_razorpay_webhook(
    request: Request,
    x_razorpay_signature: Optional[str] = Header(default=None),
    db: AsyncSession = Depends(get_db),
):
    body = await request.body()
    payload_str = body.decode()

    if x_razorpay_signature:
        if not verify_razorpay_webhook_signature(payload_str, x_razorpay_signature):
            return error_response("Invalid Razorpay webhook signature", status_code=400)

    import json
    event = json.loads(payload_str)
    event_type = event.get("event", "")

    if event_type == "payment.captured":
        payment_entity = event.get("payload", {}).get("payment", {}).get("entity", {})
        order_id = payment_entity.get("order_id")
        payment_id = payment_entity.get("id")

        if order_id:
            result = await db.execute(
                select(Payment).where(Payment.razorpay_order_id == order_id)
            )
            payment = result.scalar_one_or_none()
            if payment and payment.status != PaymentStatus.SUCCESSFUL:
                payment.status = PaymentStatus.SUCCESSFUL
                payment.razorpay_payment_id = payment_id

                invoice_result = await db.execute(
                    select(Invoice).where(Invoice.id == payment.invoice_id)
                )
                invoice = invoice_result.scalar_one_or_none()
                if invoice:
                    invoice.paid_amount = invoice.total_amount
                    invoice.balance_amount = 0.0
                    invoice.status = InvoiceStatus.PAID

                await db.commit()

    return success_response({"processed": True}, "Webhook handled")


# ─── Protected Endpoints ─────────────────────────────────────────

async def _generate_invoice_number(db: AsyncSession, hospital_id: str) -> str:
    from datetime import datetime
    now = datetime.now()
    year_month = f"{str(now.year)[2:]}{str(now.month).zfill(2)}"
    count_result = await db.execute(
        select(func.count()).where(Invoice.hospital_id == hospital_id)
    )
    count = count_result.scalar_one() or 0
    return f"INV-{year_month}-{str(count + 1).zfill(5)}"


@router.post("/invoices", status_code=201)
async def create_invoice(
    payload: CreateInvoiceRequest,
    request: Request,
    ctx: tuple = Depends(require_permissions("invoices:write")),
    db: AsyncSession = Depends(get_db),
):
    user, hospital_id = ctx

    patient_result = await db.execute(
        select(Patient).where(Patient.id == payload.patient_id, Patient.hospital_id == hospital_id)
    )
    if not patient_result.scalar_one_or_none():
        raise NotFoundError("Patient not found in this hospital")

    invoice_number = await _generate_invoice_number(db, hospital_id)
    sub_total = sum(item.unit_price * item.quantity for item in payload.items)
    total_amount = max(0.0, sub_total - payload.discount_amount)

    invoice = Invoice(
        hospital_id=hospital_id,
        patient_id=payload.patient_id,
        invoice_number=invoice_number,
        sub_total=sub_total,
        discount_amount=payload.discount_amount,
        total_amount=total_amount,
        paid_amount=0.0,
        balance_amount=total_amount,
        notes=payload.notes,
        status=InvoiceStatus.GENERATED,
    )
    db.add(invoice)
    await db.flush()

    for item in payload.items:
        db.add(InvoiceItem(
            invoice_id=invoice.id,
            item_type=item.item_type,
            description=item.description,
            quantity=item.quantity,
            unit_price=item.unit_price,
            total_price=item.unit_price * item.quantity,
        ))

    await audit_service.log(
        db=db, hospital_id=hospital_id, user_id=user.id,
        action=AuditAction.CREATE, resource_type="INVOICE", resource_id=invoice.id,
        description=f"Generated invoice {invoice_number} for ₹{total_amount}",
        ip_address=request.client.host if request.client else None,
    )

    await db.commit()
    return created_response({
        "id": invoice.id,
        "invoice_number": invoice_number,
        "total_amount": total_amount,
        "balance_amount": total_amount,
        "status": invoice.status,
    }, "Invoice created")


@router.get("/invoices")
async def list_invoices(
    patient_id: Optional[str] = Query(default=None),
    status: Optional[InvoiceStatus] = Query(default=None),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=15, ge=1, le=50),
    ctx: tuple = Depends(require_permissions("invoices:read")),
    db: AsyncSession = Depends(get_db),
):
    user, hospital_id = ctx
    query = select(Invoice).where(Invoice.hospital_id == hospital_id)
    if patient_id:
        query = query.where(Invoice.patient_id == patient_id)
    if status:
        query = query.where(Invoice.status == status)

    count_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = count_result.scalar_one()
    offset = (page - 1) * limit

    result = await db.execute(query.order_by(Invoice.created_at.desc()).offset(offset).limit(limit))
    invoices = result.scalars().all()

    return success_response(
        [{"id": i.id, "invoice_number": i.invoice_number, "patient_id": i.patient_id,
          "total_amount": i.total_amount, "paid_amount": i.paid_amount,
          "balance_amount": i.balance_amount, "status": i.status,
          "created_at": str(i.created_at)} for i in invoices],
        meta={"page": page, "limit": limit, "total": total, "total_pages": (total + limit - 1) // limit},
    )


@router.post("/razorpay/create-order")
async def create_razorpay_order(
    payload: CreateRazorpayOrderRequest,
    ctx: tuple = Depends(require_permissions("payments:process")),
    db: AsyncSession = Depends(get_db),
):
    user, hospital_id = ctx

    result = await db.execute(
        select(Invoice).where(Invoice.id == payload.invoice_id, Invoice.hospital_id == hospital_id)
    )
    invoice = result.scalar_one_or_none()
    if not invoice:
        raise NotFoundError("Invoice not found")
    if invoice.status == InvoiceStatus.PAID:
        raise BadRequestError("Invoice is already fully paid")

    amount_paise = int(invoice.balance_amount * 100)
    if amount_paise <= 0:
        raise BadRequestError("Invoice balance is zero")

    rzp = razorpay.Client(auth=(settings.razorpay_key_id, settings.razorpay_key_secret))
    order = rzp.order.create({
        "amount": amount_paise,
        "currency": "INR",
        "receipt": invoice.invoice_number,
        "notes": {"invoice_id": invoice.id, "hospital_id": hospital_id},
    })

    payment = Payment(
        hospital_id=hospital_id,
        invoice_id=invoice.id,
        amount=invoice.balance_amount,
        method=PaymentMethod.RAZORPAY,
        status=PaymentStatus.PENDING,
        razorpay_order_id=order["id"],
    )
    db.add(payment)
    await db.commit()

    return success_response({
        "order_id": order["id"],
        "amount": order["amount"],
        "currency": order["currency"],
        "invoice_number": invoice.invoice_number,
    })


@router.post("/razorpay/verify-payment")
async def verify_razorpay_payment(
    payload: VerifyPaymentRequest,
    request: Request,
    ctx: tuple = Depends(require_permissions("payments:process")),
    db: AsyncSession = Depends(get_db),
):
    user, hospital_id = ctx

    if not verify_razorpay_payment_signature(
        payload.razorpay_order_id,
        payload.razorpay_payment_id,
        payload.razorpay_signature,
    ):
        raise BadRequestError("Invalid Razorpay payment signature. Possible tampering detected.")

    invoice_result = await db.execute(
        select(Invoice).where(Invoice.id == payload.invoice_id, Invoice.hospital_id == hospital_id)
    )
    invoice = invoice_result.scalar_one_or_none()
    if not invoice:
        raise NotFoundError("Invoice not found")

    payment_result = await db.execute(
        select(Payment).where(Payment.razorpay_order_id == payload.razorpay_order_id)
    )
    payment = payment_result.scalar_one_or_none()
    if payment:
        payment.status = PaymentStatus.SUCCESSFUL
        payment.razorpay_payment_id = payload.razorpay_payment_id
        payment.razorpay_signature = payload.razorpay_signature
    else:
        db.add(Payment(
            hospital_id=hospital_id,
            invoice_id=invoice.id,
            amount=invoice.balance_amount,
            method=PaymentMethod.RAZORPAY,
            status=PaymentStatus.SUCCESSFUL,
            razorpay_order_id=payload.razorpay_order_id,
            razorpay_payment_id=payload.razorpay_payment_id,
            razorpay_signature=payload.razorpay_signature,
        ))

    invoice.paid_amount = invoice.total_amount
    invoice.balance_amount = 0.0
    invoice.status = InvoiceStatus.PAID

    await audit_service.log(
        db=db, hospital_id=hospital_id, user_id=user.id,
        action=AuditAction.UPDATE, resource_type="PAYMENT", resource_id=payload.razorpay_payment_id,
        description=f"Payment verified for invoice {invoice.invoice_number}",
        ip_address=request.client.host if request.client else None,
    )
    await db.commit()

    return success_response({
        "invoice_id": invoice.id,
        "invoice_number": invoice.invoice_number,
        "status": invoice.status,
        "paid_amount": invoice.paid_amount,
    }, "Payment verified and invoice settled")
