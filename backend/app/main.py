"""
RaftraCare HospitalOS — Main FastAPI Application
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import time
import uuid
import structlog

from app.core.config import settings
from app.core.logging import configure_logging, logger
from app.core.exceptions import RaftraCareException, EXCEPTION_STATUS_MAP
from app.database.session import check_db_connection

# Routers
from app.modules.auth.router import router as auth_router
from app.modules.patients.router import router as patients_router
from app.modules.appointments.router import router as appointments_router
from app.modules.billing.router import router as billing_router
from app.modules.audit.router import router as audit_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown lifecycle"""
    configure_logging()
    logger.info(
        "RaftraCare HospitalOS starting",
        environment=settings.environment,
        api_prefix=settings.api_prefix,
    )
    db_ok = await check_db_connection()
    if db_ok:
        logger.info("Database connection established")
    else:
        logger.warning("Database not reachable — will retry on first request")

    yield

    logger.info("RaftraCare HospitalOS shutting down")
    from app.database.session import engine
    await engine.dispose()


def create_app() -> FastAPI:
    app = FastAPI(
        title="RaftraCare HospitalOS",
        description="Enterprise multi-tenant Hospital Operating System API",
        version="1.0.0",
        docs_url="/docs" if not settings.is_production else None,
        redoc_url="/redoc" if not settings.is_production else None,
        lifespan=lifespan,
    )

    # ── CORS ─────────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*", "x-hospital-id", "x-razorpay-signature"],
    )

    # ── GZip Compression ─────────────────────────────────────────
    app.add_middleware(GZipMiddleware, minimum_size=500)

    # ── Request ID + Timing Middleware ───────────────────────────
    @app.middleware("http")
    async def request_middleware(request: Request, call_next):
        request_id = str(uuid.uuid4())[:8]
        structlog.contextvars.clear_contextvars()
        structlog.contextvars.bind_contextvars(request_id=request_id)

        start = time.monotonic()
        response = await call_next(request)
        duration_ms = round((time.monotonic() - start) * 1000, 1)

        response.headers["X-Request-ID"] = request_id
        response.headers["X-Response-Time"] = f"{duration_ms}ms"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "SAMEORIGIN"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        if request.url.path not in ("/healthz", "/readyz", "/health"):
            logger.info(
                "Request",
                method=request.method,
                path=request.url.path,
                status=response.status_code,
                duration_ms=duration_ms,
            )
        return response

    # ── Global Exception Handlers ────────────────────────────────
    @app.exception_handler(RaftraCareException)
    async def carebridge_exception_handler(request: Request, exc: RaftraCareException):
        status_code = EXCEPTION_STATUS_MAP.get(exc.code, 400)
        return JSONResponse(
            status_code=status_code,
            content={
                "success": False,
                "error": {"code": exc.code, "message": exc.message},
            },
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        logger.error("Unhandled exception", error=str(exc), path=request.url.path)
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": {
                    "code": "INTERNAL_SERVER_ERROR",
                    "message": "An unexpected error occurred. Please try again." if settings.is_production else str(exc),
                },
            },
        )

    # ── Health & Readiness Endpoints ─────────────────────────────
    @app.get("/health", tags=["Health"])
    @app.get("/healthz", tags=["Health"])
    async def health_check():
        return {
            "status": "ok",
            "service": "raftracare-hospitalos",
            "environment": settings.environment,
        }

    @app.get("/readyz", tags=["Health"])
    async def readiness_check():
        db_ok = await check_db_connection()
        return {"ready": db_ok, "database": "connected" if db_ok else "unreachable"}

    # ── Mount Routers ─────────────────────────────────────────────
    prefix = settings.api_prefix

    app.include_router(auth_router, prefix=prefix)
    app.include_router(patients_router, prefix=prefix)
    app.include_router(appointments_router, prefix=prefix)
    app.include_router(billing_router, prefix=prefix)
    app.include_router(audit_router, prefix=prefix)

    # ── 404 Handler ───────────────────────────────────────────────
    @app.exception_handler(404)
    async def not_found_handler(request: Request, exc):
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "error": {
                    "code": "ROUTE_NOT_FOUND",
                    "message": f"Endpoint {request.method} {request.url.path} does not exist",
                },
            },
        )

    return app


app = create_app()
