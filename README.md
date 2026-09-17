# RaftraCare HospitalOS — Monorepo

## Structure
```
RaftraCare/
├── backend/          # FastAPI Python backend
│   ├── app/          # Application code
│   ├── alembic/      # DB migrations
│   ├── seeds/        # Dev data seeders
│   ├── tests/        # Unit & integration tests
│   └── README.md     # Backend setup guide
├── frontend/
│   ├── landing/      # Marketing landing page (Next.js)
│   └── app/          # Hospital OS dashboard (Next.js)
└── README.md
```

## Quick Start
```bash
# 1. Backend
cd backend
pip install -r requirements.txt
cp .env.example .env   # Fill in your Supabase + Razorpay keys
alembic upgrade head
uvicorn app.main:app --reload --port 8000
# API: http://localhost:8000/api/v1
# Docs: http://localhost:8000/docs
```

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI 0.115 + Python 3.11 |
| ORM | SQLAlchemy 2.0 Async |
| Migrations | Alembic |
| Database | Supabase (PostgreSQL 15) |
| Auth | JWT (HS256) + bcrypt |
| Payments | Razorpay 2.0 |
| Logging | structlog (JSON in prod) |
| Deployment | Render (backend) + Vercel (frontend) |
| Frontend | Next.js 14 (App Router) |

## Security
- RBAC: 9 roles × 35+ granular permissions  
- Multi-tenancy: `hospital_id` discriminator on every table
- HIPAA/DISHA: Immutable audit trail on all PHI access
- Razorpay: HMAC-SHA256 signature verification
- JWT: Refresh token rotation, 30-day sessions
