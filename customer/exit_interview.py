"""
customer/exit_interview.py
──────────────────────────
Triggered when a customer cancels (Stripe webhook or manual call).
Waits 1 hour then sends a personal, non-salesy exit email from the founder.
Logs all replies. Notifies founder via Telegram if they reply.
"""

import asyncio
import json
import logging
import os
from datetime import datetime, timedelta
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

EXIT_LOG_PATH = Path(__file__).parent.parent / "memory" / "exit_interviews.json"
MIN_ACTIVE_DAYS = 3  # Don't send if customer was active < 3 days (accident signup)


class ExitInterviewAgent:
    """
    Sends a personal cancellation email 1 hour after a customer cancels.
    Never sends discounts. Never tries to change their mind.
    Just asks one honest question: what did we get wrong?

    If they reply:
      - Notifies founder via Telegram immediately
      - If positive reply → schedules win-back sequence after 30 days
    """

    def __init__(self, gmail_send_fn=None, telegram=None):
        self._gmail_send = gmail_send_fn
        self._telegram = telegram
        self._ensure_log()

    # ── Main trigger ──────────────────────────────────────────────────────────

    async def on_cancellation(self, customer_id: str, brain: dict) -> None:
        """
        Called when a customer cancels. Waits 1 hour then sends exit email.
        brain: the customer's CustomerBrain dict.
        """
        name = brain.get("company_name", "there")
        email = brain.get("contact_email", "")

        if not email:
            logger.warning("No email for %s — cannot send exit interview.", customer_id)
            return

        # Check if customer was active long enough
        onboarded_at_str = brain.get("onboarding_completed_at", "")
        if onboarded_at_str:
            onboarded_at = datetime.fromisoformat(onboarded_at_str)
            active_days = (datetime.utcnow() - onboarded_at).days
            if active_days < MIN_ACTIVE_DAYS:
                logger.info("Customer %s active only %d days — skip exit interview.", customer_id, active_days)
                return

        logger.info("Customer %s cancelled. Waiting 1 hour before exit email.", customer_id)
        await asyncio.sleep(3600)  # Wait 1 hour

        await self._send_exit_email(customer_id, name, email)

    async def _send_exit_email(self, customer_id: str, name: str, email: str) -> None:
        """Send the exit interview email."""
        founder_name = os.getenv("FOUNDER_NAME", "The Founder")
        founder_email = os.getenv("FOUNDER_EMAIL", os.getenv("GMAIL_SENDER_EMAIL", ""))

        subject = "Before you go — one honest question"
        body = f"""Hi {name},

I saw you cancelled itappens.ai today.

I'm not going to send you a discount code or try to change your mind.

I just want to know one thing: what did we get wrong?

Not a survey. Just reply to this email with whatever's honest.
I read every one of these personally.

— {founder_name}
itappens.ai
"""

        if self._gmail_send:
            self._gmail_send(to=email, subject=subject, body=body)

        self._log_sent(customer_id, email)
        logger.info("Exit interview sent to %s (%s).", name, email)

        if self._telegram:
            self._telegram.send_now(
                f"📤 Exit interview sent to {name} ({email})"
            )

    # ── Reply handler ─────────────────────────────────────────────────────────

    def on_reply_received(self, customer_id: str, reply_text: str, sender_email: str) -> None:
        """
        Called when a customer replies to the exit email.
        Notifies founder via Telegram immediately.
        """
        logger.info("Exit interview reply from %s: %s", customer_id, reply_text[:100])

        self._log_reply(customer_id, sender_email, reply_text)

        if self._telegram:
            self._telegram.send_now(
                f"💬 *Exit Interview Reply*\n"
                f"From: {sender_email}\n"
                f"Customer: {customer_id}\n\n"
                f"_{reply_text[:400]}_"
            )

        # Detect if reply is positive (potential win-back)
        positive_signals = ["interested", "might come back", "reconsider", "try again",
                            "still interested", "another time", "not the right time"]
        is_positive = any(sig in reply_text.lower() for sig in positive_signals)

        if is_positive:
            self._flag_for_winback(customer_id, sender_email)
            if self._telegram:
                self._telegram.send_now(
                    f"🔄 *Win-Back Opportunity* — {customer_id} replied positively. "
                    "Win-back sequence will trigger in 30 days."
                )

    def _flag_for_winback(self, customer_id: str, email: str) -> None:
        """Mark customer for win-back sequence in 30 days."""
        log = json.loads(EXIT_LOG_PATH.read_text(encoding="utf-8"))
        for entry in log:
            if entry["customer_id"] == customer_id:
                entry["winback_scheduled"] = True
                entry["winback_send_after"] = (
                    datetime.utcnow() + timedelta(days=30)
                ).isoformat()
        EXIT_LOG_PATH.write_text(json.dumps(log, indent=2), encoding="utf-8")

    # ── Logging ───────────────────────────────────────────────────────────────

    def _log_sent(self, customer_id: str, email: str) -> None:
        log = json.loads(EXIT_LOG_PATH.read_text(encoding="utf-8"))
        log.append({
            "customer_id": customer_id,
            "email": email,
            "sent_at": datetime.utcnow().isoformat(),
            "replied": False,
            "reply_text": None,
            "winback_scheduled": False,
        })
        EXIT_LOG_PATH.write_text(json.dumps(log, indent=2), encoding="utf-8")

    def _log_reply(self, customer_id: str, email: str, reply_text: str) -> None:
        log = json.loads(EXIT_LOG_PATH.read_text(encoding="utf-8"))
        for entry in log:
            if entry["customer_id"] == customer_id:
                entry["replied"] = True
                entry["reply_text"] = reply_text[:1000]
                entry["replied_at"] = datetime.utcnow().isoformat()
        EXIT_LOG_PATH.write_text(json.dumps(log, indent=2), encoding="utf-8")

    def _ensure_log(self) -> None:
        EXIT_LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
        if not EXIT_LOG_PATH.exists():
            EXIT_LOG_PATH.write_text("[]", encoding="utf-8")
