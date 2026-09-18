"""initial_schema

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-09-18 12:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Organizations
    op.create_table(
        'organizations',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('slug', sa.String(100), unique=True, nullable=False),
        sa.Column('is_active', sa.Boolean(), default=True, nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )

    # 2. Hospitals
    op.create_table(
        'hospitals',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('organization_id', sa.String(36), sa.ForeignKey('organizations.id', ondelete='SET NULL'), nullable=True),
        sa.Column('slug', sa.String(100), unique=True, nullable=False),
        sa.Column('code', sa.String(20), unique=True, nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('legal_name', sa.String(255), nullable=True),
        sa.Column('license_number', sa.String(100), nullable=True),
        sa.Column('phone', sa.String(20), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('address_line1', sa.String(255), nullable=False),
        sa.Column('address_line2', sa.String(255), nullable=True),
        sa.Column('city', sa.String(100), nullable=False),
        sa.Column('state', sa.String(100), nullable=False),
        sa.Column('postal_code', sa.String(20), nullable=False),
        sa.Column('country', sa.String(100), default='India', nullable=False),
        sa.Column('timezone', sa.String(50), default='Asia/Kolkata', nullable=False),
        sa.Column('currency', sa.String(10), default='INR', nullable=False),
        sa.Column('logo_url', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), default=True, nullable=False),
        sa.Column('settings', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_hospitals_slug', 'hospitals', ['slug'])
    op.create_index('ix_hospitals_is_active', 'hospitals', ['is_active'])

    # 3. Subscription Plans
    op.create_table(
        'subscription_plans',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('tier', sa.String(50), unique=True, nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('price_monthly', sa.Float(), default=0.0, nullable=False),
        sa.Column('price_yearly', sa.Float(), default=0.0, nullable=False),
        sa.Column('max_doctors', sa.Integer(), default=10, nullable=False),
        sa.Column('max_staff', sa.Integer(), default=30, nullable=False),
        sa.Column('max_beds', sa.Integer(), default=50, nullable=False),
        sa.Column('features', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('razorpay_plan_id_monthly', sa.String(100), nullable=True),
        sa.Column('razorpay_plan_id_yearly', sa.String(100), nullable=True),
        sa.Column('is_active', sa.Boolean(), default=True, nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )

    # 4. Hospital Subscriptions
    op.create_table(
        'hospital_subscriptions',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('hospital_id', sa.String(36), sa.ForeignKey('hospitals.id', ondelete='CASCADE'), nullable=False),
        sa.Column('plan_id', sa.String(36), sa.ForeignKey('subscription_plans.id'), nullable=False),
        sa.Column('status', sa.String(50), default='TRIALING', nullable=False),
        sa.Column('billing_cycle', sa.String(20), default='MONTHLY', nullable=False),
        sa.Column('current_period_start', sa.DateTime(timezone=True), nullable=False),
        sa.Column('current_period_end', sa.DateTime(timezone=True), nullable=False),
        sa.Column('cancel_at_period_end', sa.Boolean(), default=False, nullable=False),
        sa.Column('razorpay_subscription_id', sa.String(100), unique=True, nullable=True),
        sa.Column('razorpay_customer_id', sa.String(100), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_hospital_subscriptions_hospital_id', 'hospital_subscriptions', ['hospital_id'])

    # 5. Departments
    op.create_table(
        'departments',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('hospital_id', sa.String(36), sa.ForeignKey('hospitals.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('code', sa.String(20), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('floor', sa.String(50), nullable=True),
        sa.Column('is_active', sa.Boolean(), default=True, nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint('hospital_id', 'code', name='uq_dept_hospital_code'),
    )
    op.create_index('ix_departments_hospital_id', 'departments', ['hospital_id'])

    # 6. Users
    op.create_table(
        'users',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('email', sa.String(255), unique=True, nullable=False),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('first_name', sa.String(100), nullable=False),
        sa.Column('last_name', sa.String(100), nullable=False),
        sa.Column('phone', sa.String(20), unique=True, nullable=True),
        sa.Column('avatar_url', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), default=True, nullable=False),
        sa.Column('is_email_verified', sa.Boolean(), default=False, nullable=False),
        sa.Column('two_factor_enabled', sa.Boolean(), default=False, nullable=False),
        sa.Column('last_login_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_users_email', 'users', ['email'])

    # 7. Hospital Staff
    op.create_table(
        'hospital_staff',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('hospital_id', sa.String(36), sa.ForeignKey('hospitals.id', ondelete='CASCADE'), nullable=False),
        sa.Column('department_id', sa.String(36), sa.ForeignKey('departments.id', ondelete='SET NULL'), nullable=True),
        sa.Column('role', sa.String(50), nullable=False),
        sa.Column('staff_number', sa.String(50), nullable=True),
        sa.Column('designation', sa.String(100), nullable=True),
        sa.Column('qualification', sa.String(255), nullable=True),
        sa.Column('license_number', sa.String(100), nullable=True),
        sa.Column('consultation_fee', sa.Float(), default=0.0, nullable=False),
        sa.Column('digital_signature_url', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), default=True, nullable=False),
        sa.Column('joining_date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint('hospital_id', 'user_id', name='uq_staff_hospital_user'),
    )
    op.create_index('ix_staff_hospital_id', 'hospital_staff', ['hospital_id'])

    # 8. Refresh Tokens
    op.create_table(
        'refresh_tokens',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('token_hash', sa.String(255), unique=True, nullable=False),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('revoked_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('ip_address', sa.String(45), nullable=True),
        sa.Column('user_agent', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_refresh_tokens_user_id', 'refresh_tokens', ['user_id'])

    # 9. Patients
    op.create_table(
        'patients',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('hospital_id', sa.String(36), sa.ForeignKey('hospitals.id', ondelete='CASCADE'), nullable=False),
        sa.Column('uhid', sa.String(50), nullable=False),
        sa.Column('first_name', sa.String(100), nullable=False),
        sa.Column('last_name', sa.String(100), nullable=False),
        sa.Column('gender', sa.String(20), nullable=False),
        sa.Column('date_of_birth', sa.Date(), nullable=False),
        sa.Column('blood_group', sa.String(10), nullable=True),
        sa.Column('phone', sa.String(20), nullable=False),
        sa.Column('email', sa.String(255), nullable=True),
        sa.Column('address_line1', sa.String(255), nullable=True),
        sa.Column('city', sa.String(100), nullable=True),
        sa.Column('state', sa.String(100), nullable=True),
        sa.Column('postal_code', sa.String(20), nullable=True),
        sa.Column('emergency_contact_name', sa.String(100), nullable=True),
        sa.Column('emergency_contact_phone', sa.String(20), nullable=True),
        sa.Column('abha_id', sa.String(50), nullable=True),
        sa.Column('allergies', postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column('chronic_conditions', postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), default=True, nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint('hospital_id', 'uhid', name='uq_patient_hospital_uhid'),
    )
    op.create_index('ix_patients_hospital_id', 'patients', ['hospital_id'])

    # 10. Invoices & Items
    op.create_table(
        'invoices',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('hospital_id', sa.String(36), sa.ForeignKey('hospitals.id', ondelete='CASCADE'), nullable=False),
        sa.Column('patient_id', sa.String(36), sa.ForeignKey('patients.id', ondelete='CASCADE'), nullable=False),
        sa.Column('invoice_number', sa.String(50), nullable=False),
        sa.Column('sub_total', sa.Float(), nullable=False),
        sa.Column('discount_amount', sa.Float(), default=0.0, nullable=False),
        sa.Column('tax_amount', sa.Float(), default=0.0, nullable=False),
        sa.Column('total_amount', sa.Float(), nullable=False),
        sa.Column('paid_amount', sa.Float(), default=0.0, nullable=False),
        sa.Column('balance_amount', sa.Float(), nullable=False),
        sa.Column('status', sa.String(30), default='GENERATED', nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint('hospital_id', 'invoice_number', name='uq_invoice_hospital_number'),
    )
    op.create_index('ix_invoices_hospital_id', 'invoices', ['hospital_id'])
    op.create_index('ix_invoices_patient_id', 'invoices', ['patient_id'])

    op.create_table(
        'invoice_items',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('invoice_id', sa.String(36), sa.ForeignKey('invoices.id', ondelete='CASCADE'), nullable=False),
        sa.Column('item_type', sa.String(50), default='MISCELLANEOUS', nullable=False),
        sa.Column('description', sa.String(255), nullable=False),
        sa.Column('quantity', sa.Integer(), default=1, nullable=False),
        sa.Column('unit_price', sa.Float(), nullable=False),
        sa.Column('total_price', sa.Float(), nullable=False),
    )
    op.create_index('ix_invoice_items_invoice_id', 'invoice_items', ['invoice_id'])

    # 11. Payments & Refunds
    op.create_table(
        'payments',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('hospital_id', sa.String(36), sa.ForeignKey('hospitals.id', ondelete='CASCADE'), nullable=False),
        sa.Column('invoice_id', sa.String(36), sa.ForeignKey('invoices.id', ondelete='CASCADE'), nullable=False),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column('refunded_amount', sa.Float(), default=0.0, nullable=False),
        sa.Column('method', sa.String(30), default='CASH', nullable=False),
        sa.Column('status', sa.String(30), default='PENDING', nullable=False),
        sa.Column('razorpay_order_id', sa.String(100), unique=True, nullable=True),
        sa.Column('razorpay_payment_id', sa.String(100), unique=True, nullable=True),
        sa.Column('razorpay_signature', sa.String(255), nullable=True),
        sa.Column('transaction_ref', sa.String(100), nullable=True),
        sa.Column('received_by_user_id', sa.String(36), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_payments_hospital_id', 'payments', ['hospital_id'])
    op.create_index('ix_payments_invoice_id', 'payments', ['invoice_id'])

    op.create_table(
        'payment_refunds',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('hospital_id', sa.String(36), sa.ForeignKey('hospitals.id', ondelete='CASCADE'), nullable=False),
        sa.Column('payment_id', sa.String(36), sa.ForeignKey('payments.id', ondelete='CASCADE'), nullable=False),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column('reason', sa.String(255), nullable=False),
        sa.Column('processed_by_user_id', sa.String(36), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_payment_refunds_hospital_id', 'payment_refunds', ['hospital_id'])

    # 12. Processed Webhook Events (Idempotency)
    op.create_table(
        'processed_webhook_events',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('event_id', sa.String(150), unique=True, nullable=False),
        sa.Column('event_type', sa.String(100), nullable=False),
        sa.Column('processed_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_processed_webhooks_event_id', 'processed_webhook_events', ['event_id'])

    # 13. Audit Logs (Immutable)
    op.create_table(
        'audit_logs',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('hospital_id', sa.String(36), sa.ForeignKey('hospitals.id', ondelete='SET NULL'), nullable=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('action', sa.String(50), nullable=False),
        sa.Column('resource_type', sa.String(50), nullable=False),
        sa.Column('resource_id', sa.String(36), nullable=True),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('meta_data', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('ip_address', sa.String(45), nullable=True),
        sa.Column('user_agent', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_audit_logs_hospital_date', 'audit_logs', ['hospital_id', 'created_at'])


def downgrade() -> None:
    op.drop_table('audit_logs')
    op.drop_table('processed_webhook_events')
    op.drop_table('payment_refunds')
    op.drop_table('payments')
    op.drop_table('invoice_items')
    op.drop_table('invoices')
    op.drop_table('patients')
    op.drop_table('refresh_tokens')
    op.drop_table('hospital_staff')
    op.drop_table('users')
    op.drop_table('departments')
    op.drop_table('hospital_subscriptions')
    op.drop_table('subscription_plans')
    op.drop_table('hospitals')
    op.drop_table('organizations')
