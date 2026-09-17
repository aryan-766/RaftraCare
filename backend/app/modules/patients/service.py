"""
Patient Service — Registration, UHID generation, EMR, Vitals, Encounters, Prescriptions
"""
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from app.database.models import (
    Patient, Hospital, Encounter, Vital,
    Prescription, PrescriptionItem, Medicine
)
from app.core.exceptions import NotFoundError, BadRequestError
from app.modules.patients.schemas import (
    RegisterPatientRequest, RecordVitalsRequest,
    CreateEncounterRequest, CreatePrescriptionRequest
)


class PatientService:

    async def _generate_uhid(self, db: AsyncSession, hospital_id: str) -> str:
        result = await db.execute(
            select(Hospital).where(Hospital.id == hospital_id)
        )
        hospital = result.scalar_one_or_none()
        prefix = hospital.code if hospital else "HOS"

        count_result = await db.execute(
            select(func.count()).where(Patient.hospital_id == hospital_id)
        )
        count = count_result.scalar_one() or 0
        return f"{prefix}-{str(count + 1).zfill(6)}"

    async def register(
        self, db: AsyncSession, hospital_id: str, data: RegisterPatientRequest
    ) -> Patient:
        uhid = await self._generate_uhid(db, hospital_id)

        patient = Patient(
            hospital_id=hospital_id,
            uhid=uhid,
            first_name=data.first_name,
            last_name=data.last_name,
            gender=data.gender,
            date_of_birth=data.date_of_birth,
            blood_group=data.blood_group,
            phone=data.phone,
            email=str(data.email) if data.email else None,
            address_line1=data.address_line1,
            city=data.city,
            state=data.state,
            postal_code=data.postal_code,
            emergency_contact_name=data.emergency_contact_name,
            emergency_contact_phone=data.emergency_contact_phone,
            abha_id=data.abha_id,
            allergies=data.allergies,
            chronic_conditions=data.chronic_conditions,
            notes=data.notes,
        )
        db.add(patient)
        await db.commit()
        await db.refresh(patient)
        return patient

    async def search(
        self, db: AsyncSession, hospital_id: str,
        search: Optional[str] = None,
        page: int = 1, limit: int = 15
    ) -> dict:
        limit = min(50, limit)
        offset = (page - 1) * limit

        base = select(Patient).where(
            Patient.hospital_id == hospital_id,
            Patient.is_active == True,
        )

        if search:
            base = base.where(
                or_(
                    Patient.uhid.ilike(f"%{search}%"),
                    Patient.phone.contains(search),
                    Patient.first_name.ilike(f"%{search}%"),
                    Patient.last_name.ilike(f"%{search}%"),
                )
            )

        count_result = await db.execute(select(func.count()).select_from(base.subquery()))
        total = count_result.scalar_one()

        result = await db.execute(
            base.order_by(Patient.created_at.desc()).offset(offset).limit(limit)
        )
        patients = result.scalars().all()

        return {
            "patients": patients,
            "meta": {
                "page": page, "limit": limit, "total": total,
                "total_pages": (total + limit - 1) // limit,
            },
        }

    async def get_medical_record(
        self, db: AsyncSession, hospital_id: str, patient_id: str
    ) -> Patient:
        result = await db.execute(
            select(Patient).where(
                Patient.id == patient_id,
                Patient.hospital_id == hospital_id,
            )
        )
        patient = result.scalar_one_or_none()
        if not patient:
            raise NotFoundError("Patient not found in this hospital")
        return patient

    async def record_vitals(
        self, db: AsyncSession, hospital_id: str,
        patient_id: str, staff_id: Optional[str],
        data: RecordVitalsRequest
    ) -> Vital:
        # Verify patient belongs to tenant
        result = await db.execute(
            select(Patient).where(Patient.id == patient_id, Patient.hospital_id == hospital_id)
        )
        if not result.scalar_one_or_none():
            raise NotFoundError("Patient not found")

        bmi = None
        if data.height_cm and data.weight_kg:
            h = data.height_cm / 100
            bmi = round(data.weight_kg / (h * h), 1)

        vital = Vital(
            hospital_id=hospital_id,
            patient_id=patient_id,
            encounter_id=data.encounter_id,
            temperature_c=data.temperature_c,
            bp_systolic=data.bp_systolic,
            bp_diastolic=data.bp_diastolic,
            pulse_rate=data.pulse_rate,
            respiratory_rate=data.respiratory_rate,
            spo2_percent=data.spo2_percent,
            height_cm=data.height_cm,
            weight_kg=data.weight_kg,
            bmi=bmi,
            recorded_by_staff_id=staff_id,
        )
        db.add(vital)
        await db.commit()
        await db.refresh(vital)
        return vital

    async def create_encounter(
        self, db: AsyncSession, hospital_id: str,
        doctor_staff_id: str, data: CreateEncounterRequest
    ) -> Encounter:
        encounter = Encounter(
            hospital_id=hospital_id,
            patient_id=data.patient_id,
            doctor_id=doctor_staff_id,
            type=data.type,
            chief_complaint=data.chief_complaint,
            hpi=data.hpi,
            examination_notes=data.examination_notes,
            diagnosis_codes=data.diagnosis_codes,
            diagnosis_notes=data.diagnosis_notes,
            treatment_plan=data.treatment_plan,
            advice=data.advice,
            follow_up_date=data.follow_up_date,
        )
        db.add(encounter)
        await db.commit()
        await db.refresh(encounter)
        return encounter

    async def create_prescription(
        self, db: AsyncSession, hospital_id: str,
        doctor_staff_id: str, data: CreatePrescriptionRequest
    ) -> Prescription:
        prescription = Prescription(
            hospital_id=hospital_id,
            patient_id=data.patient_id,
            encounter_id=data.encounter_id,
            doctor_id=doctor_staff_id,
            notes=data.notes,
        )
        db.add(prescription)
        await db.flush()

        for item in data.items:
            db.add(PrescriptionItem(
                prescription_id=prescription.id,
                medicine_id=item.medicine_id,
                dosage=item.dosage,
                frequency=item.frequency,
                timing=item.timing,
                duration_days=item.duration_days,
                total_quantity=item.total_quantity,
                instructions=item.instructions,
            ))

        await db.commit()
        await db.refresh(prescription)
        return prescription


patient_service = PatientService()
