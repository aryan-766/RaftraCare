"""
FastAPI Dependencies — Auth, Tenant, RBAC
"""
from typing import Optional, Annotated
from fastapi import Depends, Header, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.session import get_db
from app.database.models import User, HospitalStaff, Hospital
from app.core.exceptions import UnauthorizedError, ForbiddenError, BadRequestError
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
        raise UnauthorizedError("User not found or deactivated")

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
    """Resolve and validate tenant context. Returns (user, hospital_id)"""

    hospital_id = current_user.hospital_id

    # Super Admin can override tenant via header
    if current_user.role == UserRole.SUPER_ADMIN and x_hospital_id:
        hospital_id = x_hospital_id

    if not hospital_id:
        raise BadRequestError("No hospital context found. User is not assigned to a hospital.")

    result = await db.execute(
        select(Hospital).where(Hospital.id == hospital_id)
    )
    hospital = result.scalar_one_or_none()

    if not hospital:
        raise BadRequestError("Hospital not found")

    if not hospital.is_active and current_user.role != UserRole.SUPER_ADMIN:
        raise ForbiddenError("Hospital is deactivated. Contact platform support.")

    return current_user, hospital_id


def require_permissions(*permissions: str):
    """Dependency factory: require one or more permissions"""

    async def _dependency(
        tenant_ctx: tuple = Depends(get_current_tenant),
    ) -> tuple[AuthenticatedUser, str]:
        user, hospital_id = tenant_ctx

        if user.role == UserRole.SUPER_ADMIN:
            return user, hospital_id

        missing = [p for p in permissions if not user.has_permission(p)]
        if missing:
            raise ForbiddenError(
                f"Access denied. Missing permissions: [{', '.join(missing)}]"
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
                f"Role '{current_user.role}' is not authorized for this action"
            )
        return current_user

    return _dependency
