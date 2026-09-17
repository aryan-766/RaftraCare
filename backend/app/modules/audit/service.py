"""
Audit Service — Immutable HIPAA/DISHA compliant audit trail
"""
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database.models import AuditLog
from app.core.enums import AuditAction
from app.core.logging import logger


class AuditService:

    async def log(
        self,
        db: AsyncSession,
        action: AuditAction,
        resource_type: str,
        description: str,
        hospital_id: Optional[str] = None,
        user_id: Optional[str] = None,
        resource_id: Optional[str] = None,
        meta_data: Optional[dict] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
    ) -> None:
        """Write an immutable audit log entry — never raises, always logs"""
        try:
            entry = AuditLog(
                hospital_id=hospital_id,
                user_id=user_id,
                action=action,
                resource_type=resource_type,
                resource_id=resource_id,
                description=description,
                meta_data=meta_data,
                ip_address=ip_address,
                user_agent=user_agent,
            )
            db.add(entry)
            # We flush but do NOT commit — caller controls transaction
            await db.flush([entry])
        except Exception as e:
            logger.error("Failed to write audit log", error=str(e), action=action, resource_type=resource_type)

    async def query_logs(
        self,
        db: AsyncSession,
        hospital_id: str,
        action: Optional[AuditAction] = None,
        resource_type: Optional[str] = None,
        user_id: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        page: int = 1,
        limit: int = 25,
    ) -> dict:
        from datetime import datetime, timezone

        limit = min(100, limit)
        offset = (page - 1) * limit

        query = select(AuditLog).where(AuditLog.hospital_id == hospital_id)

        if action:
            query = query.where(AuditLog.action == action)
        if resource_type:
            query = query.where(AuditLog.resource_type == resource_type)
        if user_id:
            query = query.where(AuditLog.user_id == user_id)
        if start_date:
            query = query.where(AuditLog.created_at >= datetime.fromisoformat(start_date))
        if end_date:
            query = query.where(AuditLog.created_at <= datetime.fromisoformat(end_date))

        count_result = await db.execute(select(func.count()).select_from(query.subquery()))
        total = count_result.scalar_one()

        result = await db.execute(
            query.order_by(AuditLog.created_at.desc()).offset(offset).limit(limit)
        )
        logs = result.scalars().all()

        return {
            "logs": logs,
            "meta": {
                "page": page,
                "limit": limit,
                "total": total,
                "total_pages": (total + limit - 1) // limit,
            },
        }


audit_service = AuditService()
