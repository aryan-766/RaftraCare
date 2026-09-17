"""
Auth + RBAC Tests
"""
import pytest
from app.modules.auth.security import (
    hash_password, verify_password,
    create_access_token, decode_token,
    verify_razorpay_payment_signature,
)
from app.core.permissions import has_permission, get_role_permissions
from app.core.enums import UserRole


# ── Password Hashing ─────────────────────────────────────────────

def test_password_hash_and_verify():
    pwd = "Admin@Hospital123"
    hashed = hash_password(pwd)
    assert hashed != pwd
    assert verify_password(pwd, hashed) is True
    assert verify_password("wrong_password", hashed) is False


def test_bcrypt_produces_unique_hashes():
    pwd = "SamePassword@1"
    h1 = hash_password(pwd)
    h2 = hash_password(pwd)
    assert h1 != h2  # bcrypt uses random salt


# ── JWT Token ────────────────────────────────────────────────────

def test_access_token_roundtrip():
    payload = {
        "sub": "user-uuid-123",
        "role": "DOCTOR",
        "hospital_id": "hospital-uuid-456",
    }
    token = create_access_token(payload)
    decoded = decode_token(token)

    assert decoded["sub"] == "user-uuid-123"
    assert decoded["role"] == "DOCTOR"
    assert decoded["hospital_id"] == "hospital-uuid-456"
    assert decoded["type"] == "access"


def test_invalid_token_raises():
    from app.core.exceptions import UnauthorizedError
    with pytest.raises(UnauthorizedError):
        decode_token("invalid.jwt.token")


# ── RBAC Permission Matrix ───────────────────────────────────────

def test_super_admin_has_all_permissions():
    from app.core.permissions import PERMISSIONS
    for perm in PERMISSIONS:
        assert has_permission(UserRole.SUPER_ADMIN, perm), f"SuperAdmin missing: {perm}"


def test_doctor_cannot_access_admin_settings():
    assert has_permission(UserRole.DOCTOR, "admin:settings") is False


def test_doctor_can_write_prescriptions():
    assert has_permission(UserRole.DOCTOR, "prescriptions:write") is True


def test_receptionist_cannot_see_audit_logs():
    assert has_permission(UserRole.RECEPTIONIST, "audit:read") is False


def test_receptionist_can_manage_queue():
    assert has_permission(UserRole.RECEPTIONIST, "queue:manage") is True


def test_accountant_cannot_write_emr():
    assert has_permission(UserRole.ACCOUNTANT, "emr:write") is False


def test_pharmacist_can_dispense():
    assert has_permission(UserRole.PHARMACIST, "pharmacy:dispense") is True


def test_lab_tech_cannot_write_prescriptions():
    assert has_permission(UserRole.LAB_TECHNICIAN, "prescriptions:write") is False


def test_nurse_can_write_emr():
    assert has_permission(UserRole.NURSE, "emr:write") is True


def test_patient_only_reads_own_data():
    assert has_permission(UserRole.PATIENT, "patients:read") is True
    assert has_permission(UserRole.PATIENT, "patients:write") is False
    assert has_permission(UserRole.PATIENT, "prescriptions:write") is False


# ── Razorpay Signature Verification ─────────────────────────────

def test_razorpay_invalid_signature_rejected():
    result = verify_razorpay_payment_signature(
        "order_fake123",
        "pay_fake456",
        "wrong_signature_value",
    )
    assert result is False
