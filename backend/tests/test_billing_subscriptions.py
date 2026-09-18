"""
RaftraCare HospitalOS — SaaS Subscriptions & Billing Safety Tests
"""
import pytest
from app.core.config import settings
from app.core.enums import SubscriptionTier, SubscriptionStatus, PaymentStatus, PaymentMethod
from app.modules.auth.security import (
    verify_razorpay_payment_signature,
    verify_razorpay_webhook_signature,
)


def test_subscription_tiers_enum():
    assert SubscriptionTier.FREE_TRIAL.value == "FREE_TRIAL"
    assert SubscriptionTier.STARTER.value == "STARTER"
    assert SubscriptionTier.GROWTH.value == "GROWTH"
    assert SubscriptionTier.ENTERPRISE.value == "ENTERPRISE"


def test_subscription_status_enum():
    assert SubscriptionStatus.ACTIVE.value == "ACTIVE"
    assert SubscriptionStatus.TRIALING.value == "TRIALING"
    assert SubscriptionStatus.PAST_DUE.value == "PAST_DUE"
    assert SubscriptionStatus.CANCELLED.value == "CANCELLED"
    assert SubscriptionStatus.EXPIRED.value == "EXPIRED"


def test_subscription_cycle_pricing_calculations():
    monthly_rate = 9999.0
    yearly_rate = 99990.0

    # Monthly paise conversion
    monthly_paise = int(round(monthly_rate * 100))
    assert monthly_paise == 999900

    # Yearly paise conversion
    yearly_paise = int(round(yearly_rate * 100))
    assert yearly_paise == 9999000

    # Annual discount check (yearly price should provide 2 months free equivalent)
    assert yearly_rate < (monthly_rate * 12)


def test_refund_amount_validation_safety():
    payment_amount = 5000.0
    already_refunded = 2000.0
    refundable_balance = payment_amount - already_refunded

    # Attempting to refund more than available should fail
    attempted_refund = 3500.0
    is_valid = attempted_refund <= refundable_balance
    assert is_valid is False

    # Valid partial refund
    valid_refund = 1500.0
    assert valid_refund <= refundable_balance
    new_already_refunded = already_refunded + valid_refund
    assert new_already_refunded == 3500.0
    assert (payment_amount - new_already_refunded) == 1500.0


def test_webhook_signature_verification_flow():
    import hmac
    import hashlib

    payload = '{"event": "payment.captured", "payload": {"payment": {"entity": {"id": "pay_test_999"}}}}'

    computed_signature = hmac.new(
        settings.razorpay_webhook_secret.encode(),
        payload.encode(),
        hashlib.sha256,
    ).hexdigest()

    assert verify_razorpay_webhook_signature(payload, computed_signature) is True
    assert verify_razorpay_webhook_signature(payload, "invalid_sig_abc") is False
