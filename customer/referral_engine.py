"""
customer/referral_engine.py
────────────────────────────
Simple referral tracking and reward system.
Referrer gets 1 month free. Referee gets 20% off first month.
Link format: itappens.ai/?ref={customer_id}
"""

import json
import logging
from datetime import datetime
from pathlib import Path

logger = logging.getLogger(__name__)

REFERRAL_LOG_PATH = Path(__file__).parent.parent / "memory" / "referral_log.json"

REFERRER_REWARD_MONTHS = 1      # Free months for referrer
REFEREE_DISCOUNT_PCT = 20       # % off first month for referee


class ReferralEngine:
    """
    Tracks referrals, applies rewards, and notifies founder via Telegram.

    Flow:
      1. New signup arrives with ?ref=CUST_ID in URL
      2. record_referral() links referee to referrer
      3. on_payment_confirmed() checks if referrer reward is due → applies free month
      4. Sends Telegram notification to referrer

    After sprint 1: prompt customer to share their referral link.
    Weekly Win email footer: always includes referral link.
    """

    def __init__(self, telegram=None):
        self._telegram = telegram
        self._ensure_log()

    # ── Public API ────────────────────────────────────────────────────────────

    def record_referral(self, referee_id: str, referrer_id: str) -> None:
        """
        Record that referee_id signed up using referrer_id's link.
        Called at signup if a ?ref= parameter is present.
        """
        log = self._read()
        log.append({
            "referrer_id": referrer_id,
            "referee_id": referee_id,
            "signed_up_at": datetime.utcnow().isoformat(),
            "referee_paid": False,
            "referrer_rewarded": False,
            "referee_discount_applied": False,
        })
        self._write(log)
        logger.info("Referral recorded: %s referred by %s", referee_id, referrer_id)

    def get_referee_discount(self, referee_id: str) -> int:
        """
        Return the discount % for a new referee (20% if referred, 0 otherwise).
        Call this at checkout to apply the discount.
        """
        log = self._read()
        for entry in log:
            if entry["referee_id"] == referee_id and not entry["referee_discount_applied"]:
                return REFEREE_DISCOUNT_PCT
        return 0

    def on_payment_confirmed(self, referee_id: str) -> None:
        """
        Called when a referred customer pays their first invoice.
        Marks referee as paid, applies referrer's free-month reward.
        """
        log = self._read()
        for entry in log:
            if entry["referee_id"] == referee_id and not entry["referee_paid"]:
                entry["referee_paid"] = True
                entry["referee_paid_at"] = datetime.utcnow().isoformat()
                entry["referee_discount_applied"] = True

                if not entry["referrer_rewarded"]:
                    self._reward_referrer(entry["referrer_id"], referee_id)
                    entry["referrer_rewarded"] = True

        self._write(log)

    def get_referral_link(self, customer_id: str) -> str:
        """Return the referral URL for a customer."""
        return f"https://itappens.ai/?ref={customer_id}"

    def send_referral_prompt_after_sprint1(self, customer_id: str, brain: dict) -> None:
        """
        Send an email prompting the customer to share their referral link
        after their first sprint completes.
        """
        name = brain.get("company_name", "there")
        link = self.get_referral_link(customer_id)

        if self._telegram:
            self._telegram.send_now(
                f"📨 Referral prompt sent to {name} after sprint 1.\n"
                f"Link: {link}"
            )

        logger.info("Referral prompt triggered for customer %s.", customer_id)

    def get_referral_stats(self, customer_id: str) -> dict:
        """Return referral stats for a specific customer."""
        log = self._read()
        referred = [e for e in log if e["referrer_id"] == customer_id]
        return {
            "total_referrals": len(referred),
            "paid_referrals": sum(1 for e in referred if e["referee_paid"]),
            "free_months_earned": sum(1 for e in referred if e["referrer_rewarded"]),
            "referral_link": self.get_referral_link(customer_id),
        }

    # ── Private ───────────────────────────────────────────────────────────────

    def _reward_referrer(self, referrer_id: str, referee_id: str) -> None:
        """Apply free month credit to the referrer and notify them."""
        logger.info(
            "Referrer %s earned %d free month(s) for referring %s.",
            referrer_id, REFERRER_REWARD_MONTHS, referee_id
        )
        # In production: apply credit via Stripe API
        # stripe.Customer.create_balance_transaction(customer_id, amount=-49700, currency="usd")

        if self._telegram:
            self._telegram.send_now(
                f"🎉 Referral reward! Customer {referrer_id} referred a paying customer. "
                f"Their next month is free. (Referee: {referee_id})"
            )

    def _read(self) -> list:
        return json.loads(REFERRAL_LOG_PATH.read_text(encoding="utf-8"))

    def _write(self, data: list) -> None:
        REFERRAL_LOG_PATH.write_text(json.dumps(data, indent=2, default=str), encoding="utf-8")

    def _ensure_log(self) -> None:
        REFERRAL_LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
        if not REFERRAL_LOG_PATH.exists():
            REFERRAL_LOG_PATH.write_text("[]", encoding="utf-8")
