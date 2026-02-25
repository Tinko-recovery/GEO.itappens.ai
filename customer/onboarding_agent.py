"""
customer/onboarding_agent.py
─────────────────────────────
5-question onboarding interview before the first sprint.
Asks questions one at a time via Telegram and waits for replies.
Saves answers directly to customer_brain.json.
"""

import asyncio
import logging
import os
from datetime import datetime
from typing import Optional

from telegram import Bot, Update
from telegram.ext import Application, MessageHandler, filters, ContextTypes
from dotenv import load_dotenv

from customer.customer_brain import CustomerBrain

load_dotenv()
logger = logging.getLogger(__name__)


ONBOARDING_QUESTIONS = [
    "👋 Welcome to *itappens.ai*! Before your team starts, I need 5 quick answers.\n\n"
    "*Q1/5:* What's your product? _(one sentence)_",
    "*Q2/5:* Who is your customer? Be specific — not 'everyone'.",
    "*Q3/5:* What's the ONE thing you need most right now — *code, content, or customers?*",
    "*Q4/5:* What tech stack are you using? _(or say 'no preference')_",
    "*Q5/5:* What have you already tried that didn't work?",
]

BRAIN_FIELD_MAP = [
    "product_description",
    "target_customer",
    "primary_need",
    "tech_stack_raw",
    "what_not_to_do_raw",
]

COMPLETION_MESSAGE = (
    "✅ *Got it. Your team starts in 60 seconds. Watch your Telegram.*\n\n"
    "While they spin up, here's what happens next:\n"
    "• Your AI team reads your answers\n"
    "• They plan the first sprint goal automatically\n"
    "• You'll get a 15-min status update right here\n\n"
    "Let's go 🚀"
)


class OnboardingAgent:
    """
    Conducts progressive 5-question onboarding over Telegram.
    Blocks sprint start until all 5 answers are received.

    For production: Use the Telegram bot's webhook/polling to receive replies.
    For simple use: Call run_onboarding_interview() which sends questions and
    collects answers sequentially.
    """

    def __init__(self, customer_id: str):
        self.customer_id = customer_id
        self._token = os.getenv("TELEGRAM_BOT_TOKEN", "")
        self._chat_id = os.getenv("TELEGRAM_CHAT_ID", "")
        self._bot = Bot(token=self._token) if self._token else None
        self._answers: list[str] = []

    # ── Main entry point ────────────────────────────────────────────────────

    async def run_onboarding_interview(self) -> dict:
        """
        Send questions one-by-one via Telegram and collect answers.
        Returns the completed brain dict after all 5 answers.
        This method blocks until all answers are received.
        """
        if not self._bot or not self._chat_id:
            logger.warning("Telegram not configured — using mock answers.")
            return self._save_mock_answers()

        brain = CustomerBrain.load(self.customer_id)

        for i, question in enumerate(ONBOARDING_QUESTIONS):
            await self._send(question)
            answer = await self._wait_for_reply(timeout=3600)  # 1hr timeout
            if answer is None:
                logger.warning("No answer received for Q%d — using placeholder.", i + 1)
                answer = "Not provided"
            self._answers.append(answer)
            logger.info("Q%d answered: %s", i + 1, answer[:60])

        # Parse and save answers to brain
        brain = self._answers_to_brain(brain)
        CustomerBrain.save(self.customer_id, brain)

        # Send confirmation
        await self._send(COMPLETION_MESSAGE)

        return brain

    # ── Batch onboarding (for email-based or programmatic use) ──────────────

    def save_answers(self, answers: list[str]) -> dict:
        """
        Directly save a pre-collected list of 5 answers to the customer brain.
        Used when answers arrive via email or are provided programmatically.
        """
        assert len(answers) == 5, "Exactly 5 answers required."
        self._answers = answers
        brain = CustomerBrain.load(self.customer_id)
        brain = self._answers_to_brain(brain)
        CustomerBrain.save(self.customer_id, brain)
        logger.info("Onboarding answers saved for customer %s.", self.customer_id)
        return brain

    # ── Private helpers ──────────────────────────────────────────────────────

    async def _send(self, text: str) -> None:
        if self._bot and self._chat_id:
            await self._bot.send_message(
                chat_id=self._chat_id, text=text, parse_mode="Markdown"
            )

    async def _wait_for_reply(self, timeout: int = 3600) -> Optional[str]:
        """
        Poll for a new message in the Telegram chat.
        In a real deployment, replace with a proper webhook handler.
        Returns the reply text or None on timeout.
        """
        if not self._bot:
            return None

        last_update_id = None
        elapsed = 0
        interval = 5  # poll every 5 seconds

        while elapsed < timeout:
            try:
                updates = await self._bot.get_updates(
                    offset=last_update_id,
                    timeout=interval,
                    allowed_updates=["message"],
                )
                for update in updates:
                    last_update_id = update.update_id + 1
                    msg = update.message
                    if msg and str(msg.chat.id) == str(self._chat_id):
                        return msg.text
            except Exception as exc:
                logger.error("Polling error: %s", exc)
            await asyncio.sleep(interval)
            elapsed += interval

        return None

    def _answers_to_brain(self, brain: dict) -> dict:
        """Map the 5 raw answers into structured brain fields."""
        if len(self._answers) < 5:
            return brain

        brain["product_description"] = self._answers[0]
        brain["target_customer"] = self._answers[1]

        # Parse tech stack
        raw_stack = self._answers[3]
        if raw_stack.lower() in ("no preference", "none", "n/a", ""):
            brain["tech_stack"] = []
        else:
            brain["tech_stack"] = [t.strip() for t in raw_stack.replace(",", " ").split()]

        # what_not_to_do from Q5 (what didn't work)
        what_failed = self._answers[4]
        if what_failed.lower() not in ("nothing", "n/a", "none", ""):
            brain["what_not_to_do"] = [f"Already tried (don't repeat): {what_failed}"]

        # Generate first sprint goal from Q1 + Q3
        need = self._answers[2].lower()
        if "code" in need:
            brain["hot_topics"] = ["Build core product MVP"]
        elif "content" in need:
            brain["hot_topics"] = ["Create launch content and SEO articles"]
        else:
            brain["hot_topics"] = ["Find first 10 customers"]

        # Mark onboarding complete
        brain["onboarding_complete"] = True
        brain["onboarding_completed_at"] = datetime.utcnow().isoformat()
        return brain

    def _save_mock_answers(self) -> dict:
        """Fallback when Telegram is not configured — use placeholder answers."""
        mock = [
            "A SaaS product being built with AI assistance.",
            "Solo founders and indie hackers (1-5 person teams).",
            "Code — I need features shipped fast.",
            "React, FastAPI, PostgreSQL",
            "Manual outsourcing on Upwork — too slow and expensive.",
        ]
        return self.save_answers(mock)

    @staticmethod
    def is_onboarding_complete(customer_id: str) -> bool:
        """Return True if the customer has completed onboarding."""
        brain = CustomerBrain.load(customer_id)
        return brain.get("onboarding_complete", False)
