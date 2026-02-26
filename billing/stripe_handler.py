"""
billing/stripe_handler.py
─────────────────────────
Stripe Checkout integration for itappens.ai subscriptions.

Env vars required (set in .env):
  STRIPE_SECRET_KEY        — sk_live_... or sk_test_...
  STRIPE_WEBHOOK_SECRET    — whsec_... from Stripe dashboard
  STRIPE_PRICE_STARTER     — price_... for $497/mo Starter plan
  STRIPE_PRICE_GROWTH      — price_... for $997/mo Growth plan
  STRIPE_PRICE_SCALE       — price_... for $2,497/mo Scale plan
  APP_BASE_URL             — e.g. https://itappens-backend.onrender.com
"""

import json
import logging
import os
from datetime import datetime
from pathlib import Path

import stripe
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

# ── Plan config ──────────────────────────────────────────────────────────────

PLAN_CONFIGS = {
    "starter": {
        "name": "Starter",
        "price_id_env": "STRIPE_PRICE_STARTER",
        "amount": "$497/mo",
        "daily_budget": 20,
    },
    "growth": {
        "name": "Growth",
        "price_id_env": "STRIPE_PRICE_GROWTH",
        "amount": "$997/mo",
        "daily_budget": 50,
    },
    "scale": {
        "name": "Scale",
        "price_id_env": "STRIPE_PRICE_SCALE",
        "amount": "$2,497/mo",
        "daily_budget": 150,
    },
}

SUBSCRIPTIONS_PATH = Path(__file__).parent.parent / "memory" / "subscriptions.json"
WAITLIST_PATH = Path(__file__).parent.parent / "memory" / "waitlist.json"


# ── JSON helpers ─────────────────────────────────────────────────────────────

def _read_json(path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists():
        return []
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return []


def _write_json(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2), encoding="utf-8")


# ── Public API ───────────────────────────────────────────────────────────────

def create_checkout_session(plan: str, customer_email: str = "") -> str:
    """
    Create a Stripe Checkout Session for the given plan slug.
    Returns the hosted Stripe checkout URL.
    Raises ValueError for unknown plans, EnvironmentError if price IDs missing.
    """
    config = PLAN_CONFIGS.get(plan)
    if not config:
        raise ValueError(f"Unknown plan '{plan}'. Must be starter, growth, or scale.")

    price_id = os.getenv(config["price_id_env"])
    if not price_id:
        raise EnvironmentError(
            f"Missing env var {config['price_id_env']} — add your Stripe Price IDs to .env"
        )

    base_url = os.getenv("APP_BASE_URL", "https://itappens-backend.onrender.com")

    kwargs = {
        "mode": "subscription",
        "line_items": [{"price": price_id, "quantity": 1}],
        "success_url": f"{base_url}/success?session_id={{CHECKOUT_SESSION_ID}}&plan={plan}",
        "cancel_url": f"{base_url}/#pricing",
        "metadata": {"plan": plan},
        "allow_promotion_codes": True,
    }
    if customer_email:
        kwargs["customer_email"] = customer_email

    session = stripe.checkout.Session.create(**kwargs)
    logger.info("Stripe checkout created: plan=%s session=%s", plan, session.id)
    return session.url


def handle_webhook(payload: bytes, sig_header: str) -> dict:
    """
    Verify Stripe webhook signature and process the event.
    Returns {"status": "ok", "event_type": "..."}.
    Raises stripe.error.SignatureVerificationError on bad signature.
    """
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
    if not webhook_secret:
        raise EnvironmentError("STRIPE_WEBHOOK_SECRET not set in .env")

    event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
    event_type = event["type"]
    logger.info("Stripe webhook: %s", event_type)

    if event_type == "checkout.session.completed":
        _handle_checkout_completed(event["data"]["object"])
    elif event_type in ("customer.subscription.deleted", "customer.subscription.updated"):
        _handle_subscription_change(event["data"]["object"], event_type)

    return {"status": "ok", "event_type": event_type}


def add_to_waitlist(email: str, source: str = "landing") -> bool:
    """
    Add an email to the waitlist JSON.
    Returns True if newly added, False if already present.
    """
    waitlist = _read_json(WAITLIST_PATH)
    if not isinstance(waitlist, list):
        waitlist = []

    existing = {w.get("email", "").lower() for w in waitlist}
    if email.lower() in existing:
        return False

    waitlist.append({
        "email": email,
        "source": source,
        "added_at": datetime.utcnow().isoformat(),
    })
    _write_json(WAITLIST_PATH, waitlist)
    logger.info("Waitlist signup: %s (source=%s)", email, source)
    return True


def get_subscription(customer_email: str) -> dict | None:
    """Look up an active subscription by email."""
    subscriptions = _read_json(SUBSCRIPTIONS_PATH)
    if not isinstance(subscriptions, list):
        return None
    for entry in subscriptions:
        if (
            entry.get("customer_email", "").lower() == customer_email.lower()
            and entry.get("status") == "active"
        ):
            return entry
    return None


# ── Private webhook handlers ─────────────────────────────────────────────────

def _handle_checkout_completed(session: dict) -> None:
    """Write a new subscription record when a customer pays."""
    customer_email = session.get("customer_email") or (
        session.get("customer_details") or {}
    ).get("email", "")
    plan = (session.get("metadata") or {}).get("plan", "unknown")
    customer_id = session.get("customer", "")

    entry = {
        "customer_id": customer_id,
        "customer_email": customer_email,
        "plan": plan,
        "status": "active",
        "stripe_session_id": session.get("id", ""),
        "stripe_subscription_id": session.get("subscription", ""),
        "created_at": datetime.utcnow().isoformat(),
    }

    subscriptions = _read_json(SUBSCRIPTIONS_PATH)
    if not isinstance(subscriptions, list):
        subscriptions = []
    # Remove any old record for same Stripe customer
    subscriptions = [s for s in subscriptions if s.get("customer_id") != customer_id]
    subscriptions.append(entry)
    _write_json(SUBSCRIPTIONS_PATH, subscriptions)
    logger.info("New subscriber: %s on %s plan", customer_email, plan)


def _handle_subscription_change(subscription: dict, event_type: str) -> None:
    """Update status on subscription changes or cancellations."""
    customer_id = subscription.get("customer", "")
    status = subscription.get("status", "unknown")

    subscriptions = _read_json(SUBSCRIPTIONS_PATH)
    if not isinstance(subscriptions, list):
        return

    for entry in subscriptions:
        if entry.get("customer_id") == customer_id:
            entry["status"] = status
            entry["updated_at"] = datetime.utcnow().isoformat()
            break

    _write_json(SUBSCRIPTIONS_PATH, subscriptions)
    logger.info("Subscription update: customer=%s status=%s", customer_id, status)
