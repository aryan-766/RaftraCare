"""
CareBridge HospitalOS — Database Seeder (Development)
Generates a demo hospital with admin, departments, sample staff, and patients.
Run: python -m backend.seeds.seed_demo
"""
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.session import AsyncSessionLocal
from app.modules.auth.service import auth_service
from app.modules.auth.schemas import RegisterHospitalRequest


async def seed():
    print("🌱  Seeding demo hospital — City Care Hospital...")

    async with AsyncSessionLocal() as db:
        try:
            req = RegisterHospitalRequest(
                hospital_name="City Care Hospital",
                hospital_slug="city-care",
                hospital_code="CCH",
                phone="9876543210",
                email="admin@citycare.in",
                address_line1="12 Medical Campus Road",
                city="Mumbai",
                state="Maharashtra",
                postal_code="400001",
                admin_first_name="Rahul",
                admin_last_name="Sharma",
                admin_email="rahul@citycare.in",
                admin_password="Admin@123456",
                admin_phone="9876543210",
            )
            result = await auth_service.register_hospital(db, req)
            print(f"✅  Hospital: {result['hospital']['name']} (ID: {result['hospital']['id']})")
            print(f"✅  Admin: {result['user']['email']} | UHID ready")
            print(f"📦  Subscription: FREE_TRIAL (14 days)")
            print(f"\n🔑  Admin credentials:")
            print(f"    Email: rahul@citycare.in")
            print(f"    Password: Admin@123456")
            print(f"\n✅  Seed complete!")
        except Exception as e:
            print(f"❌  Seed failed: {e}")
            raise


if __name__ == "__main__":
    asyncio.run(seed())
