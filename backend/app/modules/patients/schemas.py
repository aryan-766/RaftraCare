"""
Patient Schemas — Pydantic v2
"""
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import date, datetime
from app.core.enums import Gender


class RegisterPatientRequest(BaseModel):
    first_name: str = Field(min_length=2, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    gender: Gender
    date_of_birth: date
    blood_group: Optional[str] = None
    phone: str = Field(min_length=10, max_length=20)
    email: Optional[EmailStr] = None
    address_line1: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    abha_id: Optional[str] = None
    allergies: List[str] = []
    chronic_conditions: List[str] = []
    notes: Optional[str] = None


class RecordVitalsRequest(BaseModel):
    encounter_id: Optional[str] = None
    temperature_c: Optional[float] = Field(default=None, ge=30.0, le=45.0)
    bp_systolic: Optional[int] = Field(default=None, ge=50, le=250)
    bp_diastolic: Optional[int] = Field(default=None, ge=30, le=150)
    pulse_rate: Optional[int] = Field(default=None, ge=30, le=220)
    respiratory_rate: Optional[int] = Field(default=None, ge=8, le=60)
    spo2_percent: Optional[int] = Field(default=None, ge=50, le=100)
    height_cm: Optional[float] = Field(default=None, ge=20.0, le=260.0)
    weight_kg: Optional[float] = Field(default=None, ge=1.0, le=350.0)


class CreateEncounterRequest(BaseModel):
    patient_id: str
    type: str = "OPD"
    chief_complaint: str = Field(min_length=1)
    hpi: Optional[str] = None
    examination_notes: Optional[str] = None
    diagnosis_codes: List[str] = []
    diagnosis_notes: Optional[str] = None
    treatment_plan: Optional[str] = None
    advice: Optional[str] = None
    follow_up_date: Optional[datetime] = None


class PrescriptionItemRequest(BaseModel):
    medicine_id: str
    dosage: str = Field(min_length=1)
    frequency: str = Field(min_length=1)
    timing: Optional[str] = None
    duration_days: int = Field(ge=1)
    total_quantity: int = Field(ge=1)
    instructions: Optional[str] = None


class CreatePrescriptionRequest(BaseModel):
    patient_id: str
    encounter_id: Optional[str] = None
    notes: Optional[str] = None
    items: List[PrescriptionItemRequest] = Field(min_length=1)
