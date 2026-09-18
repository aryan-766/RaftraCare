from app.core.enums import UserRole
from typing import Set, Dict


# Fine-grained permissions as string constants
Permission = str

# All available permissions
PERMISSIONS = {
    # Tenant / Org / Facilities
    "hospitals:read",
    "hospitals:create",
    "hospitals:update",
    "hospitals:billing",
    "subscriptions:manage",
    # Staff
    "staff:read",
    "staff:write",
    "staff:manage",
    "staff:delete",
    # Patients & EMR
    "patients:read",
    "patients:write",
    "patients:delete",
    "emr:read",
    "emr:write",
    # Appointments & Queue
    "appointments:read",
    "appointments:write",
    "appointments:cancel",
    "queue:read",
    "queue:manage",
    # Prescriptions & Pharmacy
    "prescriptions:read",
    "prescriptions:write",
    "pharmacy:read",
    "pharmacy:dispense",
    "pharmacy:inventory",
    # Lab & Diagnostics
    "lab:read",
    "lab:order",
    "lab:results_write",
    # Radiology
    "radiology:read",
    "radiology:order",
    "radiology:results_write",
    # IPD / Beds
    "wards:read",
    "wards:manage",
    "admissions:read",
    "admissions:write",
    # Billing & Finance
    "invoices:read",
    "invoices:write",
    "payments:process",
    "payments:refund",
    "reports:financial",
    # Insurance
    "insurance:read",
    "insurance:write",
    # Audit
    "audit:read",
    # Admin
    "admin:settings",
}

# Role → Permission Matrix
ROLE_PERMISSIONS: Dict[UserRole, Set[str]] = {
    UserRole.SUPER_ADMIN: PERMISSIONS,  # Full access across all tenants

    UserRole.HOSPITAL_ADMIN: {
        "hospitals:read", "hospitals:update", "hospitals:billing", "subscriptions:manage",
        "staff:read", "staff:write", "staff:manage", "staff:delete",
        "patients:read", "patients:write",
        "emr:read",
        "appointments:read", "appointments:write", "appointments:cancel",
        "queue:read", "queue:manage",
        "prescriptions:read",
        "pharmacy:read", "pharmacy:inventory",
        "lab:read",
        "radiology:read",
        "wards:read", "wards:manage",
        "admissions:read",
        "invoices:read", "invoices:write",
        "payments:process", "payments:refund",
        "reports:financial",
        "insurance:read", "insurance:write",
        "audit:read",
        "admin:settings",
    },

    UserRole.DOCTOR: {
        "patients:read", "patients:write",
        "emr:read", "emr:write",
        "appointments:read", "appointments:write",
        "queue:read", "queue:manage",
        "prescriptions:read", "prescriptions:write",
        "lab:read", "lab:order",
        "radiology:read", "radiology:order",
        "wards:read",
        "admissions:read", "admissions:write",
    },

    UserRole.NURSE: {
        "patients:read",
        "emr:read", "emr:write",
        "appointments:read",
        "queue:read",
        "prescriptions:read",
        "wards:read",
        "admissions:read", "admissions:write",
    },

    UserRole.RECEPTIONIST: {
        "patients:read", "patients:write",
        "appointments:read", "appointments:write", "appointments:cancel",
        "queue:read", "queue:manage",
        "invoices:read", "invoices:write",
        "payments:process",
    },

    UserRole.PHARMACIST: {
        "patients:read",
        "prescriptions:read",
        "pharmacy:read", "pharmacy:dispense", "pharmacy:inventory",
        "invoices:read", "invoices:write",
        "payments:process",
    },

    UserRole.LAB_TECHNICIAN: {
        "patients:read",
        "lab:read", "lab:order", "lab:results_write",
    },

    UserRole.ACCOUNTANT: {
        "patients:read",
        "invoices:read", "invoices:write",
        "payments:process",
        "reports:financial",
        "insurance:read", "insurance:write",
    },

    UserRole.PATIENT: {
        "patients:read",
        "emr:read",
        "appointments:read", "appointments:write", "appointments:cancel",
        "prescriptions:read",
        "lab:read",
        "radiology:read",
        "invoices:read",
    },
}


def has_permission(role: UserRole, permission: str) -> bool:
    """Check if a role has a specific permission"""
    return permission in ROLE_PERMISSIONS.get(role, set())


def get_role_permissions(role: UserRole) -> Set[str]:
    """Get all permissions for a role"""
    return ROLE_PERMISSIONS.get(role, set())
