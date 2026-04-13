"""
customer/customer_brain.py
──────────────────────────
Persistent memory per customer.
Each customer gets a brain file at memory/customer_brains/{customer_id}.json
This file GROWS every sprint and is READ by every agent before starting work.
"""

import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)

BRAINS_DIR = Path(__file__).parent.parent / "memory" / "customer_brains"
BRAINS_DIR.mkdir(parents=True, exist_ok=True)


class CustomerBrain:
    """
    Persistent, per-customer memory system.

    Every agent calls get_context_prompt(customer_id) to get a system-prompt
    prefix describing the customer's product, preferences, past sprints, and
    what NOT to do.

    This context is injected into every agent's system prompt automatically
    by the TeamFactory, ensuring agents never forget context between sprints.
    """

    @staticmethod
    def _path(customer_id: str) -> Path:
        return BRAINS_DIR / f"{customer_id}.json"

    @classmethod
    def load(cls, customer_id: str) -> dict:
        """
        Load a customer brain from disk.
        Returns an empty brain template if the customer is new.
        """
        path = cls._path(customer_id)
        if path.exists():
            return json.loads(path.read_text(encoding="utf-8"))
        return cls._empty_brain(customer_id)

    @classmethod
    def save(cls, customer_id: str, brain: dict) -> None:
        """Persist a customer brain to disk. Creates file if absent."""
        brain["last_updated"] = datetime.utcnow().isoformat()
        cls._path(customer_id).write_text(
            json.dumps(brain, indent=2, default=str), encoding="utf-8"
        )

    @classmethod
    def update_after_sprint(cls, customer_id: str, sprint_result: dict) -> None:
        """
        Called at the end of each sprint.
        Appends the sprint record to past_sprints and updates hot_topics.

        sprint_result should contain:
          sprint_number, goal, completed (list), failed (list), customer_feedback (str)
        """
        brain = cls.load(customer_id)
        brain.setdefault("past_sprints", []).append(sprint_result)

        # Update hot_topics from completed items for future context
        completed = sprint_result.get("completed", [])
        if completed:
            brain["hot_topics"] = completed[-3:]  # last 3 completions

        cls.save(customer_id, brain)
        logger.info("CustomerBrain updated for %s after sprint %s",
                    customer_id, sprint_result.get("sprint_number"))

    @classmethod
    def get_context_prompt(cls, customer_id: str) -> str:
        """
        Return a formatted string to prepend to every agent's system prompt.

        This ensures every agent knows:
        - What the product is and who it's for
        - The tech stack and brand voice
        - What was built in past sprints
        - What failed and must NOT be repeated
        - Current hot topics / priorities
        """
        brain = cls.load(customer_id)

        company = brain.get("company_name", "Unknown Company")
        product = brain.get("product_description", "")
        target = brain.get("target_customer", "")
        stack = ", ".join(brain.get("tech_stack", [])) or "Not specified"
        voice = brain.get("brand_voice", "Professional and direct")
        dont_dos = brain.get("what_not_to_do", [])
        past_sprints = brain.get("past_sprints", [])
        hot_topics = brain.get("hot_topics", [])

        lines = [
            "═══════════════════════════════",
            f"CUSTOMER CONTEXT: {company}",
            "═══════════════════════════════",
            f"Product: {product}",
            f"Target Customer: {target}",
            f"Tech Stack: {stack}",
            f"Brand Voice: {voice}",
        ]

        if dont_dos:
            lines.append("\n⚠️ NEVER DO THESE:")
            for item in dont_dos:
                lines.append(f"  - {item}")

        if past_sprints:
            last = past_sprints[-1]
            lines.append(f"\n📦 LAST SPRINT (#{last.get('sprint_number', '?')}):")
            lines.append(f"  Goal: {last.get('goal', '—')}")
            completed = last.get("completed", [])
            if completed:
                lines.append("  Completed: " + ", ".join(completed))
            failed = last.get("failed", [])
            if failed:
                lines.append("  ⚠️ Failed/Deferred: " + ", ".join(failed))
            feedback = last.get("customer_feedback", "")
            if feedback:
                lines.append(f"  Customer Said: \"{feedback}\"")

        if hot_topics:
            lines.append("\n🔥 CURRENT PRIORITIES: " + ", ".join(hot_topics))

        lines.append("═══════════════════════════════\n")
        return "\n".join(lines)

    @classmethod
    def exists(cls, customer_id: str) -> bool:
        """Return True if this customer already has a brain file."""
        return cls._path(customer_id).exists()

    @classmethod
    def update_field(cls, customer_id: str, field: str, value) -> None:
        """Update a single top-level field in the brain."""
        brain = cls.load(customer_id)
        brain[field] = value
        cls.save(customer_id, brain)

    # ── Private ─────────────────────────────────────────────────────────────

    @staticmethod
    def _empty_brain(customer_id: str) -> dict:
        return {
            "customer_id": customer_id,
            "company_name": "",
            "product_description": "",
            "target_customer": "",
            "tech_stack": [],
            "brand_voice": "Friendly, direct, no jargon",
            "tier": "Basic", # Default tier
            "what_not_to_do": [],
            "past_sprints": [],
            "hot_topics": [],
            "last_updated": datetime.utcnow().isoformat(),
        }
