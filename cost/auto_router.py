"""
cost/auto_router.py
───────────────────
Automatically selects the cheapest model per agent role.
Primary: Anthropic Claude. Fallback: OpenAI GPT-4o (silent).
Supports prompt caching (cache_control: ephemeral) for 90% off repeated calls.
"""

import json
import os
import time
import logging
from pathlib import Path
from datetime import datetime

import anthropic
import openai
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

FALLBACK_LOG_PATH = Path(__file__).parent.parent / "memory" / "fallback_log.json"

# ── Model assignment by agent role ──────────────────────────────────────────
# Sonnet: complex reasoning agents
# Haiku:  simple / high-volume agents (5x cheaper)

SONNET_AGENTS = {
    "CEO Agent",
    "CTO Agent",
    "CPO Agent",
    "Lead Engineer",
    "Content Lead",
    "Outreach Agent",
    "Quality Gate",
}

HAIKU_AGENTS = {
    "Backend Developer",
    "Frontend Developer",
    "QA Engineer",
    "SEO Specialist",
    "Marketing Analyst",
    "Lead Researcher",
    "Follow-up Agent",
    "Onboarding Agent",
    "Weekly Win Agent",
    "Exit Interview Agent",
    "Project Manager",
}

SONNET_MODEL = "claude-sonnet-4-6"
HAIKU_MODEL  = "claude-haiku-4-5"
FALLBACK_MODEL = "gpt-4o"


class AutoRouter:
    """
    Intelligent model router with fallback and cost logging.

    Usage:
        router = AutoRouter(cost_tracker=tracker, telegram_notifier=reporter)
        response = router.call_with_routing(
            agent_name="CEO Agent",
            system_prompt="You are ...",
            user_message="Plan the sprint.",
            cache_system_prompt=True,
        )
    """

    def __init__(self, cost_tracker=None, telegram_notifier=None):
        self._anthropic = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        
        # Only initialize OpenAI if key is provided; otherwise disable fallback
        openai_key = os.getenv("OPENAI_API_KEY")
        if openai_key:
            self._openai = openai.OpenAI(api_key=openai_key)
        else:
            self._openai = None

        self._cost_tracker = cost_tracker
        self._telegram = telegram_notifier
        self._fallback_enabled = os.getenv("FALLBACK_ENABLED", "true").lower() == "true" and self._openai is not None
        self._in_fallback_mode = False
        self._fallback_until: float = 0.0
        self._ensure_fallback_log()

    # ── Public API ──────────────────────────────────────────────────────────

    def get_model_for_agent(self, agent_name: str) -> str:
        """Return the appropriate Claude model for the given agent role."""
        if agent_name in SONNET_AGENTS:
            return SONNET_MODEL
        return HAIKU_MODEL

    def call_with_routing(
        self,
        agent_name: str,
        system_prompt: str,
        user_message: str,
        cache_system_prompt: bool = True,
        temperature: float = 0.7,
        max_tokens: int = 4096,
        task_description: str = "",
    ) -> str:
        """
        Make an LLM call with automatic model selection and fallback.

        1. Selects Sonnet or Haiku based on agent_name.
        2. Tries Anthropic Claude first.
        3. On API error / timeout → silently falls back to GPT-4o.
        4. Logs tokens + cost via CostTracker.
        5. Returns the text content of the response.
        """
        model = self.get_model_for_agent(agent_name)

        # If we're in a temporary fallback window, go straight to GPT-4o
        if self._in_fallback_mode and time.time() < self._fallback_until:
            return self._call_openai(agent_name, system_prompt, user_message,
                                     max_tokens, task_description)

        # Attempt Claude
        try:
            return self._call_anthropic(
                agent_name, model, system_prompt, user_message,
                cache_system_prompt, temperature, max_tokens, task_description
            )
        except (anthropic.APIError, anthropic.APITimeoutError, anthropic.APIConnectionError) as exc:
            if not self._fallback_enabled:
                raise

            logger.warning("Claude API error (%s) — switching to GPT-4o fallback.", exc)
            self._log_fallback(agent_name, model, str(exc))
            self._enter_fallback_mode()

            if self._telegram:
                self._telegram.send_now(
                    "⚠️ Claude API issue detected. Running on backup model (GPT-4o)."
                )
            return self._call_openai(agent_name, system_prompt, user_message,
                                     max_tokens, task_description)

    # ── Private: Anthropic ──────────────────────────────────────────────────

    def _call_anthropic(
        self,
        agent_name: str,
        model: str,
        system_prompt: str,
        user_message: str,
        cache: bool,
        temperature: float,
        max_tokens: int,
        task_description: str,
    ) -> str:
        system_content = [
            {
                "type": "text",
                "text": system_prompt,
            }
        ]
        if cache:
            system_content[0]["cache_control"] = {"type": "ephemeral"}

        response = self._anthropic.messages.create(
            model=model,
            max_tokens=max_tokens,
            temperature=temperature,
            system=system_content,
            messages=[{"role": "user", "content": user_message}],
        )

        usage = response.usage
        cache_hit = getattr(usage, "cache_read_input_tokens", 0) > 0

        if self._cost_tracker:
            input_tok = getattr(usage, "input_tokens", 0)
            output_tok = getattr(usage, "output_tokens", 0)
            self._cost_tracker.log_call(
                agent=agent_name,
                model=model,
                input_tokens=input_tok,
                output_tokens=output_tok,
                cache_hit=cache_hit,
                task_description=task_description,
            )

        # Reset fallback mode if Claude is working again
        self._in_fallback_mode = False

        return response.content[0].text

    # ── Private: OpenAI fallback ────────────────────────────────────────────

    def _call_openai(
        self,
        agent_name: str,
        system_prompt: str,
        user_message: str,
        max_tokens: int,
        task_description: str,
    ) -> str:
        response = self._openai.chat.completions.create(
            model=FALLBACK_MODEL,
            max_tokens=max_tokens,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
        )
        usage = response.usage
        if self._cost_tracker:
            self._cost_tracker.log_call(
                agent=agent_name,
                model=FALLBACK_MODEL,
                input_tokens=usage.prompt_tokens,
                output_tokens=usage.completion_tokens,
                cache_hit=False,
                task_description=task_description,
            )
        return response.choices[0].message.content

    # ── Private: Fallback state management ──────────────────────────────────

    def _enter_fallback_mode(self) -> None:
        """Switch to fallback for 10 minutes, then retry Claude."""
        self._in_fallback_mode = True
        self._fallback_until = time.time() + 600  # 10 minutes

    def _ensure_fallback_log(self) -> None:
        FALLBACK_LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
        if not FALLBACK_LOG_PATH.exists():
            FALLBACK_LOG_PATH.write_text(json.dumps([]), encoding="utf-8")

    def _log_fallback(self, agent: str, model: str, error: str) -> None:
        entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "agent": agent,
            "failed_model": model,
            "fallback_model": FALLBACK_MODEL,
            "error": error,
        }
        try:
            log = json.loads(FALLBACK_LOG_PATH.read_text(encoding="utf-8"))
            log.append(entry)
            FALLBACK_LOG_PATH.write_text(json.dumps(log, indent=2), encoding="utf-8")
        except Exception as exc:
            logger.error("Could not write fallback log: %s", exc)
