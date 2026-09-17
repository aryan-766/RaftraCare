from fastapi import APIRouter, Depends, Query, Request
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import date as date_type, datetime, timezone
from app.database.session import get_db
from app.database.models import Appointment, Patient, HospitalStaff, QueueToken
from app.core.enums import AppointmentStatus, QueueStatus, Priority
from app.core.exceptions import NotFoundError, BadRequestError
from app.dependencies import require_permissions
from app.core.responses import created_response, success_response
from pydantic import BaseModel, Field
from typing import Optional


router = APIRouter(prefix="/appointments", tags=["Appointments & Queue"])


class BookAppointmentRequest(BaseModel):
    patient_id: str
    doctor_id: str
    department_id: Optional[str] = None
    appointment_date: date_type
    slot_start_time: str = Field(pattern=r"^\d{2}:\d{2}$")
    slot_end_time: str = Field(pattern=r"^\d{2}:\d{2}$")
    reason: Optional[str] = None
    priority: Priority = Priority.NORMAL
    appointment_type: str = "WALK_IN"


class UpdateQueueStatusRequest(BaseModel):
    status: QueueStatus
    room_number: Optional[str] = None


@router.post("/", status_code=201)
async def book_appointment(
    payload: BookAppointmentRequest,
    ctx: tuple = Depends(require_permissions("appointments:write")),
    db: AsyncSession = Depends(get_db),
):
    user, hospital_id = ctx

    # Verify patient & doctor belong to this hospital
    patient = await db.execute(
        select(Patient).where(Patient.id == payload.patient_id, Patient.hospital_id == hospital_id)
    )
    if not patient.scalar_one_or_none():
        raise NotFoundError("Patient not found in this hospital")

    doctor = await db.execute(
        select(HospitalStaff).where(HospitalStaff.id == payload.doctor_id, HospitalStaff.hospital_id == hospital_id)
    )
    doctor_obj = doctor.scalar_one_or_none()
    if not doctor_obj:
        raise NotFoundError("Doctor not found in this hospital")

    # Calculate next token number for doctor on that date
    count_result = await db.execute(
        select(func.count()).where(
            Appointment.hospital_id == hospital_id,
            Appointment.doctor_id == payload.doctor_id,
            Appointment.appointment_date == payload.appointment_date,
        )
    )
    token_number = (count_result.scalar_one() or 0) + 1

    appointment = Appointment(
        hospital_id=hospital_id,
        patient_id=payload.patient_id,
        doctor_id=payload.doctor_id,
        department_id=payload.department_id or doctor_obj.department_id,
        appointment_date=payload.appointment_date,
        slot_start_time=payload.slot_start_time,
        slot_end_time=payload.slot_end_time,
        token_number=token_number,
        reason=payload.reason,
        priority=payload.priority,
        appointment_type=payload.appointment_type,
        booked_by_user_id=user.id,
    )
    db.add(appointment)
    await db.flush()

    queue_token = QueueToken(
        appointment_id=appointment.id,
        token_number=token_number,
        status=QueueStatus.BOOKED,
    )
    db.add(queue_token)
    await db.commit()

    return created_response({
        "id": appointment.id,
        "token_number": token_number,
        "appointment_date": str(appointment.appointment_date),
        "slot_start_time": appointment.slot_start_time,
        "status": appointment.status,
    }, "Appointment booked")


@router.get("/")
async def list_appointments(
    doctor_id: Optional[str] = Query(default=None),
    patient_id: Optional[str] = Query(default=None),
    date: Optional[str] = Query(default=None),
    status: Optional[AppointmentStatus] = Query(default=None),
    ctx: tuple = Depends(require_permissions("appointments:read")),
    db: AsyncSession = Depends(get_db),
):
    user, hospital_id = ctx
    query = select(Appointment).where(Appointment.hospital_id == hospital_id)

    if doctor_id:
        query = query.where(Appointment.doctor_id == doctor_id)
    if patient_id:
        query = query.where(Appointment.patient_id == patient_id)
    if status:
        query = query.where(Appointment.status == status)
    if date:
        query = query.where(Appointment.appointment_date == date_type.fromisoformat(date))

    result = await db.execute(query.order_by(Appointment.slot_start_time))
    appointments = result.scalars().all()

    return success_response([
        {
            "id": a.id, "patient_id": a.patient_id, "doctor_id": a.doctor_id,
            "appointment_date": str(a.appointment_date),
            "slot_start_time": a.slot_start_time, "slot_end_time": a.slot_end_time,
            "token_number": a.token_number, "status": a.status, "priority": a.priority,
            "reason": a.reason,
        }
        for a in appointments
    ])


@router.get("/queue")
async def get_daily_queue(
    doctor_id: Optional[str] = Query(default=None),
    date: Optional[str] = Query(default=None),
    ctx: tuple = Depends(require_permissions("queue:read")),
    db: AsyncSession = Depends(get_db),
):
    user, hospital_id = ctx
    target_date = date_type.fromisoformat(date) if date else date_type.today()

    query = (
        select(Appointment, QueueToken)
        .outerjoin(QueueToken, QueueToken.appointment_id == Appointment.id)
        .where(
            Appointment.hospital_id == hospital_id,
            Appointment.appointment_date == target_date,
        )
    )
    if doctor_id:
        query = query.where(Appointment.doctor_id == doctor_id)

    result = await db.execute(query.order_by(Appointment.token_number))
    rows = result.all()

    return success_response([
        {
            "appointment_id": a.id,
            "token_number": a.token_number,
            "patient_id": a.patient_id,
            "doctor_id": a.doctor_id,
            "slot_start_time": a.slot_start_time,
            "priority": a.priority,
            "appointment_status": a.status,
            "queue_status": q.status if q else None,
            "room_number": q.room_number if q else None,
            "called_at": str(q.called_at) if q and q.called_at else None,
        }
        for a, q in rows
    ])


@router.patch("/{appointment_id}/queue")
async def update_queue_status(
    appointment_id: str,
    payload: UpdateQueueStatusRequest,
    ctx: tuple = Depends(require_permissions("queue:manage")),
    db: AsyncSession = Depends(get_db),
):
    user, hospital_id = ctx

    result = await db.execute(
        select(Appointment).where(
            Appointment.id == appointment_id,
            Appointment.hospital_id == hospital_id
        )
    )
    appointment = result.scalar_one_or_none()
    if not appointment:
        raise NotFoundError("Appointment not found")

    token_result = await db.execute(
        select(QueueToken).where(QueueToken.appointment_id == appointment_id)
    )
    token = token_result.scalar_one_or_none()
    if not token:
        raise NotFoundError("Queue token not found")

    token.status = payload.status
    if payload.room_number:
        token.room_number = payload.room_number
    if payload.status == QueueStatus.CALLED:
        token.called_at = datetime.now(timezone.utc)
    if payload.status == QueueStatus.COMPLETED:
        token.completed_at = datetime.now(timezone.utc)
        appointment.status = AppointmentStatus.COMPLETED

    await db.commit()
    return success_response({"status": token.status, "room_number": token.room_number}, "Queue token updated")
