"""
billing/razorpay_handler.py
───────────────────────────
Razorpay integration for itappens.ai subscriptions.
Supports order creation and webhook verification.
"""

import json
import logging
import os
import hmac
import hashlib
from datetime import datetime
from pathlib import Path

import razorpay
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

client = None
if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET:
    client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# ── Plan config ──────────────────────────────────────────────────────────────

PLAN_CONFIGS = {
    "starter": {
        "name": "Starter",
        "amount": 49700, # In paise ($497.00)
        "currency": "USD",
        "daily_budget": 20,
    },
    "growth": {
        "name": "Growth",
        "amount": 99700, # In paise ($997.00)
        "currency": "USD",
        "daily_budget": 50,
    },
    "scale": {
        "name": "Scale",
        "amount": 249700, # In paise ($2,497.00)
        "currency": "USD",
        "daily_budget": 150,
    },
}

SUBSCRIPTIONS_PATH = Path(__file__).parent.parent / "memory" / "subscriptions.json"

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

def create_razorpay_order(plan_slug: str, customer_email: str = "") -> dict:
    """
    Create a Razorpay order for the selected plan.
    """
    if not client:
        raise EnvironmentError("Razorpay keys not configured in .env")
    
    config = PLAN_CONFIGS.get(plan_slug)
    if not config:
        raise ValueError(f"Unknown plan '{plan_slug}'")

    data = {
        "amount": config["amount"],
        "currency": config["currency"],
        "receipt": f"receipt_{plan_slug}_{int(datetime.now().timestamp())}",
        "notes": {
            "plan": plan_slug,
            "email": customer_email
        }
    }
    
    order = client.order.create(data=data)
    logger.info("Razorpay order created: plan=%s order_id=%s", plan_slug, order['id'])
    return order

def verify_payment(razorpay_order_id: str, razorpay_payment_id: str, razorpay_signature: str) -> bool:
    """
    Verify the payment signature sent by Razorpay.
    """
    if not client: return False
    
    params_dict = {
        'razorpay_order_id': razorpay_order_id,
        'razorpay_payment_id': razorpay_payment_id,
        'razorpay_signature': razorpay_signature
    }
    
    try:
        client.utility.verify_payment_signature(params_dict)
        _handle_payment_success(razorpay_order_id, razorpay_payment_id)
        return True
    except Exception as e:
        logger.error("Razorpay signature verification failed: %s", e)
        return False

def _handle_payment_success(order_id: str, payment_id: str) -> None:
    """
    Update local subscriptions.json after successful payment.
    """
    if not client: return
    
    order = client.order.fetch(order_id)
    notes = order.get("notes", {})
    plan = notes.get("plan", "unknown")
    email = notes.get("email", "unknown")

    entry = {
        "customer_id": f"rzp_{order_id}",
        "customer_email": email,
        "plan": plan,
        "status": "active",
        "razorpay_order_id": order_id,
        "razorpay_payment_id": payment_id,
        "created_at": datetime.utcnow().isoformat(),
    }

    subscriptions = _read_json(SUBSCRIPTIONS_PATH)
    if not isinstance(subscriptions, list):
        subscriptions = []
    
    # Update or append
    subscriptions = [s for s in subscriptions if s.get("customer_email") != email]
    subscriptions.append(entry)
    _write_json(SUBSCRIPTIONS_PATH, subscriptions)
    logger.info("New subscriber via Razorpay: %s on %s plan", email, plan)

WAITLIST_PATH = Path(__file__).parent.parent / "memory" / "waitlist.json"

def add_to_waitlist(email: str, source: str = "landing") -> bool:
    """Save email to waitlist.json."""
    waitlist = _read_json(WAITLIST_PATH)
    if not isinstance(waitlist, list):
        waitlist = []
    if any(item.get("email") == email for item in waitlist):
        return False
    waitlist.append({
        "email": email,
        "source": source,
        "created_at": datetime.utcnow().isoformat()
    })
    _write_json(WAITLIST_PATH, waitlist)
    return True
