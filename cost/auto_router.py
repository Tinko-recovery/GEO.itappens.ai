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
import groq
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

FALLBACK_LOG_PATH = Path(__file__).parent.parent / "memory" / "fallback_log.json"

# ── Model assignment by agent role ──────────────────────────────────────────
# Sonnet: complex reasoning agents
# Haiku:  simple / high-volume agents (5x cheaper)

# Models by category
CLAUDE_SONNET = "claude-3-sonnet-20240229"
CLAUDE_HAIKU  = "claude-3-haiku-20240307"   # Original Haiku — available on all API tiers (last resort only)
GPT_FALLBACK  = "gpt-4o-mini"
GEMINI_FLASH  = "gemini-1.5-flash"
GROQ_LLAMA    = "llama-3.3-70b-versatile"  # llama-3.3-70b-specdec decommissioned

# Assign agents to providers
# NOTE: SONNET_AGENTS now route to Gemini Flash first (free tier) with Haiku fallback
# This keeps mission cost near-zero while preserving quality for orchestration roles
SONNET_AGENTS = {"CEO Agent", "CTO Agent", "Lead Engineer", "Quality Gate"}
HAIKU_AGENTS  = {"Content Lead", "Outreach Agent", "Weekly Win Agent"}
GEMINI_AGENTS = {"Lead Researcher", "SEO Specialist", "Marketing Analyst", "Onboarding Agent"}
GROQ_AGENTS   = {"Project Manager", "QA Engineer", "Backend Developer", "Frontend Developer", "CPO Agent"}


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
        
        # Google Gemini
        google_key = os.getenv("GOOGLE_API_KEY")
        if google_key:
            genai.configure(api_key=google_key)
            self._gemini = genai.GenerativeModel(GEMINI_FLASH)
        else:
            self._gemini = None

        # Groq
        groq_key = os.getenv("GROQ_API_KEY")
        if groq_key:
            self._groq = groq.Groq(api_key=groq_key)
        else:
            self._groq = None

        # OpenAI (Fallback)
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
        Selects the cheapest suitable model per call:
        1. Role-based assignment (SONNET/HAIKU/GEMINI/GROQ agent sets)
        2. Long context override -> Gemini Flash (cheapest for >20k chars)
        3. Structured data override -> GPT-4o-mini (best JSON consistency)
        4. Fallback to Haiku if role unrecognised
        """
        total_chars = len(system_prompt) + len(user_message)
        is_structured_data = any(kw in system_prompt.lower() for kw in ["json", "csv", "xml", "schema"])

        # Override 1: Long context -> Gemini (cheapest option for big payloads)
        if total_chars > 20000 and self._gemini:
            try:
                logger.info("Router: %s -> Gemini Flash (long context %d chars)", agent_name, total_chars)
                return self._call_gemini(agent_name, system_prompt, user_message, temperature, max_tokens)
            except Exception as e:
                logger.warning("Gemini failed for %s, falling back: %s", agent_name, e)

        # Override 2: Structured data -> GPT-4o-mini
        if is_structured_data and self._openai:
            try:
                logger.info("Router: %s -> GPT-4o-mini (structured data)", agent_name)
                return self._call_openai(agent_name, system_prompt, user_message, max_tokens, task_description)
            except Exception as e:
                logger.warning("GPT-4o-mini failed for %s, falling back: %s", agent_name, e)

        # ── Role-based routing: FREE TIER FIRST, Claude never used as primary ─────
        # Priority order per agent group:
        #   SONNET_AGENTS   → Gemini Flash → Groq → (Claude Haiku last resort)
        #   GROQ_AGENTS     → Groq → Gemini Flash → (Claude Haiku last resort)
        #   GEMINI_AGENTS   → Gemini Flash → Groq → (Claude Haiku last resort)
        #   HAIKU_AGENTS    → Groq → Gemini Flash → (Claude Haiku last resort)
        #   Unknown         → Gemini Flash → Groq → (Claude Haiku last resort)

        def _try_gemini():
            if self._gemini:
                try:
                    logger.info("Router: %s -> Gemini Flash (free)", agent_name)
                    return self._call_gemini(agent_name, system_prompt, user_message, temperature, max_tokens)
                except Exception as e:
                    logger.warning("Gemini failed for %s: %s", agent_name, e)
            return None

        def _try_groq():
            if self._groq:
                try:
                    logger.info("Router: %s -> Groq Llama (free)", agent_name)
                    return self._call_groq(agent_name, system_prompt, user_message, temperature, max_tokens)
                except Exception as e:
                    logger.warning("Groq failed for %s: %s", agent_name, e)
            return None

        if agent_name in SONNET_AGENTS or agent_name in GEMINI_AGENTS:
            result = _try_gemini() or _try_groq()
        elif agent_name in GROQ_AGENTS or agent_name in HAIKU_AGENTS:
            result = _try_groq() or _try_gemini()
        else:
            result = _try_gemini() or _try_groq()

        if result is not None:
            return result

        # Last resort: Claude Haiku (only if all free options failed)
        logger.warning("Router: %s -> Claude Haiku (free tier exhausted, last resort)", agent_name)
        try:
            return self._call_anthropic(
                agent_name, CLAUDE_HAIKU, system_prompt, user_message,
                cache_system_prompt, temperature, max_tokens, task_description
            )
        except Exception as exc:
            if self._openai:
                logger.warning("Claude also failed for %s — GPT-4o-mini fallback: %s", agent_name, exc)
                return self._call_openai(agent_name, system_prompt, user_message, max_tokens, task_description)
            raise RuntimeError(f"All models failed for {agent_name}. Last error: {exc}") from exc

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
            model=GPT_FALLBACK,
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
                model=GPT_FALLBACK,
                input_tokens=usage.prompt_tokens,
                output_tokens=usage.completion_tokens,
                cache_hit=False,
                task_description=task_description,
            )
        return response.choices[0].message.content

    # ── Private: Gemini ─────────────────────────────────────────────────────

    def _call_gemini(self, agent_name: str, system: str, user: str, temp: float, tokens: int) -> str:
        """Call Google Gemini 1.5 Flash."""
        full_prompt = f"SYSTEM: {system}\n\nUSER: {user}"
        response = self._gemini.generate_content(
            full_prompt,
            generation_config=genai.types.GenerationConfig(
                max_output_tokens=tokens,
                temperature=temp,
            )
        )
        # Guard against blocked/empty responses (safety filters, etc.)
        try:
            text = response.text
        except Exception:
            # response.text raises ValueError if content was blocked
            raise RuntimeError(f"Gemini blocked response for {agent_name}. Falling back.")
        if not text or not text.strip():
            raise RuntimeError(f"Gemini returned empty response for {agent_name}. Falling back.")
        if self._cost_tracker:
            self._cost_tracker.log_call(agent_name, GEMINI_FLASH, 0, 0, False, "Gemini Call")
        return text

    # ── Private: Groq ───────────────────────────────────────────────────────

    def _call_groq(self, agent_name: str, system: str, user: str, temp: float, tokens: int) -> str:
        """Call Groq (Llama 3)."""
        response = self._groq.chat.completions.create(
            model=GROQ_LLAMA,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            temperature=temp,
            max_tokens=tokens,
        )
        if self._cost_tracker:
            self._cost_tracker.log_call(agent_name, GROQ_LLAMA, 0, 0, False, "Groq Speed Call")
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
            "fallback_model": GPT_FALLBACK,
            "error": error,
        }
        try:
            log = json.loads(FALLBACK_LOG_PATH.read_text(encoding="utf-8"))
            log.append(entry)
            FALLBACK_LOG_PATH.write_text(json.dumps(log, indent=2), encoding="utf-8")
        except Exception as exc:
            logger.error("Could not write fallback log: %s", exc)
