from fastapi import APIRouter, Depends, Query, Request
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.modules.patients.schemas import (
    RegisterPatientRequest, RecordVitalsRequest,
    CreateEncounterRequest, CreatePrescriptionRequest
)
from app.modules.patients.service import patient_service
from app.modules.audit.service import audit_service
from app.dependencies import require_permissions, AuthenticatedUser
from app.core.responses import created_response, success_response
from app.core.enums import AuditAction
from app.core.exceptions import BadRequestError

router = APIRouter(prefix="/patients", tags=["Patients & EMR"])


@router.post("/", status_code=201)
async def register_patient(
    payload: RegisterPatientRequest,
    request: Request,
    ctx: tuple = Depends(require_permissions("patients:write")),
    db: AsyncSession = Depends(get_db),
):
    user, hospital_id = ctx
    patient = await patient_service.register(db, hospital_id, payload)

    await audit_service.log(
        db=db, hospital_id=hospital_id, user_id=user.id,
        action=AuditAction.CREATE, resource_type="PATIENT", resource_id=patient.id,
        description=f"Registered patient UHID {patient.uhid} — {patient.first_name} {patient.last_name}",
        ip_address=request.client.host if request.client else None,
    )
    return created_response(
        {"id": patient.id, "uhid": patient.uhid, "name": f"{patient.first_name} {patient.last_name}"},
        "Patient registered successfully",
    )


@router.get("/")
async def list_patients(
    search: Optional[str] = Query(default=None),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=15, ge=1, le=50),
    ctx: tuple = Depends(require_permissions("patients:read")),
    db: AsyncSession = Depends(get_db),
):
    user, hospital_id = ctx
    result = await patient_service.search(db, hospital_id, search, page, limit)
    patients = [
        {
            "id": p.id, "uhid": p.uhid,
            "name": f"{p.first_name} {p.last_name}",
            "gender": p.gender, "phone": p.phone,
            "date_of_birth": str(p.date_of_birth),
            "blood_group": p.blood_group,
        }
        for p in result["patients"]
    ]
    return success_response(patients, meta=result["meta"])


@router.get("/{patient_id}")
async def get_patient(
    patient_id: str,
    request: Request,
    ctx: tuple = Depends(require_permissions("patients:read")),
    db: AsyncSession = Depends(get_db),
):
    user, hospital_id = ctx
    patient = await patient_service.get_medical_record(db, hospital_id, patient_id)

    # HIPAA — log PHI read access
    await audit_service.log(
        db=db, hospital_id=hospital_id, user_id=user.id,
        action=AuditAction.READ, resource_type="PATIENT_EMR", resource_id=patient_id,
        description=f"Accessed EMR for patient UHID {patient.uhid}",
        ip_address=request.client.host if request.client else None,
    )
    return success_response({
        "id": patient.id, "uhid": patient.uhid,
        "first_name": patient.first_name, "last_name": patient.last_name,
        "gender": patient.gender, "date_of_birth": str(patient.date_of_birth),
        "blood_group": patient.blood_group, "phone": patient.phone, "email": patient.email,
        "address_line1": patient.address_line1, "city": patient.city, "state": patient.state,
        "allergies": patient.allergies, "chronic_conditions": patient.chronic_conditions,
        "abha_id": patient.abha_id, "notes": patient.notes,
        "emergency_contact_name": patient.emergency_contact_name,
        "emergency_contact_phone": patient.emergency_contact_phone,
    })


@router.post("/{patient_id}/vitals", status_code=201)
async def record_vitals(
    patient_id: str,
    payload: RecordVitalsRequest,
    ctx: tuple = Depends(require_permissions("emr:write")),
    db: AsyncSession = Depends(get_db),
):
    user, hospital_id = ctx
    vital = await patient_service.record_vitals(db, hospital_id, patient_id, user.staff_id, payload)
    return created_response({"id": vital.id, "bmi": vital.bmi, "recorded_at": str(vital.recorded_at)}, "Vitals recorded")


@router.post("/encounters", status_code=201)
async def create_encounter(
    payload: CreateEncounterRequest,
    request: Request,
    ctx: tuple = Depends(require_permissions("emr:write")),
    db: AsyncSession = Depends(get_db),
):
    user, hospital_id = ctx
    if not user.staff_id:
        raise BadRequestError("Doctor staff profile required to create encounter")

    encounter = await patient_service.create_encounter(db, hospital_id, user.staff_id, payload)

    await audit_service.log(
        db=db, hospital_id=hospital_id, user_id=user.id,
        action=AuditAction.CREATE, resource_type="ENCOUNTER", resource_id=encounter.id,
        description=f"Created encounter for patient {payload.patient_id}",
        ip_address=request.client.host if request.client else None,
    )
    return created_response({"id": encounter.id, "type": encounter.type}, "Encounter saved")


@router.post("/prescriptions", status_code=201)
async def create_prescription(
    payload: CreatePrescriptionRequest,
    request: Request,
    ctx: tuple = Depends(require_permissions("prescriptions:write")),
    db: AsyncSession = Depends(get_db),
):
    user, hospital_id = ctx
    if not user.staff_id:
        raise BadRequestError("Doctor staff profile required to issue prescription")

    prescription = await patient_service.create_prescription(db, hospital_id, user.staff_id, payload)

    await audit_service.log(
        db=db, hospital_id=hospital_id, user_id=user.id,
        action=AuditAction.CREATE, resource_type="PRESCRIPTION", resource_id=prescription.id,
        description=f"Prescription issued for patient {payload.patient_id} — {len(payload.items)} items",
        ip_address=request.client.host if request.client else None,
    )
    return created_response({"id": prescription.id, "status": prescription.status}, "Prescription created")
