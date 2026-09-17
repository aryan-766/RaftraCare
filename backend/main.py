"""
Entry point — uvicorn server
"""
import uvicorn
from app.core.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.port,
        reload=not settings.is_production,
        log_level="debug" if settings.debug else "info",
        access_log=False,  # We handle structured logging in middleware
    )
