"""
RaftraCare HospitalOS — Database Seeder (Development Only)
Generates a demo hospital with admin, lead doctor, departments, and sample clinical setup.
Run: python -m seeds.seed_demo
"""
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.session import AsyncSessionLocal
from app.modules.auth.service import auth_service
from app.modules.auth.schemas import RegisterHospitalRequest
from app.database.models import User, HospitalStaff, Department, SubscriptionPlan
from app.core.enums import UserRole, SubscriptionTier
from app.modules.auth.security import hash_password
from sqlalchemy import select


async def seed():
    print("🌱  Seeding RaftraCare HospitalOS demo data...")

    async with AsyncSessionLocal() as db:
        try:
            # 0. Ensure all Subscription Plans exist
            plans_data = [
                {
                    "name": "14-Day Free Trial",
                    "tier": SubscriptionTier.FREE_TRIAL,
                    "description": "Full access to HospitalOS features for 14 days",
                    "price_monthly": 0.0,
                    "price_yearly": 0.0,
                    "max_doctors": 10,
                    "max_staff": 30,
                    "max_beds": 50,
                    "features": ["OPD Queue & Token Display", "EMR & Digital Prescriptions", "Basic Invoicing & Payments", "Single Branch"],
                },
                {
                    "name": "Starter Clinic",
                    "tier": SubscriptionTier.STARTER,
                    "description": "Essential operations for polyclinics and nursing homes",
                    "price_monthly": 4999.0,
                    "price_yearly": 49990.0,
                    "max_doctors": 15,
                    "max_staff": 50,
                    "max_beds": 100,
                    "features": ["OPD & Queue Engine", "Full EMR & Prescription Printing", "Razorpay Payment Links", "Inventory & Pharmacy Core", "Email & SMS Alerts"],
                },
                {
                    "name": "Hospital Growth",
                    "tier": SubscriptionTier.GROWTH,
                    "description": "Comprehensive HospitalOS for multi-speciality centers",
                    "price_monthly": 9999.0,
                    "price_yearly": 99990.0,
                    "max_doctors": 50,
                    "max_staff": 150,
                    "max_beds": 300,
                    "features": ["All Starter Features", "IPD, OT & Bed Allocation", "NABH/DISHA Audit Trails", "Multi-Counter Billing", "Advanced Analytics & Reports", "Priority Support"],
                },
                {
                    "name": "Enterprise Network",
                    "tier": SubscriptionTier.ENTERPRISE,
                    "description": "Custom workflows for hospital chains and large institutes",
                    "price_monthly": 24999.0,
                    "price_yearly": 249990.0,
                    "max_doctors": 500,
                    "max_staff": 1500,
                    "max_beds": 1000,
                    "features": ["Multi-Facility Context Switching", "Custom EMR Templates", "Full REST API & HL7/FHIR Access", "Dedicated Account Manager", "99.99% SLA Uptime"],
                },
            ]

            for pd in plans_data:
                existing_p = await db.execute(
                    select(SubscriptionPlan).where(SubscriptionPlan.tier == pd["tier"])
                )
                if not existing_p.scalar_one_or_none():
                    db.add(SubscriptionPlan(**pd))
            await db.flush()
            print("✅  SaaS Subscription Plans seeded (FREE_TRIAL, STARTER, GROWTH, ENTERPRISE)")

            # 1. Register hospital with admin account
            print("🏥  Registering demo hospital — City Care Hospital...")
            req = RegisterHospitalRequest(
                hospital_name="City Care Hospital",
                hospital_slug="city-care",
                hospital_code="CCH",
                phone="9876543210",
                email="contact@citycare.in",
                address_line1="12 Medical Campus Road",
                city="Mumbai",
                state="Maharashtra",
                postal_code="400001",
                admin_first_name="Dr. Rahul",
                admin_last_name="Sharma",
                admin_email="admin@citycare.in",
                admin_password="Admin@123456",
                admin_phone="9876543210",
            )
            result = await auth_service.register_hospital(db, req)
            hospital_id = result["hospital"]["id"]
            print(f"✅  Hospital: {result['hospital']['name']} (ID: {hospital_id})")
            print(f"✅  Admin: {result['user']['email']}")

            # 2. Add Lead Doctor account
            doctor_user = User(
                email="doctor@citycare.in",
                password_hash=hash_password("Doctor@123456"),
                first_name="Dr. Priya",
                last_name="Nair",
                phone="9876543211",
                is_active=True,
                is_email_verified=True,
            )
            db.add(doctor_user)
            await db.flush()

            # Find General Medicine department
            dept_res = await db.execute(
                select(Department).where(Department.hospital_id == hospital_id, Department.code == "GEN")
            )
            dept = dept_res.scalar_one_or_none()

            doc_staff = HospitalStaff(
                user_id=doctor_user.id,
                hospital_id=hospital_id,
                department_id=dept.id if dept else None,
                role=UserRole.DOCTOR,
                designation="Senior Consultant Physician",
                qualification="MBBS, MD (Medicine)",
                license_number="MCI-48291",
                consultation_fee=800.0,
                is_active=True,
            )
            db.add(doc_staff)
            await db.commit()

            print(f"✅  Doctor: {doctor_user.email}")
            print(f"📦  Subscription: FREE_TRIAL (14 days active)")
            print(f"\n🔑  Test credentials:")
            print(f"    Admin:  admin@citycare.in  | Admin@123456")
            print(f"    Doctor: doctor@citycare.in | Doctor@123456")
            print(f"\n✅  Development seed complete!")
        except Exception as e:
            print(f"❌  Seed status: {e}")


if __name__ == "__main__":
    asyncio.run(seed())
