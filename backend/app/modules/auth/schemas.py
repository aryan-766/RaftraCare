"""
Auth Schemas — Pydantic v2 validation models for authentication endpoints
"""
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from app.core.enums import UserRole


class RegisterHospitalRequest(BaseModel):
    # Hospital details
    hospital_name: str = Field(min_length=2, max_length=255)
    hospital_slug: str = Field(min_length=2, max_length=50, pattern=r"^[a-z0-9-]+$")
    hospital_code: str = Field(min_length=2, max_length=10, pattern=r"^[A-Z0-9-]+$")
    phone: str = Field(min_length=8, max_length=20)
    email: EmailStr
    address_line1: str = Field(min_length=3, max_length=255)
    address_line2: Optional[str] = None
    city: str = Field(min_length=2, max_length=100)
    state: str = Field(min_length=2, max_length=100)
    postal_code: str = Field(min_length=3, max_length=20)
    country: str = "India"
    currency: str = "INR"

    # Primary admin account
    admin_first_name: str = Field(min_length=2, max_length=100)
    admin_last_name: str = Field(min_length=2, max_length=100)
    admin_email: EmailStr
    admin_password: str = Field(min_length=8, max_length=128)
    admin_phone: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)
    hospital_slug: Optional[str] = None


class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(min_length=1)


class InviteStaffRequest(BaseModel):
    email: EmailStr
    first_name: str = Field(min_length=2, max_length=100)
    last_name: str = Field(min_length=2, max_length=100)
    role: UserRole
    department_id: Optional[str] = None
    designation: Optional[str] = None
    qualification: Optional[str] = None
    license_number: Optional[str] = None
    consultation_fee: Optional[float] = Field(default=0.0, ge=0)
    phone: Optional[str] = None
    password: str = Field(min_length=8, max_length=128)


# ── Response Schemas ─────────────────────────────────────────────

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    expires_in: str

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    role: UserRole
    hospital_id: Optional[str] = None
    hospital_name: Optional[str] = None
    hospital_slug: Optional[str] = None

    class Config:
        from_attributes = True


class HospitalResponse(BaseModel):
    id: str
    name: str
    slug: str
    code: str

    class Config:
        from_attributes = True


class RegisterHospitalResponse(BaseModel):
    hospital: HospitalResponse
    user: UserResponse
    tokens: TokenResponse


class LoginResponse(BaseModel):
    user: UserResponse
    tokens: TokenResponse
