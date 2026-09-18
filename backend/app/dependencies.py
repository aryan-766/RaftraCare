"""
FastAPI Dependencies — Auth, Tenant, RBAC, Multi-Tenancy Enforcement
"""
from typing import Optional, Annotated, List
from fastapi import Depends, Header, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.session import get_db
from app.database.models import User, HospitalStaff, Hospital
from app.core.exceptions import UnauthorizedError, ForbiddenError, BadRequestError, NotFoundError
from app.core.enums import UserRole
from app.core.permissions import has_permission, get_role_permissions
from app.modules.auth.security import decode_token
import structlog

logger = structlog.get_logger()

http_bearer = HTTPBearer(auto_error=False)


class AuthenticatedUser:
    def __init__(
        self,
        user_id: str,
        email: str,
        role: UserRole,
        hospital_id: Optional[str] = None,
        staff_id: Optional[str] = None,
        department_id: Optional[str] = None,
        first_name: str = "",
        last_name: str = "",
    ):
        self.id = user_id
        self.email = email
        self.role = role
        self.hospital_id = hospital_id
        self.staff_id = staff_id
        self.department_id = department_id
        self.first_name = first_name
        self.last_name = last_name

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}".strip()

    def has_permission(self, permission: str) -> bool:
        return has_permission(self.role, permission)


async def get_current_user(
    credentials: Annotated[Optional[HTTPAuthorizationCredentials], Depends(http_bearer)],
    db: AsyncSession = Depends(get_db),
) -> AuthenticatedUser:
    if not credentials or not credentials.credentials:
        raise UnauthorizedError("Missing Bearer token in Authorization header")

    token = credentials.credentials
    payload = decode_token(token)

    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedError("Invalid token payload")

    # Verify user is active
    result = await db.execute(
        select(User).where(User.id == user_id).where(User.is_active == True)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise UnauthorizedError("User not found or account deactivated")

    role_str = payload.get("role", UserRole.PATIENT.value)
    try:
        role = UserRole(role_str)
    except ValueError:
        role = UserRole.PATIENT

    return AuthenticatedUser(
        user_id=user.id,
        email=user.email,
        role=role,
        hospital_id=payload.get("hospital_id"),
        staff_id=payload.get("staff_id"),
        first_name=user.first_name,
        last_name=user.last_name,
    )


async def get_current_tenant(
    current_user: AuthenticatedUser = Depends(get_current_user),
    x_hospital_id: Optional[str] = Header(default=None),
    db: AsyncSession = Depends(get_db),
) -> tuple[AuthenticatedUser, str]:
    """
    Strict Tenant Isolation Dependency:
    Derives and validates authorized tenant context from:
    1. Super Admin: can access any active hospital facility.
    2. Regular Staff / Admin: must have verified, active HospitalStaff membership
       in the target hospital facility (whether selected via x_hospital_id or token).
    Never trusts arbitrary facility headers.
    Returns (user, validated_hospital_id).
    """
    target_hospital_id = x_hospital_id or current_user.hospital_id

    if not target_hospital_id:
        raise BadRequestError("No hospital context provided. User is not bound to a facility.")

    # 1. Verify hospital facility exists and is active
    result = await db.execute(
        select(Hospital).where(Hospital.id == target_hospital_id)
    )
    hospital = result.scalar_one_or_none()

    if not hospital:
        raise NotFoundError("Hospital facility not found")

    if not hospital.is_active and current_user.role != UserRole.SUPER_ADMIN:
        raise ForbiddenError("Hospital facility is deactivated. Contact platform administrator.")

    # 2. Authorization check
    if current_user.role == UserRole.SUPER_ADMIN:
        current_user.hospital_id = target_hospital_id
        return current_user, target_hospital_id

    # For non-superadmin: verify user has active staff membership in this specific hospital
    staff_result = await db.execute(
        select(HospitalStaff).where(
            HospitalStaff.user_id == current_user.id,
            HospitalStaff.hospital_id == target_hospital_id,
            HospitalStaff.is_active == True,
        )
    )
    staff_record = staff_result.scalar_one_or_none()

    if not staff_record:
        # Check if user is an Organization owner/admin
        if hospital.organization_id:
            org_user_check = await db.execute(
                select(HospitalStaff).join(Hospital, HospitalStaff.hospital_id == Hospital.id).where(
                    HospitalStaff.user_id == current_user.id,
                    Hospital.organization_id == hospital.organization_id,
                    HospitalStaff.role.in_([UserRole.HOSPITAL_ADMIN, UserRole.SUPER_ADMIN]),
                    HospitalStaff.is_active == True,
                )
            )
            if org_user_check.scalar_one_or_none():
                current_user.hospital_id = target_hospital_id
                current_user.role = UserRole.HOSPITAL_ADMIN
                return current_user, target_hospital_id

        raise ForbiddenError(f"Access denied: You do not have active authorization for facility {hospital.name}")

    # Bind active staff context for the selected facility
    current_user.hospital_id = target_hospital_id
    current_user.staff_id = staff_record.id
    current_user.role = staff_record.role
    current_user.department_id = staff_record.department_id

    return current_user, target_hospital_id


def require_permissions(*permissions: str):
    """Dependency factory: require one or more fine-grained permissions"""

    async def _dependency(
        tenant_ctx: tuple = Depends(get_current_tenant),
    ) -> tuple[AuthenticatedUser, str]:
        user, hospital_id = tenant_ctx

        if user.role == UserRole.SUPER_ADMIN:
            return user, hospital_id

        missing = [p for p in permissions if not user.has_permission(p)]
        if missing:
            raise ForbiddenError(
                f"Access denied. Missing required permissions: [{', '.join(missing)}]"
            )

        return user, hospital_id

    return _dependency


def require_roles(*roles: UserRole):
    """Dependency factory: require specific role(s)"""

    async def _dependency(
        current_user: AuthenticatedUser = Depends(get_current_user),
    ) -> AuthenticatedUser:
        if current_user.role == UserRole.SUPER_ADMIN:
            return current_user
        if current_user.role not in roles:
            raise ForbiddenError(
                f"Role '{current_user.role.value}' is not authorized for this operation"
            )
        return current_user

    return _dependency
