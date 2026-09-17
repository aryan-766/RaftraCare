from fastapi import APIRouter, Depends, Query
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.modules.audit.service import audit_service
from app.dependencies import require_permissions
from app.core.responses import success_response
from app.core.enums import AuditAction

router = APIRouter(prefix="/audit", tags=["Audit Logs"])


@router.get("/")
async def get_audit_logs(
    action: Optional[AuditAction] = Query(default=None),
    resource_type: Optional[str] = Query(default=None),
    user_id: Optional[str] = Query(default=None),
    start_date: Optional[str] = Query(default=None),
    end_date: Optional[str] = Query(default=None),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=25, ge=1, le=100),
    ctx: tuple = Depends(require_permissions("audit:read")),
    db: AsyncSession = Depends(get_db),
):
    user, hospital_id = ctx
    result = await audit_service.query_logs(
        db=db, hospital_id=hospital_id,
        action=action, resource_type=resource_type, user_id=user_id,
        start_date=start_date, end_date=end_date,
        page=page, limit=limit,
    )
    logs = [
        {
            "id": log.id, "action": log.action, "resource_type": log.resource_type,
            "resource_id": log.resource_id, "description": log.description,
            "user_id": log.user_id, "ip_address": log.ip_address,
            "created_at": str(log.created_at),
        }
        for log in result["logs"]
    ]
    return success_response(logs, meta=result["meta"])
