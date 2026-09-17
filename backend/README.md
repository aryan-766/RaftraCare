# RaftraCare HospitalOS — Python Backend

## Project Structure
```
backend/
├── app/
│   ├── core/          # config, enums, permissions, exceptions, responses, logging
│   ├── database/      # SQLAlchemy models, async session
│   ├── modules/
│   │   ├── auth/      # registration, login, JWT, token refresh
│   │   ├── patients/  # EMR, vitals, encounters, prescriptions
│   │   ├── appointments/ # slots, queue engine, token management
│   │   ├── billing/   # invoices, Razorpay, webhook verification
│   │   └── audit/     # HIPAA/DISHA immutable audit trail
│   ├── dependencies.py # RBAC, tenant resolution FastAPI deps
│   └── main.py        # FastAPI app, middleware, routers
├── alembic/           # Database migrations
├── seeds/             # Dev data seeders
├── main.py            # Uvicorn entry point (Render/Docker)
├── requirements.txt
├── alembic.ini
└── .env               # Local secrets (not committed)
```

## Running Locally

### 1. Activate virtual environment
```bash
# From RaftraCare root
.venv\Scripts\activate        # Windows
source .venv/bin/activate     # Linux/Mac
```

### 2. Set environment variables
```bash
cp backend/.env.example backend/.env
# Then edit backend/.env with your Supabase credentials
```

### 3. Run database migrations
```bash
cd backend
alembic upgrade head
```

### 4. Seed demo data (optional)
```bash
python -m seeds.seed_demo
```

### 5. Start server
```bash
uvicorn app.main:app --reload --port 8000
# API: http://localhost:8000/api/v1
# Docs: http://localhost:8000/docs
```

## API Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/v1/auth/register-hospital` | Onboard new hospital | Public |
| POST | `/api/v1/auth/login` | User login | Public |
| POST | `/api/v1/auth/refresh` | Refresh JWT | Refresh token |
| GET | `/api/v1/auth/me` | Current user info | Any |
| POST | `/api/v1/patients/` | Register patient | `patients:write` |
| GET | `/api/v1/patients/` | List/search patients | `patients:read` |
| GET | `/api/v1/patients/{id}` | Patient 360 + EMR | `patients:read` |
| POST | `/api/v1/patients/{id}/vitals` | Record vitals | `emr:write` |
| POST | `/api/v1/patients/encounters` | Create OPD encounter | `emr:write` |
| POST | `/api/v1/patients/prescriptions` | Create prescription | `prescriptions:write` |
| POST | `/api/v1/appointments/` | Book appointment | `appointments:write` |
| GET | `/api/v1/appointments/` | List appointments | `appointments:read` |
| GET | `/api/v1/appointments/queue` | Live OPD queue | `queue:read` |
| PATCH | `/api/v1/appointments/{id}/queue` | Update queue token status | `queue:manage` |
| POST | `/api/v1/billing/invoices` | Create invoice | `invoices:write` |
| GET | `/api/v1/billing/invoices` | List invoices | `invoices:read` |
| POST | `/api/v1/billing/razorpay/create-order` | Create Razorpay order | `payments:process` |
| POST | `/api/v1/billing/razorpay/verify-payment` | Verify payment signature | `payments:process` |
| POST | `/api/v1/billing/webhook` | Razorpay webhook | Public (sig-verified) |
| GET | `/api/v1/audit/` | Audit log query | `audit:read` |
| GET | `/healthz` | Health check | Public |
| GET | `/readyz` | Readiness (DB check) | Public |

## Security Architecture
- **JWT**: HS256, 7-day access + 30-day refresh with rotation
- **RBAC**: 9 roles × 35+ granular permissions
- **Multi-tenancy**: Every table carries `hospital_id`, enforced in all queries
- **Audit Trail**: Immutable JSONB-backed log for every PHI access (HIPAA/DISHA)
- **Razorpay**: HMAC-SHA256 signature verification on every payment and webhook

## Deployment (Render)
```
Build Command:  pip install -r requirements.txt && cd backend && alembic upgrade head
Start Command:  cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

## Environment Variables Required
```
DATABASE_URL          Supabase PostgreSQL URL (asyncpg)
JWT_SECRET_KEY        ≥32 char secret
RAZORPAY_KEY_ID       Razorpay key ID
RAZORPAY_KEY_SECRET   Razorpay key secret
RAZORPAY_WEBHOOK_SECRET Razorpay webhook secret
CORS_ORIGINS          Comma-separated frontend URLs
```
