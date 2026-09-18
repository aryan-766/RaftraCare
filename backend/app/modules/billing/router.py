"""
Billing & Payments Router
Production-hardened module supporting:
- Multi-tenant Patient Invoicing & Detailed Items
- Real-time Server-side Calculations (Subtotal, Discounts, Balance)
- Transaction-safe Payment Recording (Cash, Card, UPI, DD)
- Permission-controlled Refund Processing with immutable audit records
- RaftraCare SaaS Subscription Tiers & Entitlements
- Signature-verified Idempotent Razorpay Webhook Handler
"""
from fastapi import APIRouter, Depends, Query, Request, Header
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel, Field
import json
import razorpay

from app.database.session import get_db
from app.database.models import (
    Invoice, InvoiceItem, Payment, PaymentRefund, Patient,
    Hospital, HospitalStaff, Bed, HospitalSubscription, SubscriptionPlan,
    ProcessedWebhookEvent
)
from app.core.enums import (
    InvoiceStatus, InvoiceItemType, PaymentMethod, PaymentStatus,
    AuditAction, SubscriptionStatus, SubscriptionTier, UserRole
)
from app.core.exceptions import NotFoundError, BadRequestError, ForbiddenError
from app.dependencies import require_permissions, get_current_tenant
from app.core.responses import created_response, success_response, error_response
from app.modules.audit.service import audit_service
from app.modules.auth.security import verify_razorpay_payment_signature, verify_razorpay_webhook_signature
from app.core.config import settings
from app.core.logging import logger

router = APIRouter(prefix="/billing", tags=["Billing & Payments"])


# ─── Request Models ──────────────────────────────────────────────

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


class RecordPaymentRequest(BaseModel):
    invoice_id: str
    amount: float = Field(gt=0)
    method: PaymentMethod = PaymentMethod.CASH
    transaction_ref: Optional[str] = None
    notes: Optional[str] = None


class ProcessRefundRequest(BaseModel):
    amount: float = Field(gt=0)
    reason: str = Field(min_length=3, max_length=255)


class CreateRazorpayOrderRequest(BaseModel):
    invoice_id: str


class VerifyPaymentRequest(BaseModel):
    invoice_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class SubscriptionCheckoutRequest(BaseModel):
    plan_tier: SubscriptionTier
    billing_cycle: str = Field(default="MONTHLY", pattern=r"^(MONTHLY|YEARLY)$")


# ─── Public Razorpay Webhook (Idempotent) ─────────────────────────

@router.post("/webhook")
async def handle_razorpay_webhook(
    request: Request,
    x_razorpay_signature: Optional[str] = Header(default=None),
    db: AsyncSession = Depends(get_db),
):
    body = await request.body()
    payload_str = body.decode("utf-8")

    # 1. Signature Verification
    if settings.is_production or x_razorpay_signature:
        if not x_razorpay_signature or not verify_razorpay_webhook_signature(payload_str, x_razorpay_signature):
            logger.warning("Rejected invalid Razorpay webhook signature")
            return error_response("Invalid Razorpay webhook signature", status_code=400)

    try:
        event = json.loads(payload_str)
    except json.JSONDecodeError:
        return error_response("Invalid JSON payload", status_code=400)

    event_type = event.get("event", "")
    event_id = event.get("event_id") or event.get("id") or f"{event_type}_{datetime.now(timezone.utc).timestamp()}"

    # 2. Idempotency Check: process once, ignore duplicates
    existing_event = await db.execute(
        select(ProcessedWebhookEvent).where(ProcessedWebhookEvent.event_id == event_id)
    )
    if existing_event.scalar_one_or_none():
        logger.info("Webhook event already processed (idempotent ignore)", event_id=event_id)
        return success_response({"processed": True, "duplicate": True}, "Event already handled")

    # 3. Process Webhook Event Types
    if event_type == "payment.captured":
        payment_entity = event.get("payload", {}).get("payment", {}).get("entity", {})
        order_id = payment_entity.get("order_id")
        payment_id = payment_entity.get("id")

        if order_id:
            payment_res = await db.execute(
                select(Payment).where(Payment.razorpay_order_id == order_id)
            )
            payment = payment_res.scalar_one_or_none()
            if payment and payment.status != PaymentStatus.SUCCESSFUL:
                payment.status = PaymentStatus.SUCCESSFUL
                payment.razorpay_payment_id = payment_id

                # Settle Invoice
                invoice_res = await db.execute(
                    select(Invoice).where(Invoice.id == payment.invoice_id)
                )
                invoice = invoice_res.scalar_one_or_none()
                if invoice:
                    invoice.paid_amount = min(invoice.total_amount, invoice.paid_amount + payment.amount)
                    invoice.balance_amount = max(0.0, invoice.total_amount - invoice.paid_amount)
                    if invoice.balance_amount <= 0.001:
                        invoice.status = InvoiceStatus.PAID
                    else:
                        invoice.status = InvoiceStatus.PARTIALLY_PAID

    elif event_type in ("subscription.activated", "subscription.charged"):
        sub_entity = event.get("payload", {}).get("subscription", {}).get("entity", {})
        sub_id = sub_entity.get("id")
        notes = sub_entity.get("notes", {})
        hospital_id = notes.get("hospital_id")

        if hospital_id and sub_id:
            sub_res = await db.execute(
                select(HospitalSubscription).where(
                    HospitalSubscription.hospital_id == hospital_id,
                    HospitalSubscription.is_active == True,
                )
            )
            subscription = sub_res.scalar_one_or_none()
            if subscription:
                subscription.status = SubscriptionStatus.ACTIVE
                subscription.razorpay_subscription_id = sub_id
                subscription.current_period_end = datetime.now(timezone.utc) + timedelta(days=30)

    # 4. Mark Event as Processed
    db.add(ProcessedWebhookEvent(
        event_id=event_id,
        event_type=event_type,
        processed_at=datetime.now(timezone.utc),
    ))
    await db.commit()

    return success_response({"processed": True, "event_id": event_id}, "Webhook handled successfully")


# ─── Patient Invoices ─────────────────────────────────────────────

async def _generate_invoice_number(db: AsyncSession, hospital_id: str) -> str:
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

    # Verify patient belongs to tenant
    patient_result = await db.execute(
        select(Patient).where(Patient.id == payload.patient_id, Patient.hospital_id == hospital_id)
    )
    patient = patient_result.scalar_one_or_none()
    if not patient:
        raise NotFoundError("Patient not found in this hospital facility")

    # Authoritative server-side calculation
    sub_total = sum(item.unit_price * item.quantity for item in payload.items)
    discount_amount = min(payload.discount_amount, sub_total)
    total_amount = max(0.0, sub_total - discount_amount)
    invoice_number = await _generate_invoice_number(db, hospital_id)

    invoice = Invoice(
        hospital_id=hospital_id,
        patient_id=payload.patient_id,
        invoice_number=invoice_number,
        sub_total=sub_total,
        discount_amount=discount_amount,
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
        description=f"Generated invoice {invoice_number} for ₹{total_amount:.2f}",
        ip_address=request.client.host if request.client else None,
    )

    await db.commit()
    return created_response({
        "id": invoice.id,
        "invoice_number": invoice_number,
        "patient_id": invoice.patient_id,
        "patient_name": f"{patient.first_name} {patient.last_name}",
        "sub_total": sub_total,
        "discount_amount": discount_amount,
        "total_amount": total_amount,
        "balance_amount": total_amount,
        "status": invoice.status,
    }, "Invoice created successfully")


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
        [
            {
                "id": i.id,
                "invoice_number": i.invoice_number,
                "patient_id": i.patient_id,
                "sub_total": i.sub_total,
                "discount_amount": i.discount_amount,
                "total_amount": i.total_amount,
                "paid_amount": i.paid_amount,
                "balance_amount": i.balance_amount,
                "status": i.status,
                "created_at": str(i.created_at),
            }
            for i in invoices
        ],
        meta={"page": page, "limit": limit, "total": total, "total_pages": (total + limit - 1) // limit},
    )


@router.get("/invoices/{invoice_id}")
async def get_invoice_detail(
    invoice_id: str,
    ctx: tuple = Depends(require_permissions("invoices:read")),
    db: AsyncSession = Depends(get_db),
):
    user, hospital_id = ctx

    result = await db.execute(
        select(Invoice).where(Invoice.id == invoice_id, Invoice.hospital_id == hospital_id)
    )
    invoice = result.scalar_one_or_none()
    if not invoice:
        raise NotFoundError("Invoice not found in this hospital")

    patient_res = await db.execute(
        select(Patient).where(Patient.id == invoice.patient_id, Patient.hospital_id == hospital_id)
    )
    patient = patient_res.scalar_one_or_none()

    items_res = await db.execute(
        select(InvoiceItem).where(InvoiceItem.invoice_id == invoice.id)
    )
    items = items_res.scalars().all()

    payments_res = await db.execute(
        select(Payment).where(Payment.invoice_id == invoice.id).order_by(Payment.created_at.desc())
    )
    payments = payments_res.scalars().all()

    return success_response({
        "id": invoice.id,
        "invoice_number": invoice.invoice_number,
        "patient": {
            "id": patient.id if patient else None,
            "uhid": patient.uhid if patient else None,
            "name": f"{patient.first_name} {patient.last_name}" if patient else "Unknown",
            "phone": patient.phone if patient else None,
        },
        "sub_total": invoice.sub_total,
        "discount_amount": invoice.discount_amount,
        "total_amount": invoice.total_amount,
        "paid_amount": invoice.paid_amount,
        "balance_amount": invoice.balance_amount,
        "status": invoice.status,
        "notes": invoice.notes,
        "created_at": str(invoice.created_at),
        "items": [
            {
                "id": it.id,
                "item_type": it.item_type,
                "description": it.description,
                "quantity": it.quantity,
                "unit_price": it.unit_price,
                "total_price": it.total_price,
            }
            for it in items
        ],
        "payments": [
            {
                "id": p.id,
                "amount": p.amount,
                "refunded_amount": p.refunded_amount,
                "method": p.method,
                "status": p.status,
                "transaction_ref": p.transaction_ref,
                "created_at": str(p.created_at),
            }
            for p in payments
        ],
    })


# ─── Direct Payments & Settle (Cash/Card/UPI/DD) ─────────────────

@router.post("/payments", status_code=201)
async def record_payment(
    payload: RecordPaymentRequest,
    request: Request,
    ctx: tuple = Depends(require_permissions("payments:process")),
    db: AsyncSession = Depends(get_db),
):
    """Record direct patient payment with atomic transaction safety"""
    user, hospital_id = ctx

    invoice_res = await db.execute(
        select(Invoice).where(Invoice.id == payload.invoice_id, Invoice.hospital_id == hospital_id)
    )
    invoice = invoice_res.scalar_one_or_none()
    if not invoice:
        raise NotFoundError("Invoice not found in this hospital")

    if invoice.status == InvoiceStatus.PAID or invoice.balance_amount <= 0.0:
        raise BadRequestError("Invoice is already fully paid")

    if payload.amount > (invoice.balance_amount + 0.001):
        raise BadRequestError(
            f"Payment amount (₹{payload.amount:.2f}) exceeds remaining balance (₹{invoice.balance_amount:.2f})"
        )

    # Record payment
    payment = Payment(
        hospital_id=hospital_id,
        invoice_id=invoice.id,
        amount=payload.amount,
        refunded_amount=0.0,
        method=payload.method,
        status=PaymentStatus.SUCCESSFUL,
        transaction_ref=payload.transaction_ref,
        received_by_user_id=user.id,
    )
    db.add(payment)

    # Recalculate invoice balances
    invoice.paid_amount = min(invoice.total_amount, invoice.paid_amount + payload.amount)
    invoice.balance_amount = max(0.0, invoice.total_amount - invoice.paid_amount)
    if invoice.balance_amount <= 0.001:
        invoice.status = InvoiceStatus.PAID
    else:
        invoice.status = InvoiceStatus.PARTIALLY_PAID

    await audit_service.log(
        db=db, hospital_id=hospital_id, user_id=user.id,
        action=AuditAction.CREATE, resource_type="PAYMENT", resource_id=payment.id,
        description=f"Recorded {payload.method.value} payment of ₹{payload.amount:.2f} for invoice {invoice.invoice_number}",
        ip_address=request.client.host if request.client else None,
    )

    await db.commit()
    return created_response({
        "payment_id": payment.id,
        "invoice_id": invoice.id,
        "invoice_number": invoice.invoice_number,
        "amount_paid": payload.amount,
        "new_balance": invoice.balance_amount,
        "invoice_status": invoice.status,
    }, "Payment processed successfully")


# ─── Permission-Controlled Refunds ───────────────────────────────

@router.post("/payments/{payment_id}/refund")
async def process_refund(
    payment_id: str,
    payload: ProcessRefundRequest,
    request: Request,
    ctx: tuple = Depends(require_permissions("payments:refund")),
    db: AsyncSession = Depends(get_db),
):
    """
    Refund processing:
    - Strictly permission controlled (Admin/SuperAdmin)
    - Validates tenant ownership
    - Validates amount <= remaining refundable
    - Adjusts invoice balance safely inside transaction
    """
    user, hospital_id = ctx

    payment_res = await db.execute(
        select(Payment).where(Payment.id == payment_id, Payment.hospital_id == hospital_id)
    )
    payment = payment_res.scalar_one_or_none()
    if not payment:
        raise NotFoundError("Payment record not found in this hospital")

    if payment.status != PaymentStatus.SUCCESSFUL:
        raise BadRequestError(f"Cannot refund payment with status '{payment.status.value}'")

    available_refundable = payment.amount - payment.refunded_amount
    if payload.amount > (available_refundable + 0.001):
        raise BadRequestError(
            f"Refund amount (₹{payload.amount:.2f}) exceeds maximum refundable balance (₹{available_refundable:.2f})"
        )

    # 1. Create immutable refund log
    refund = PaymentRefund(
        hospital_id=hospital_id,
        payment_id=payment.id,
        amount=payload.amount,
        reason=payload.reason,
        processed_by_user_id=user.id,
    )
    db.add(refund)

    # 2. Update payment state
    payment.refunded_amount += payload.amount
    if (payment.amount - payment.refunded_amount) <= 0.001:
        payment.status = PaymentStatus.REFUNDED

    # 3. Adjust invoice balance
    invoice_res = await db.execute(
        select(Invoice).where(Invoice.id == payment.invoice_id, Invoice.hospital_id == hospital_id)
    )
    invoice = invoice_res.scalar_one_or_none()
    if invoice:
        invoice.paid_amount = max(0.0, invoice.paid_amount - payload.amount)
        invoice.balance_amount = max(0.0, invoice.total_amount - invoice.paid_amount)
        if invoice.paid_amount <= 0.001:
            invoice.status = InvoiceStatus.GENERATED
        else:
            invoice.status = InvoiceStatus.PARTIALLY_PAID

    await audit_service.log(
        db=db, hospital_id=hospital_id, user_id=user.id,
        action=AuditAction.UPDATE, resource_type="PAYMENT_REFUND", resource_id=payment.id,
        description=f"Processed refund of ₹{payload.amount:.2f} for payment {payment.id}. Reason: {payload.reason}",
        ip_address=request.client.host if request.client else None,
    )

    await db.commit()
    return success_response({
        "refund_id": refund.id,
        "payment_id": payment.id,
        "refunded_amount": payload.amount,
        "remaining_refundable": payment.amount - payment.refunded_amount,
        "invoice_balance": invoice.balance_amount if invoice else None,
    }, "Refund completed successfully")


# ─── Razorpay Online Orders & Verification ───────────────────────

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

    amount_paise = int(round(invoice.balance_amount * 100))
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
        refunded_amount=0.0,
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
        "key_id": settings.razorpay_key_id,
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
            refunded_amount=0.0,
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
        description=f"Online payment verified for invoice {invoice.invoice_number}",
        ip_address=request.client.host if request.client else None,
    )
    await db.commit()

    return success_response({
        "invoice_id": invoice.id,
        "invoice_number": invoice.invoice_number,
        "status": invoice.status,
        "paid_amount": invoice.paid_amount,
    }, "Payment verified and invoice settled")


# ─── RaftraCare SaaS Subscription Billing ────────────────────────

@router.get("/subscription/current")
async def get_current_subscription(
    ctx: tuple = Depends(get_current_tenant),
    db: AsyncSession = Depends(get_db),
):
    user, hospital_id = ctx

    sub_res = await db.execute(
        select(HospitalSubscription, SubscriptionPlan)
        .join(SubscriptionPlan, HospitalSubscription.plan_id == SubscriptionPlan.id)
        .where(HospitalSubscription.hospital_id == hospital_id)
        .order_by(HospitalSubscription.created_at.desc())
    )
    row = sub_res.first()

    # Current usage stats
    doctor_count_res = await db.execute(
        select(func.count()).where(
            HospitalStaff.hospital_id == hospital_id,
            HospitalStaff.role == UserRole.DOCTOR,
            HospitalStaff.is_active == True,
        )
    )
    doctor_count = doctor_count_res.scalar_one() or 0

    staff_count_res = await db.execute(
        select(func.count()).where(
            HospitalStaff.hospital_id == hospital_id,
            HospitalStaff.is_active == True,
        )
    )
    staff_count = staff_count_res.scalar_one() or 0

    bed_count_res = await db.execute(
        select(func.count()).where(Bed.hospital_id == hospital_id)
    )
    bed_count = bed_count_res.scalar_one() or 0

    if row:
        sub, plan = row
        return success_response({
            "subscription": {
                "id": sub.id,
                "status": sub.status,
                "billing_cycle": sub.billing_cycle,
                "current_period_start": str(sub.current_period_start),
                "current_period_end": str(sub.current_period_end),
            },
            "plan": {
                "id": plan.id,
                "name": plan.name,
                "tier": plan.tier,
                "price_monthly": plan.price_monthly,
                "price_yearly": plan.price_yearly,
                "max_doctors": plan.max_doctors,
                "max_staff": plan.max_staff,
                "max_beds": plan.max_beds,
                "features": plan.features or [],
            },
            "usage": {
                "doctors": doctor_count,
                "staff": staff_count,
                "beds": bed_count,
            },
        })

    # Default fallback view if new tenant
    return success_response({
        "subscription": {
            "status": SubscriptionStatus.TRIALING,
            "billing_cycle": "MONTHLY",
        },
        "plan": {
            "tier": SubscriptionTier.FREE_TRIAL,
            "name": "14-Day Free Trial",
            "max_doctors": 10,
            "max_staff": 30,
            "max_beds": 50,
        },
        "usage": {
            "doctors": doctor_count,
            "staff": staff_count,
            "beds": bed_count,
        },
    })


@router.get("/subscription/plans")
async def get_subscription_plans(
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(SubscriptionPlan).where(SubscriptionPlan.is_active == True).order_by(SubscriptionPlan.price_monthly)
    )
    plans = result.scalars().all()
    return success_response([
        {
            "id": p.id,
            "name": p.name,
            "tier": p.tier,
            "description": p.description,
            "price_monthly": p.price_monthly,
            "price_yearly": p.price_yearly,
            "max_doctors": p.max_doctors,
            "max_staff": p.max_staff,
            "max_beds": p.max_beds,
            "features": p.features or [],
        }
        for p in plans
    ])


@router.post("/subscription/checkout")
async def create_subscription_checkout(
    payload: SubscriptionCheckoutRequest,
    ctx: tuple = Depends(require_permissions("subscriptions:manage")),
    db: AsyncSession = Depends(get_db),
):
    user, hospital_id = ctx

    plan_res = await db.execute(
        select(SubscriptionPlan).where(SubscriptionPlan.tier == payload.plan_tier)
    )
    plan = plan_res.scalar_one_or_none()
    if not plan:
        raise NotFoundError(f"Subscription plan '{payload.plan_tier.value}' not found")

    amount = plan.price_yearly if payload.billing_cycle == "YEARLY" else plan.price_monthly
    amount_paise = int(round(amount * 100))

    if amount_paise <= 0:
        # Free plan
        return success_response({"free": True, "message": "Plan updated to Free Trial"})

    rzp = razorpay.Client(auth=(settings.razorpay_key_id, settings.razorpay_key_secret))
    order = rzp.order.create({
        "amount": amount_paise,
        "currency": "INR",
        "receipt": f"SUB-{hospital_id[:8]}",
        "notes": {
            "hospital_id": hospital_id,
            "plan_id": plan.id,
            "tier": plan.tier.value,
            "cycle": payload.billing_cycle,
        },
    })

    return success_response({
        "order_id": order["id"],
        "amount": order["amount"],
        "currency": "INR",
        "key_id": settings.razorpay_key_id,
        "plan_name": plan.name,
        "tier": plan.tier,
    })
