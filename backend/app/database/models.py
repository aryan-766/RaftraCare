"""
CareBridge HospitalOS — SQLAlchemy 2.0 Async Models
Multi-tenant architecture: every clinical/operational table carries hospital_id
"""
import uuid
from datetime import datetime, date
from typing import Optional, List
import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from app.database.session import Base
from app.core.enums import (
    UserRole, SubscriptionTier, SubscriptionStatus,
    AppointmentStatus, QueueStatus, Gender,
    WardType, BedStatus, AdmissionStatus, PrescriptionStatus,
    LabOrderStatus, InvoiceStatus, PaymentMethod, PaymentStatus,
    InvoiceItemType, AuditAction, Priority, EncounterType,
)


def gen_uuid():
    return str(uuid.uuid4())


# ─────────────────────────────────────────────────────────────────
# TENANT / ORG
# ─────────────────────────────────────────────────────────────────

class Organization(Base):
    __tablename__ = "organizations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    name: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    slug: Mapped[str] = mapped_column(sa.String(100), unique=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(sa.Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)

    hospitals: Mapped[List["Hospital"]] = relationship(back_populates="organization")


class Hospital(Base):
    __tablename__ = "hospitals"

    id: Mapped[str] = mapped_column(sa.String(36), primary_key=True, default=gen_uuid)
    organization_id: Mapped[Optional[str]] = mapped_column(sa.String(36), sa.ForeignKey("organizations.id"), nullable=True)
    slug: Mapped[str] = mapped_column(sa.String(100), unique=True, nullable=False)
    code: Mapped[str] = mapped_column(sa.String(20), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    legal_name: Mapped[Optional[str]] = mapped_column(sa.String(255))
    license_number: Mapped[Optional[str]] = mapped_column(sa.String(100))
    phone: Mapped[str] = mapped_column(sa.String(20), nullable=False)
    email: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    address_line1: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    address_line2: Mapped[Optional[str]] = mapped_column(sa.String(255))
    city: Mapped[str] = mapped_column(sa.String(100), nullable=False)
    state: Mapped[str] = mapped_column(sa.String(100), nullable=False)
    postal_code: Mapped[str] = mapped_column(sa.String(20), nullable=False)
    country: Mapped[str] = mapped_column(sa.String(100), default="India")
    timezone: Mapped[str] = mapped_column(sa.String(50), default="Asia/Kolkata")
    currency: Mapped[str] = mapped_column(sa.String(10), default="INR")
    logo_url: Mapped[Optional[str]] = mapped_column(sa.Text)
    is_active: Mapped[bool] = mapped_column(sa.Boolean, default=True)
    settings: Mapped[Optional[dict]] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    organization: Mapped[Optional["Organization"]] = relationship(back_populates="hospitals")
    departments: Mapped[List["Department"]] = relationship(back_populates="hospital")
    staff: Mapped[List["HospitalStaff"]] = relationship(back_populates="hospital")
    patients: Mapped[List["Patient"]] = relationship(back_populates="hospital")
    appointments: Mapped[List["Appointment"]] = relationship(back_populates="hospital")
    wards: Mapped[List["Ward"]] = relationship(back_populates="hospital")
    invoices: Mapped[List["Invoice"]] = relationship(back_populates="hospital")
    subscriptions: Mapped[List["HospitalSubscription"]] = relationship(back_populates="hospital")
    audit_logs: Mapped[List["AuditLog"]] = relationship(back_populates="hospital")

    __table_args__ = (
        sa.Index("ix_hospitals_slug", "slug"),
        sa.Index("ix_hospitals_is_active", "is_active"),
    )


class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"

    id: Mapped[str] = mapped_column(sa.String(36), primary_key=True, default=gen_uuid)
    name: Mapped[str] = mapped_column(sa.String(100), nullable=False)
    tier: Mapped[SubscriptionTier] = mapped_column(sa.Enum(SubscriptionTier), unique=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(sa.Text)
    price_monthly: Mapped[float] = mapped_column(sa.Float, default=0.0)
    price_yearly: Mapped[float] = mapped_column(sa.Float, default=0.0)
    max_doctors: Mapped[int] = mapped_column(sa.Integer, default=10)
    max_staff: Mapped[int] = mapped_column(sa.Integer, default=30)
    max_beds: Mapped[int] = mapped_column(sa.Integer, default=50)
    features: Mapped[Optional[list]] = mapped_column(JSONB)
    razorpay_plan_id_monthly: Mapped[Optional[str]] = mapped_column(sa.String(100))
    razorpay_plan_id_yearly: Mapped[Optional[str]] = mapped_column(sa.String(100))
    is_active: Mapped[bool] = mapped_column(sa.Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)


class HospitalSubscription(Base):
    __tablename__ = "hospital_subscriptions"

    id: Mapped[str] = mapped_column(sa.String(36), primary_key=True, default=gen_uuid)
    hospital_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("hospitals.id", ondelete="CASCADE"), nullable=False)
    plan_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("subscription_plans.id"), nullable=False)
    status: Mapped[SubscriptionStatus] = mapped_column(sa.Enum(SubscriptionStatus), default=SubscriptionStatus.TRIALING)
    billing_cycle: Mapped[str] = mapped_column(sa.String(20), default="MONTHLY")
    current_period_start: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)
    current_period_end: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), nullable=False)
    cancel_at_period_end: Mapped[bool] = mapped_column(sa.Boolean, default=False)
    razorpay_subscription_id: Mapped[Optional[str]] = mapped_column(sa.String(100), unique=True)
    razorpay_customer_id: Mapped[Optional[str]] = mapped_column(sa.String(100))
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    hospital: Mapped["Hospital"] = relationship(back_populates="subscriptions")
    plan: Mapped["SubscriptionPlan"] = relationship()

    __table_args__ = (
        sa.Index("ix_hospital_subscriptions_hospital_id", "hospital_id"),
    )


class Department(Base):
    __tablename__ = "departments"

    id: Mapped[str] = mapped_column(sa.String(36), primary_key=True, default=gen_uuid)
    hospital_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("hospitals.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(sa.String(100), nullable=False)
    code: Mapped[str] = mapped_column(sa.String(20), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(sa.Text)
    floor: Mapped[Optional[str]] = mapped_column(sa.String(50))
    is_active: Mapped[bool] = mapped_column(sa.Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    hospital: Mapped["Hospital"] = relationship(back_populates="departments")
    staff: Mapped[List["HospitalStaff"]] = relationship(back_populates="department")
    appointments: Mapped[List["Appointment"]] = relationship(back_populates="department")

    __table_args__ = (
        sa.UniqueConstraint("hospital_id", "code", name="uq_dept_hospital_code"),
        sa.Index("ix_departments_hospital_id", "hospital_id"),
    )


# ─────────────────────────────────────────────────────────────────
# AUTH / USERS / STAFF
# ─────────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(sa.String(36), primary_key=True, default=gen_uuid)
    email: Mapped[str] = mapped_column(sa.String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    first_name: Mapped[str] = mapped_column(sa.String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(sa.String(100), nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(sa.String(20), unique=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(sa.Text)
    is_active: Mapped[bool] = mapped_column(sa.Boolean, default=True)
    is_email_verified: Mapped[bool] = mapped_column(sa.Boolean, default=False)
    two_factor_enabled: Mapped[bool] = mapped_column(sa.Boolean, default=False)
    last_login_at: Mapped[Optional[datetime]] = mapped_column(sa.DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    staff_profiles: Mapped[List["HospitalStaff"]] = relationship(back_populates="user")
    refresh_tokens: Mapped[List["RefreshToken"]] = relationship(back_populates="user")
    audit_logs: Mapped[List["AuditLog"]] = relationship(back_populates="user")

    __table_args__ = (
        sa.Index("ix_users_email", "email"),
    )


class HospitalStaff(Base):
    __tablename__ = "hospital_staff"

    id: Mapped[str] = mapped_column(sa.String(36), primary_key=True, default=gen_uuid)
    user_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    hospital_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("hospitals.id", ondelete="CASCADE"), nullable=False)
    department_id: Mapped[Optional[str]] = mapped_column(sa.String(36), sa.ForeignKey("departments.id", ondelete="SET NULL"))
    role: Mapped[UserRole] = mapped_column(sa.Enum(UserRole), default=UserRole.RECEPTIONIST)
    staff_number: Mapped[Optional[str]] = mapped_column(sa.String(50))
    designation: Mapped[Optional[str]] = mapped_column(sa.String(100))
    qualification: Mapped[Optional[str]] = mapped_column(sa.String(255))
    license_number: Mapped[Optional[str]] = mapped_column(sa.String(100))
    consultation_fee: Mapped[float] = mapped_column(sa.Float, default=0.0)
    digital_signature_url: Mapped[Optional[str]] = mapped_column(sa.Text)
    is_active: Mapped[bool] = mapped_column(sa.Boolean, default=True)
    joining_date: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    user: Mapped["User"] = relationship(back_populates="staff_profiles")
    hospital: Mapped["Hospital"] = relationship(back_populates="staff")
    department: Mapped[Optional["Department"]] = relationship(back_populates="staff")
    schedules: Mapped[List["DoctorSchedule"]] = relationship(back_populates="staff")
    doctor_appointments: Mapped[List["Appointment"]] = relationship(
        back_populates="doctor", foreign_keys="Appointment.doctor_id"
    )

    __table_args__ = (
        sa.UniqueConstraint("hospital_id", "user_id", name="uq_staff_hospital_user"),
        sa.Index("ix_staff_hospital_id", "hospital_id"),
        sa.Index("ix_staff_role", "role"),
    )


class DoctorSchedule(Base):
    __tablename__ = "doctor_schedules"

    id: Mapped[str] = mapped_column(sa.String(36), primary_key=True, default=gen_uuid)
    staff_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("hospital_staff.id", ondelete="CASCADE"), nullable=False)
    day_of_week: Mapped[int] = mapped_column(sa.SmallInteger, nullable=False)  # 0=Mon, 6=Sun
    start_time: Mapped[str] = mapped_column(sa.String(5), nullable=False)  # "09:00"
    end_time: Mapped[str] = mapped_column(sa.String(5), nullable=False)    # "13:00"
    slot_duration_minutes: Mapped[int] = mapped_column(sa.Integer, default=15)
    max_patients: Mapped[int] = mapped_column(sa.Integer, default=20)
    room_number: Mapped[Optional[str]] = mapped_column(sa.String(20))
    is_active: Mapped[bool] = mapped_column(sa.Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)

    staff: Mapped["HospitalStaff"] = relationship(back_populates="schedules")

    __table_args__ = (
        sa.Index("ix_doctor_schedules_staff_id", "staff_id"),
    )


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id: Mapped[str] = mapped_column(sa.String(36), primary_key=True, default=gen_uuid)
    user_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token_hash: Mapped[str] = mapped_column(sa.String(255), unique=True, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), nullable=False)
    revoked_at: Mapped[Optional[datetime]] = mapped_column(sa.DateTime(timezone=True))
    ip_address: Mapped[Optional[str]] = mapped_column(sa.String(45))
    user_agent: Mapped[Optional[str]] = mapped_column(sa.Text)
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)

    user: Mapped["User"] = relationship(back_populates="refresh_tokens")

    __table_args__ = (
        sa.Index("ix_refresh_tokens_user_id", "user_id"),
    )


# ─────────────────────────────────────────────────────────────────
# PATIENT & EMR
# ─────────────────────────────────────────────────────────────────

class Patient(Base):
    __tablename__ = "patients"

    id: Mapped[str] = mapped_column(sa.String(36), primary_key=True, default=gen_uuid)
    hospital_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("hospitals.id", ondelete="CASCADE"), nullable=False)
    uhid: Mapped[str] = mapped_column(sa.String(50), nullable=False)  # e.g. "HOS-2026-001284"
    first_name: Mapped[str] = mapped_column(sa.String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(sa.String(100), nullable=False)
    gender: Mapped[Gender] = mapped_column(sa.Enum(Gender), nullable=False)
    date_of_birth: Mapped[date] = mapped_column(sa.Date, nullable=False)
    blood_group: Mapped[Optional[str]] = mapped_column(sa.String(5))
    phone: Mapped[str] = mapped_column(sa.String(20), nullable=False)
    email: Mapped[Optional[str]] = mapped_column(sa.String(255))
    address_line1: Mapped[Optional[str]] = mapped_column(sa.String(255))
    city: Mapped[Optional[str]] = mapped_column(sa.String(100))
    state: Mapped[Optional[str]] = mapped_column(sa.String(100))
    postal_code: Mapped[Optional[str]] = mapped_column(sa.String(20))
    emergency_contact_name: Mapped[Optional[str]] = mapped_column(sa.String(100))
    emergency_contact_phone: Mapped[Optional[str]] = mapped_column(sa.String(20))
    abha_id: Mapped[Optional[str]] = mapped_column(sa.String(20))  # 14-digit ABHA identifier
    allergies: Mapped[Optional[list]] = mapped_column(JSONB, default=list)
    chronic_conditions: Mapped[Optional[list]] = mapped_column(JSONB, default=list)
    notes: Mapped[Optional[str]] = mapped_column(sa.Text)
    is_active: Mapped[bool] = mapped_column(sa.Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    hospital: Mapped["Hospital"] = relationship(back_populates="patients")
    appointments: Mapped[List["Appointment"]] = relationship(back_populates="patient")
    encounters: Mapped[List["Encounter"]] = relationship(back_populates="patient")
    vitals: Mapped[List["Vital"]] = relationship(back_populates="patient")
    prescriptions: Mapped[List["Prescription"]] = relationship(back_populates="patient")
    lab_orders: Mapped[List["LabOrder"]] = relationship(back_populates="patient")
    admissions: Mapped[List["Admission"]] = relationship(back_populates="patient")
    invoices: Mapped[List["Invoice"]] = relationship(back_populates="patient")

    __table_args__ = (
        sa.UniqueConstraint("hospital_id", "uhid", name="uq_patient_hospital_uhid"),
        sa.Index("ix_patients_hospital_id", "hospital_id"),
        sa.Index("ix_patients_phone", "hospital_id", "phone"),
        sa.Index("ix_patients_name", "hospital_id", "first_name", "last_name"),
    )


class Encounter(Base):
    __tablename__ = "encounters"

    id: Mapped[str] = mapped_column(sa.String(36), primary_key=True, default=gen_uuid)
    hospital_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("hospitals.id", ondelete="CASCADE"), nullable=False)
    patient_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    doctor_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("hospital_staff.id"), nullable=False)
    type: Mapped[EncounterType] = mapped_column(sa.Enum(EncounterType), default=EncounterType.OPD)
    encounter_date: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)
    chief_complaint: Mapped[Optional[str]] = mapped_column(sa.Text)
    hpi: Mapped[Optional[str]] = mapped_column(sa.Text)  # History of Present Illness
    examination_notes: Mapped[Optional[str]] = mapped_column(sa.Text)
    diagnosis_codes: Mapped[Optional[list]] = mapped_column(JSONB, default=list)  # ICD-10
    diagnosis_notes: Mapped[Optional[str]] = mapped_column(sa.Text)
    treatment_plan: Mapped[Optional[str]] = mapped_column(sa.Text)
    advice: Mapped[Optional[str]] = mapped_column(sa.Text)
    follow_up_date: Mapped[Optional[datetime]] = mapped_column(sa.DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    patient: Mapped["Patient"] = relationship(back_populates="encounters")
    doctor: Mapped["HospitalStaff"] = relationship()
    vitals: Mapped[List["Vital"]] = relationship(back_populates="encounter")
    prescriptions: Mapped[List["Prescription"]] = relationship(back_populates="encounter")
    lab_orders: Mapped[List["LabOrder"]] = relationship(back_populates="encounter")

    __table_args__ = (
        sa.Index("ix_encounters_hospital_id", "hospital_id"),
        sa.Index("ix_encounters_patient_id", "patient_id"),
        sa.Index("ix_encounters_doctor_id", "doctor_id"),
    )


class Vital(Base):
    __tablename__ = "vitals"

    id: Mapped[str] = mapped_column(sa.String(36), primary_key=True, default=gen_uuid)
    hospital_id: Mapped[str] = mapped_column(sa.String(36), nullable=False)
    patient_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    encounter_id: Mapped[Optional[str]] = mapped_column(sa.String(36), sa.ForeignKey("encounters.id", ondelete="SET NULL"))
    recorded_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)
    temperature_c: Mapped[Optional[float]] = mapped_column(sa.Float)
    bp_systolic: Mapped[Optional[int]] = mapped_column(sa.Integer)
    bp_diastolic: Mapped[Optional[int]] = mapped_column(sa.Integer)
    pulse_rate: Mapped[Optional[int]] = mapped_column(sa.Integer)
    respiratory_rate: Mapped[Optional[int]] = mapped_column(sa.Integer)
    spo2_percent: Mapped[Optional[int]] = mapped_column(sa.Integer)
    height_cm: Mapped[Optional[float]] = mapped_column(sa.Float)
    weight_kg: Mapped[Optional[float]] = mapped_column(sa.Float)
    bmi: Mapped[Optional[float]] = mapped_column(sa.Float)
    recorded_by_staff_id: Mapped[Optional[str]] = mapped_column(sa.String(36))

    patient: Mapped["Patient"] = relationship(back_populates="vitals")
    encounter: Mapped[Optional["Encounter"]] = relationship(back_populates="vitals")

    __table_args__ = (
        sa.Index("ix_vitals_patient_id", "patient_id"),
    )


# ─────────────────────────────────────────────────────────────────
# APPOINTMENTS & OPD QUEUE
# ─────────────────────────────────────────────────────────────────

class Appointment(Base):
    __tablename__ = "appointments"

    id: Mapped[str] = mapped_column(sa.String(36), primary_key=True, default=gen_uuid)
    hospital_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("hospitals.id", ondelete="CASCADE"), nullable=False)
    patient_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    doctor_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("hospital_staff.id"), nullable=False)
    department_id: Mapped[Optional[str]] = mapped_column(sa.String(36), sa.ForeignKey("departments.id", ondelete="SET NULL"))
    appointment_date: Mapped[datetime] = mapped_column(sa.Date, nullable=False)
    slot_start_time: Mapped[str] = mapped_column(sa.String(5), nullable=False)  # "10:30"
    slot_end_time: Mapped[str] = mapped_column(sa.String(5), nullable=False)
    token_number: Mapped[int] = mapped_column(sa.Integer, nullable=False)
    status: Mapped[AppointmentStatus] = mapped_column(sa.Enum(AppointmentStatus), default=AppointmentStatus.SCHEDULED)
    reason: Mapped[Optional[str]] = mapped_column(sa.Text)
    priority: Mapped[Priority] = mapped_column(sa.Enum(Priority), default=Priority.NORMAL)
    appointment_type: Mapped[str] = mapped_column(sa.String(20), default="WALK_IN")  # WALK_IN, ONLINE, FOLLOW_UP
    notes: Mapped[Optional[str]] = mapped_column(sa.Text)
    booked_by_user_id: Mapped[Optional[str]] = mapped_column(sa.String(36))
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    hospital: Mapped["Hospital"] = relationship(back_populates="appointments")
    patient: Mapped["Patient"] = relationship(back_populates="appointments")
    doctor: Mapped["HospitalStaff"] = relationship(
        back_populates="doctor_appointments", foreign_keys=[doctor_id]
    )
    department: Mapped[Optional["Department"]] = relationship(back_populates="appointments")
    queue_token: Mapped[Optional["QueueToken"]] = relationship(back_populates="appointment")

    __table_args__ = (
        sa.Index("ix_appointments_hospital_date", "hospital_id", "appointment_date"),
        sa.Index("ix_appointments_doctor_date", "doctor_id", "appointment_date"),
        sa.Index("ix_appointments_patient_id", "patient_id"),
    )


class QueueToken(Base):
    __tablename__ = "queue_tokens"

    id: Mapped[str] = mapped_column(sa.String(36), primary_key=True, default=gen_uuid)
    appointment_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("appointments.id", ondelete="CASCADE"), unique=True, nullable=False)
    token_number: Mapped[int] = mapped_column(sa.Integer, nullable=False)
    status: Mapped[QueueStatus] = mapped_column(sa.Enum(QueueStatus), default=QueueStatus.BOOKED)
    room_number: Mapped[Optional[str]] = mapped_column(sa.String(20))
    called_at: Mapped[Optional[datetime]] = mapped_column(sa.DateTime(timezone=True))
    completed_at: Mapped[Optional[datetime]] = mapped_column(sa.DateTime(timezone=True))
    wait_started_at: Mapped[Optional[datetime]] = mapped_column(sa.DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    appointment: Mapped["Appointment"] = relationship(back_populates="queue_token")

    __table_args__ = (
        sa.Index("ix_queue_tokens_status", "status"),
    )


# ─────────────────────────────────────────────────────────────────
# IPD — WARDS, BEDS, ADMISSIONS
# ─────────────────────────────────────────────────────────────────

class Ward(Base):
    __tablename__ = "wards"

    id: Mapped[str] = mapped_column(sa.String(36), primary_key=True, default=gen_uuid)
    hospital_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("hospitals.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(sa.String(100), nullable=False)
    type: Mapped[WardType] = mapped_column(sa.Enum(WardType), default=WardType.GENERAL)
    floor: Mapped[Optional[str]] = mapped_column(sa.String(20))
    base_rate_per_day: Mapped[float] = mapped_column(sa.Float, default=0.0)
    is_active: Mapped[bool] = mapped_column(sa.Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)

    hospital: Mapped["Hospital"] = relationship(back_populates="wards")
    beds: Mapped[List["Bed"]] = relationship(back_populates="ward")

    __table_args__ = (
        sa.Index("ix_wards_hospital_id", "hospital_id"),
    )


class Bed(Base):
    __tablename__ = "beds"

    id: Mapped[str] = mapped_column(sa.String(36), primary_key=True, default=gen_uuid)
    ward_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("wards.id", ondelete="CASCADE"), nullable=False)
    bed_number: Mapped[str] = mapped_column(sa.String(20), nullable=False)
    status: Mapped[BedStatus] = mapped_column(sa.Enum(BedStatus), default=BedStatus.AVAILABLE)
    daily_charge: Mapped[Optional[float]] = mapped_column(sa.Float)
    is_active: Mapped[bool] = mapped_column(sa.Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)

    ward: Mapped["Ward"] = relationship(back_populates="beds")
    admissions: Mapped[List["Admission"]] = relationship(back_populates="bed")

    __table_args__ = (
        sa.UniqueConstraint("ward_id", "bed_number", name="uq_bed_ward"),
        sa.Index("ix_beds_ward_id", "ward_id"),
    )


class Admission(Base):
    __tablename__ = "admissions"

    id: Mapped[str] = mapped_column(sa.String(36), primary_key=True, default=gen_uuid)
    hospital_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("hospitals.id", ondelete="CASCADE"), nullable=False)
    patient_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    bed_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("beds.id"), nullable=False)
    admitting_doctor_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("hospital_staff.id"), nullable=False)
    admission_date: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)
    discharge_date: Mapped[Optional[datetime]] = mapped_column(sa.DateTime(timezone=True))
    status: Mapped[AdmissionStatus] = mapped_column(sa.Enum(AdmissionStatus), default=AdmissionStatus.ADMITTED)
    admitting_diagnosis: Mapped[Optional[str]] = mapped_column(sa.Text)
    discharge_summary: Mapped[Optional[str]] = mapped_column(sa.Text)
    discharge_advice: Mapped[Optional[str]] = mapped_column(sa.Text)
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    patient: Mapped["Patient"] = relationship(back_populates="admissions")
    bed: Mapped["Bed"] = relationship(back_populates="admissions")
    admitting_doctor: Mapped["HospitalStaff"] = relationship()

    __table_args__ = (
        sa.Index("ix_admissions_hospital_id", "hospital_id"),
        sa.Index("ix_admissions_patient_id", "patient_id"),
        sa.Index("ix_admissions_status", "status"),
    )


# ─────────────────────────────────────────────────────────────────
# PHARMACY & INVENTORY
# ─────────────────────────────────────────────────────────────────

class Medicine(Base):
    __tablename__ = "medicines"

    id: Mapped[str] = mapped_column(sa.String(36), primary_key=True, default=gen_uuid)
    hospital_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("hospitals.id", ondelete="CASCADE"), nullable=False)
    brand_name: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    generic_name: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    category: Mapped[Optional[str]] = mapped_column(sa.String(100))
    dosage_form: Mapped[str] = mapped_column(sa.String(50), nullable=False)
    strength: Mapped[Optional[str]] = mapped_column(sa.String(50))
    manufacturer: Mapped[Optional[str]] = mapped_column(sa.String(255))
    unit_of_measure: Mapped[str] = mapped_column(sa.String(30), default="Strip")
    reorder_level: Mapped[int] = mapped_column(sa.Integer, default=50)
    selling_price: Mapped[float] = mapped_column(sa.Float, nullable=False)
    is_active: Mapped[bool] = mapped_column(sa.Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    batches: Mapped[List["InventoryBatch"]] = relationship(back_populates="medicine")
    prescription_items: Mapped[List["PrescriptionItem"]] = relationship(back_populates="medicine")

    __table_args__ = (
        sa.UniqueConstraint("hospital_id", "brand_name", "strength", name="uq_medicine_hospital"),
        sa.Index("ix_medicines_hospital_id", "hospital_id"),
    )


class InventoryBatch(Base):
    __tablename__ = "inventory_batches"

    id: Mapped[str] = mapped_column(sa.String(36), primary_key=True, default=gen_uuid)
    medicine_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("medicines.id", ondelete="CASCADE"), nullable=False)
    batch_number: Mapped[str] = mapped_column(sa.String(100), nullable=False)
    expiry_date: Mapped[date] = mapped_column(sa.Date, nullable=False)
    quantity_in_stock: Mapped[int] = mapped_column(sa.Integer, nullable=False)
    purchase_price: Mapped[float] = mapped_column(sa.Float, nullable=False)
    mrp: Mapped[float] = mapped_column(sa.Float, nullable=False)
    selling_price: Mapped[float] = mapped_column(sa.Float, nullable=False)
    supplier_name: Mapped[Optional[str]] = mapped_column(sa.String(255))
    received_date: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)

    medicine: Mapped["Medicine"] = relationship(back_populates="batches")

    __table_args__ = (
        sa.Index("ix_inventory_batches_medicine_id", "medicine_id"),
        sa.Index("ix_inventory_batches_expiry", "expiry_date"),
    )


class Prescription(Base):
    __tablename__ = "prescriptions"

    id: Mapped[str] = mapped_column(sa.String(36), primary_key=True, default=gen_uuid)
    hospital_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("hospitals.id", ondelete="CASCADE"), nullable=False)
    encounter_id: Mapped[Optional[str]] = mapped_column(sa.String(36), sa.ForeignKey("encounters.id", ondelete="SET NULL"))
    patient_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    doctor_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("hospital_staff.id"), nullable=False)
    status: Mapped[PrescriptionStatus] = mapped_column(sa.Enum(PrescriptionStatus), default=PrescriptionStatus.ACTIVE)
    notes: Mapped[Optional[str]] = mapped_column(sa.Text)
    dispensed_at: Mapped[Optional[datetime]] = mapped_column(sa.DateTime(timezone=True))
    dispensed_by_staff_id: Mapped[Optional[str]] = mapped_column(sa.String(36))
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    patient: Mapped["Patient"] = relationship(back_populates="prescriptions")
    encounter: Mapped[Optional["Encounter"]] = relationship(back_populates="prescriptions")
    doctor: Mapped["HospitalStaff"] = relationship()
    items: Mapped[List["PrescriptionItem"]] = relationship(back_populates="prescription")

    __table_args__ = (
        sa.Index("ix_prescriptions_hospital_id", "hospital_id"),
        sa.Index("ix_prescriptions_patient_id", "patient_id"),
    )


class PrescriptionItem(Base):
    __tablename__ = "prescription_items"

    id: Mapped[str] = mapped_column(sa.String(36), primary_key=True, default=gen_uuid)
    prescription_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("prescriptions.id", ondelete="CASCADE"), nullable=False)
    medicine_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("medicines.id"), nullable=False)
    dosage: Mapped[str] = mapped_column(sa.String(50), nullable=False)
    frequency: Mapped[str] = mapped_column(sa.String(20), nullable=False)  # "1-0-1"
    timing: Mapped[Optional[str]] = mapped_column(sa.String(30))  # AFTER_FOOD, BEFORE_FOOD
    duration_days: Mapped[int] = mapped_column(sa.Integer, nullable=False)
    total_quantity: Mapped[int] = mapped_column(sa.Integer, nullable=False)
    dispensed_qty: Mapped[int] = mapped_column(sa.Integer, default=0)
    instructions: Mapped[Optional[str]] = mapped_column(sa.Text)

    prescription: Mapped["Prescription"] = relationship(back_populates="items")
    medicine: Mapped["Medicine"] = relationship(back_populates="prescription_items")

    __table_args__ = (
        sa.Index("ix_prescription_items_prescription_id", "prescription_id"),
    )


# ─────────────────────────────────────────────────────────────────
# LABORATORY
# ─────────────────────────────────────────────────────────────────

class LabTest(Base):
    __tablename__ = "lab_tests"

    id: Mapped[str] = mapped_column(sa.String(36), primary_key=True, default=gen_uuid)
    hospital_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("hospitals.id", ondelete="CASCADE"), nullable=False)
    code: Mapped[str] = mapped_column(sa.String(20), nullable=False)  # "CBC", "LFT"
    name: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    category: Mapped[str] = mapped_column(sa.String(100), nullable=False)  # "Hematology"
    sample_type: Mapped[str] = mapped_column(sa.String(50), nullable=False)  # "Blood"
    standard_fee: Mapped[float] = mapped_column(sa.Float, nullable=False)
    tat_hours: Mapped[int] = mapped_column(sa.Integer, default=24)
    normal_range: Mapped[Optional[str]] = mapped_column(sa.String(255))
    unit: Mapped[Optional[str]] = mapped_column(sa.String(30))
    is_active: Mapped[bool] = mapped_column(sa.Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)

    __table_args__ = (
        sa.UniqueConstraint("hospital_id", "code", name="uq_lab_test_hospital_code"),
        sa.Index("ix_lab_tests_hospital_id", "hospital_id"),
    )


class LabOrder(Base):
    __tablename__ = "lab_orders"

    id: Mapped[str] = mapped_column(sa.String(36), primary_key=True, default=gen_uuid)
    hospital_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("hospitals.id", ondelete="CASCADE"), nullable=False)
    patient_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    encounter_id: Mapped[Optional[str]] = mapped_column(sa.String(36), sa.ForeignKey("encounters.id", ondelete="SET NULL"))
    ordered_by_doctor_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("hospital_staff.id"), nullable=False)
    status: Mapped[LabOrderStatus] = mapped_column(sa.Enum(LabOrderStatus), default=LabOrderStatus.ORDERED)
    clinical_notes: Mapped[Optional[str]] = mapped_column(sa.Text)
    sample_collected_at: Mapped[Optional[datetime]] = mapped_column(sa.DateTime(timezone=True))
    completed_at: Mapped[Optional[datetime]] = mapped_column(sa.DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    patient: Mapped["Patient"] = relationship(back_populates="lab_orders")
    encounter: Mapped[Optional["Encounter"]] = relationship(back_populates="lab_orders")
    results: Mapped[List["LabResult"]] = relationship(back_populates="lab_order")

    __table_args__ = (
        sa.Index("ix_lab_orders_hospital_id", "hospital_id"),
        sa.Index("ix_lab_orders_patient_id", "patient_id"),
        sa.Index("ix_lab_orders_status", "status"),
    )


class LabResult(Base):
    __tablename__ = "lab_results"

    id: Mapped[str] = mapped_column(sa.String(36), primary_key=True, default=gen_uuid)
    lab_order_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("lab_orders.id", ondelete="CASCADE"), nullable=False)
    lab_test_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("lab_tests.id"), nullable=False)
    result_value: Mapped[Optional[str]] = mapped_column(sa.String(255))
    reference_range: Mapped[Optional[str]] = mapped_column(sa.String(100))
    unit: Mapped[Optional[str]] = mapped_column(sa.String(30))
    is_abnormal: Mapped[bool] = mapped_column(sa.Boolean, default=False)
    comments: Mapped[Optional[str]] = mapped_column(sa.Text)
    performed_by_staff_id: Mapped[Optional[str]] = mapped_column(sa.String(36))
    approved_by_doctor_id: Mapped[Optional[str]] = mapped_column(sa.String(36))
    report_file_url: Mapped[Optional[str]] = mapped_column(sa.Text)
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    lab_order: Mapped["LabOrder"] = relationship(back_populates="results")
    lab_test: Mapped["LabTest"] = relationship()

    __table_args__ = (
        sa.Index("ix_lab_results_lab_order_id", "lab_order_id"),
    )


# ─────────────────────────────────────────────────────────────────
# BILLING & PAYMENTS
# ─────────────────────────────────────────────────────────────────

class Invoice(Base):
    __tablename__ = "invoices"

    id: Mapped[str] = mapped_column(sa.String(36), primary_key=True, default=gen_uuid)
    hospital_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("hospitals.id", ondelete="CASCADE"), nullable=False)
    patient_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    invoice_number: Mapped[str] = mapped_column(sa.String(50), nullable=False)
    status: Mapped[InvoiceStatus] = mapped_column(sa.Enum(InvoiceStatus), default=InvoiceStatus.DRAFT)
    sub_total: Mapped[float] = mapped_column(sa.Float, default=0.0)
    tax_amount: Mapped[float] = mapped_column(sa.Float, default=0.0)
    discount_amount: Mapped[float] = mapped_column(sa.Float, default=0.0)
    total_amount: Mapped[float] = mapped_column(sa.Float, default=0.0)
    paid_amount: Mapped[float] = mapped_column(sa.Float, default=0.0)
    balance_amount: Mapped[float] = mapped_column(sa.Float, default=0.0)
    due_date: Mapped[Optional[datetime]] = mapped_column(sa.DateTime(timezone=True))
    notes: Mapped[Optional[str]] = mapped_column(sa.Text)
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    hospital: Mapped["Hospital"] = relationship(back_populates="invoices")
    patient: Mapped["Patient"] = relationship(back_populates="invoices")
    items: Mapped[List["InvoiceItem"]] = relationship(back_populates="invoice")
    payments: Mapped[List["Payment"]] = relationship(back_populates="invoice")

    __table_args__ = (
        sa.UniqueConstraint("hospital_id", "invoice_number", name="uq_invoice_hospital"),
        sa.Index("ix_invoices_hospital_id", "hospital_id"),
        sa.Index("ix_invoices_patient_id", "patient_id"),
        sa.Index("ix_invoices_status", "status"),
    )


class InvoiceItem(Base):
    __tablename__ = "invoice_items"

    id: Mapped[str] = mapped_column(sa.String(36), primary_key=True, default=gen_uuid)
    invoice_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("invoices.id", ondelete="CASCADE"), nullable=False)
    item_type: Mapped[InvoiceItemType] = mapped_column(sa.Enum(InvoiceItemType), default=InvoiceItemType.MISCELLANEOUS)
    description: Mapped[str] = mapped_column(sa.String(255), nullable=False)
    quantity: Mapped[int] = mapped_column(sa.Integer, default=1)
    unit_price: Mapped[float] = mapped_column(sa.Float, nullable=False)
    total_price: Mapped[float] = mapped_column(sa.Float, nullable=False)

    invoice: Mapped["Invoice"] = relationship(back_populates="items")

    __table_args__ = (
        sa.Index("ix_invoice_items_invoice_id", "invoice_id"),
    )


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[str] = mapped_column(sa.String(36), primary_key=True, default=gen_uuid)
    hospital_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("hospitals.id", ondelete="CASCADE"), nullable=False)
    invoice_id: Mapped[str] = mapped_column(sa.String(36), sa.ForeignKey("invoices.id", ondelete="CASCADE"), nullable=False)
    amount: Mapped[float] = mapped_column(sa.Float, nullable=False)
    method: Mapped[PaymentMethod] = mapped_column(sa.Enum(PaymentMethod), default=PaymentMethod.CASH)
    status: Mapped[PaymentStatus] = mapped_column(sa.Enum(PaymentStatus), default=PaymentStatus.PENDING)
    razorpay_order_id: Mapped[Optional[str]] = mapped_column(sa.String(100), unique=True)
    razorpay_payment_id: Mapped[Optional[str]] = mapped_column(sa.String(100), unique=True)
    razorpay_signature: Mapped[Optional[str]] = mapped_column(sa.String(255))
    transaction_ref: Mapped[Optional[str]] = mapped_column(sa.String(100))
    received_by_user_id: Mapped[Optional[str]] = mapped_column(sa.String(36))
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    invoice: Mapped["Invoice"] = relationship(back_populates="payments")

    __table_args__ = (
        sa.Index("ix_payments_hospital_id", "hospital_id"),
        sa.Index("ix_payments_invoice_id", "invoice_id"),
    )


# ─────────────────────────────────────────────────────────────────
# AUDIT LOGS (IMMUTABLE — HIPAA / DISHA COMPLIANCE)
# ─────────────────────────────────────────────────────────────────

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(sa.String(36), primary_key=True, default=gen_uuid)
    hospital_id: Mapped[Optional[str]] = mapped_column(sa.String(36), sa.ForeignKey("hospitals.id", ondelete="SET NULL"))
    user_id: Mapped[Optional[str]] = mapped_column(sa.String(36), sa.ForeignKey("users.id", ondelete="SET NULL"))
    action: Mapped[AuditAction] = mapped_column(sa.Enum(AuditAction), nullable=False)
    resource_type: Mapped[str] = mapped_column(sa.String(50), nullable=False)
    resource_id: Mapped[Optional[str]] = mapped_column(sa.String(36))
    description: Mapped[str] = mapped_column(sa.Text, nullable=False)
    meta_data: Mapped[Optional[dict]] = mapped_column(JSONB)
    ip_address: Mapped[Optional[str]] = mapped_column(sa.String(45))
    user_agent: Mapped[Optional[str]] = mapped_column(sa.Text)
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), default=datetime.utcnow)

    hospital: Mapped[Optional["Hospital"]] = relationship(back_populates="audit_logs")
    user: Mapped[Optional["User"]] = relationship(back_populates="audit_logs")

    __table_args__ = (
        sa.Index("ix_audit_logs_hospital_date", "hospital_id", "created_at"),
        sa.Index("ix_audit_logs_resource", "resource_type", "resource_id"),
        sa.Index("ix_audit_logs_user_id", "user_id"),
    )


# Import for model resolution
from sqlalchemy import String
