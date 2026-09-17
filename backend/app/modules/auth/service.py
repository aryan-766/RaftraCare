"""
Auth Service — Hospital onboarding, login, and token lifecycle management
"""
from datetime import datetime, timedelta, timezone, date as date_type
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.database.models import (
    Hospital, User, HospitalStaff, Department, HospitalSubscription,
    SubscriptionPlan, RefreshToken
)
from app.core.enums import UserRole, SubscriptionTier, SubscriptionStatus
from app.core.exceptions import ConflictError, UnauthorizedError, NotFoundError
from app.core.logging import logger
from app.modules.auth.security import (
    hash_password, verify_password,
    create_access_token, create_refresh_token, decode_token, hash_token
)
from app.modules.auth.schemas import RegisterHospitalRequest, LoginRequest


class AuthService:

    async def register_hospital(
        self, db: AsyncSession, data: RegisterHospitalRequest
    ) -> dict:
        # 1. Check slug uniqueness
        existing = await db.execute(
            select(Hospital).where(
                or_(
                    Hospital.slug == data.hospital_slug.lower(),
                    Hospital.code == data.hospital_code.upper(),
                )
            )
        )
        if existing.scalar_one_or_none():
            raise ConflictError("Hospital with this slug or code already exists")

        # 2. Check admin email uniqueness
        existing_user = await db.execute(
            select(User).where(User.email == data.admin_email.lower())
        )
        if existing_user.scalar_one_or_none():
            raise ConflictError("An admin account with this email already exists")

        # 3. Create Hospital
        hospital = Hospital(
            name=data.hospital_name,
            slug=data.hospital_slug.lower(),
            code=data.hospital_code.upper(),
            phone=data.phone,
            email=data.email.lower(),
            address_line1=data.address_line1,
            address_line2=data.address_line2,
            city=data.city,
            state=data.state,
            postal_code=data.postal_code,
            country=data.country,
            currency=data.currency,
        )
        db.add(hospital)
        await db.flush()  # get hospital.id

        # 4. Create default departments
        defaults = [
            ("Outpatient Department", "OPD"),
            ("General Medicine", "GEN"),
            ("Emergency & Trauma", "EMR"),
        ]
        for dept_name, dept_code in defaults:
            db.add(Department(
                hospital_id=hospital.id,
                name=dept_name,
                code=dept_code,
            ))

        # 5. Create admin User
        user = User(
            email=data.admin_email.lower(),
            password_hash=hash_password(data.admin_password),
            first_name=data.admin_first_name,
            last_name=data.admin_last_name,
            phone=data.admin_phone,
            is_email_verified=True,
        )
        db.add(user)
        await db.flush()

        # 6. Link user to hospital as HOSPITAL_ADMIN
        staff = HospitalStaff(
            user_id=user.id,
            hospital_id=hospital.id,
            role=UserRole.HOSPITAL_ADMIN,
            designation="Hospital Administrator",
        )
        db.add(staff)

        # 7. Create or get FREE_TRIAL plan and assign subscription
        result = await db.execute(
            select(SubscriptionPlan).where(SubscriptionPlan.tier == SubscriptionTier.FREE_TRIAL)
        )
        free_plan = result.scalar_one_or_none()
        if not free_plan:
            free_plan = SubscriptionPlan(
                name="14-Day Free Trial",
                tier=SubscriptionTier.FREE_TRIAL,
                price_monthly=0.0,
                price_yearly=0.0,
                max_doctors=5,
                max_staff=20,
                max_beds=25,
                features=["OPD", "EMR", "BILLING", "PHARMACY", "LAB"],
            )
            db.add(free_plan)
            await db.flush()

        trial_end = datetime.now(timezone.utc) + timedelta(days=14)
        db.add(HospitalSubscription(
            hospital_id=hospital.id,
            plan_id=free_plan.id,
            status=SubscriptionStatus.TRIALING,
            current_period_start=datetime.now(timezone.utc),
            current_period_end=trial_end,
        ))

        await db.flush()

        # 8. Generate tokens
        tokens = await self._generate_tokens(db, user, staff, hospital)
        await db.commit()

        logger.info(
            "Hospital registered",
            hospital_id=hospital.id,
            hospital_slug=hospital.slug,
            admin_email=user.email,
        )

        return {
            "hospital": {"id": hospital.id, "name": hospital.name, "slug": hospital.slug, "code": hospital.code},
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": staff.role,
                "hospital_id": hospital.id,
            },
            "tokens": tokens,
        }

    async def login(self, db: AsyncSession, data: LoginRequest, ip: Optional[str] = None, user_agent: Optional[str] = None) -> dict:
        # 1. Find user by email
        result = await db.execute(
            select(User)
            .where(User.email == data.email.lower())
            .where(User.is_active == True)
        )
        user = result.scalar_one_or_none()

        if not user or not verify_password(data.password, user.password_hash):
            raise UnauthorizedError("Invalid email or password")

        # 2. Resolve hospital context
        staff_query = (
            select(HospitalStaff, Hospital)
            .join(Hospital, HospitalStaff.hospital_id == Hospital.id)
            .where(HospitalStaff.user_id == user.id)
            .where(HospitalStaff.is_active == True)
        )
        if data.hospital_slug:
            staff_query = staff_query.where(Hospital.slug == data.hospital_slug.lower())

        staff_result = await db.execute(staff_query)
        row = staff_result.first()

        active_staff = row[0] if row else None
        active_hospital = row[1] if row else None

        role = active_staff.role if active_staff else UserRole.PATIENT
        hospital_id = active_hospital.id if active_hospital else None

        # 3. Update last login
        user.last_login_at = datetime.now(timezone.utc)

        # 4. Generate tokens
        tokens = await self._generate_tokens(db, user, active_staff, active_hospital, ip, user_agent)
        await db.commit()

        logger.info("User logged in", user_id=user.id, role=role, hospital_id=hospital_id)

        return {
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": role,
                "hospital_id": hospital_id,
                "hospital_name": active_hospital.name if active_hospital else None,
                "hospital_slug": active_hospital.slug if active_hospital else None,
            },
            "tokens": tokens,
        }

    async def refresh_access_token(self, db: AsyncSession, refresh_token_str: str) -> dict:
        payload = decode_token(refresh_token_str)
        if payload.get("type") != "refresh":
            raise UnauthorizedError("Invalid token type")

        token_hash = hash_token(refresh_token_str)
        result = await db.execute(
            select(RefreshToken)
            .where(RefreshToken.token_hash == token_hash)
            .where(RefreshToken.revoked_at == None)  # noqa: E711
        )
        stored = result.scalar_one_or_none()

        if not stored or datetime.now(timezone.utc) > stored.expires_at.replace(tzinfo=timezone.utc):
            raise UnauthorizedError("Refresh token expired or revoked")

        # Revoke old token (rotation)
        stored.revoked_at = datetime.now(timezone.utc)

        # Get user + active staff
        user_result = await db.execute(
            select(User).where(User.id == stored.user_id)
        )
        user = user_result.scalar_one_or_none()
        if not user:
            raise UnauthorizedError("User not found")

        tokens = await self._generate_tokens(db, user, None, None)
        await db.commit()
        return tokens

    async def _generate_tokens(
        self, db: AsyncSession, user: User,
        staff: Optional[HospitalStaff],
        hospital: Optional[Hospital],
        ip: Optional[str] = None,
        user_agent: Optional[str] = None,
    ) -> dict:
        role = staff.role.value if staff else UserRole.PATIENT.value
        payload = {
            "sub": user.id,
            "email": user.email,
            "role": role,
            "hospital_id": hospital.id if hospital else None,
            "staff_id": staff.id if staff else None,
        }

        access_token = create_access_token(payload)
        refresh_token = create_refresh_token(user.id)
        token_hash = hash_token(refresh_token)

        expires_at = datetime.now(timezone.utc) + timedelta(days=30)
        db.add(RefreshToken(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=expires_at,
            ip_address=ip,
            user_agent=user_agent,
        ))

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "Bearer",
            "expires_in": "7d",
        }


auth_service = AuthService()
