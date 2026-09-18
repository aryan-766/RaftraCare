"""
Auth Router — Hospital registration, login, token refresh, facility switching, and logout
"""
from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.session import get_db
from app.database.models import Hospital
from app.modules.auth.schemas import (
    RegisterHospitalRequest, LoginRequest, RefreshTokenRequest,
    SwitchHospitalRequest, LogoutRequest,
)
from app.modules.auth.service import auth_service
from app.core.responses import created_response, success_response
from app.dependencies import get_current_user, AuthenticatedUser
from app.modules.audit.service import audit_service
from app.core.enums import AuditAction, UserRole

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register-hospital", status_code=201)
async def register_hospital(
    payload: RegisterHospitalRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    result = await auth_service.register_hospital(db, payload)

    await audit_service.log(
        db=db,
        hospital_id=result["hospital"]["id"],
        user_id=result["user"]["id"],
        action=AuditAction.CREATE,
        resource_type="HOSPITAL",
        resource_id=result["hospital"]["id"],
        description=f"Hospital '{result['hospital']['name']}' onboarded with admin {result['user']['email']}",
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )

    return created_response(result, "Hospital registered successfully")


@router.post("/login")
async def login(
    payload: LoginRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    result = await auth_service.login(
        db, payload,
        ip=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )

    await audit_service.log(
        db=db,
        hospital_id=result["user"].get("hospital_id"),
        user_id=result["user"]["id"],
        action=AuditAction.LOGIN,
        resource_type="AUTH",
        resource_id=result["user"]["id"],
        description=f"User {result['user']['email']} logged in",
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )

    return success_response(result, "Logged in successfully")


@router.post("/refresh")
async def refresh_token(
    payload: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db),
):
    tokens = await auth_service.refresh_access_token(db, payload.refresh_token)
    return success_response(tokens, "Token refreshed")


@router.get("/facilities")
async def get_my_facilities(
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    facilities = await auth_service.get_user_facilities(
        db, current_user.id, is_super_admin=current_user.role == UserRole.SUPER_ADMIN
    )
    return success_response(facilities)


@router.post("/switch-hospital")
async def switch_hospital(
    payload: SwitchHospitalRequest,
    request: Request,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await auth_service.switch_hospital(
        db=db,
        user_id=current_user.id,
        target_hospital_id=payload.hospital_id,
        ip=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )

    await audit_service.log(
        db=db,
        hospital_id=payload.hospital_id,
        user_id=current_user.id,
        action=AuditAction.UPDATE,
        resource_type="HOSPITAL_CONTEXT",
        resource_id=payload.hospital_id,
        description=f"User {current_user.email} switched operational context to facility {result['hospital']['name']}",
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )

    return success_response(result, "Operational facility context switched")


@router.post("/logout")
async def logout(
    payload: LogoutRequest = LogoutRequest(),
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await auth_service.logout(db, current_user.id, payload.refresh_token)
    return success_response({"logged_out": True}, "Session terminated successfully")


@router.get("/me")
async def get_me(
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    facilities = await auth_service.get_user_facilities(
        db, current_user.id, is_super_admin=current_user.role == UserRole.SUPER_ADMIN
    )

    active_hospital_data = None
    if current_user.hospital_id:
        hosp_res = await db.execute(
            select(Hospital).where(Hospital.id == current_user.hospital_id)
        )
        h = hosp_res.scalar_one_or_none()
        if h:
            active_hospital_data = {
                "id": h.id,
                "name": h.name,
                "slug": h.slug,
                "code": h.code,
                "city": h.city,
                "state": h.state,
                "phone": h.phone,
                "email": h.email,
                "currency": h.currency,
            }

    return success_response({
        "id": current_user.id,
        "email": current_user.email,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "role": current_user.role,
        "hospital_id": current_user.hospital_id,
        "hospital": active_hospital_data,
        "staff_id": current_user.staff_id,
        "available_facilities": facilities,
    })
