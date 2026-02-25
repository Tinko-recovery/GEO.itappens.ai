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
CLAUDE_SONNET = "claude-3-5-sonnet-20241022"
CLAUDE_HAIKU  = "claude-3-haiku-20240307"
GPT_FALLBACK  = "gpt-4o-mini"
GEMINI_FLASH  = "gemini-1.5-flash"
GROQ_LLAMA    = "llama-3.3-70b-specdec" # Fast Groq model

# Assign agents to providers
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
        Dynamically selects the 'best' brain for the job based on:
        1. Context Length (Large -> Gemini)
        2. Task Complexity (High Intelligence -> Sonnet)
        3. Speed/Cost (Simple -> Groq)
        """
        total_chars = len(system_prompt) + len(user_message)
        is_mission_critical = any(kw in system_prompt.lower() for kw in ["architecture", "security", "financial", "database", "ceo", "launch"])
        is_structured_data = any(kw in system_prompt.lower() for kw in ["json", "csv", "xml", "schema"])

        # 🧠 Heuristic 1: Long Context (Scraping, Research, Audits)
        if total_chars > 20000 and self._gemini:
            try:
                logger.info(f"Dynamic Router: Routing {agent_name} to Gemini Flash for long context")
                return self._call_gemini(agent_name, system_prompt, user_message, temperature, max_tokens)
            except Exception: pass

        # 🧠 Heuristic 2: Mission Critical Tasks -> Sonnet 3.5 (The Best)
        if is_mission_critical:
            try:
                return self._call_anthropic(agent_name, CLAUDE_SONNET, system_prompt, user_message, cache_system_prompt, temperature, max_tokens, task_description)
            except Exception: pass

        # 🧠 Heuristic 3: Structured Data -> GPT-4o-mini (Best at JSON consistency)
        if is_structured_data and self._openai:
            try:
                return self._call_openai(agent_name, system_prompt, user_message, max_tokens, task_description)
            except Exception: pass

        # 🧠 Heuristic 4: Sub-second / Short Tasks -> Groq (Llama 3)
        if max_tokens < 500 and self._groq:
            try:
                return self._call_groq(agent_name, system_prompt, user_message, temperature, max_tokens)
            except Exception: pass

        # Default: Fallback to Claude Haiku (Best price/performance for prose)
        preferred_model = CLAUDE_HAIKU
        
        # Fallback to OpenAI if Anthropic is in cooldown
        if self._in_fallback_mode and time.time() < self._fallback_until and self._openai:
            return self._call_openai(agent_name, system_prompt, user_message, max_tokens, task_description)

        try:
            return self._call_anthropic(
                agent_name, preferred_model, system_prompt, user_message,
                cache_system_prompt, temperature, max_tokens, task_description
            )
        except Exception as exc:
            if not self._fallback_enabled or not self._openai:
                raise
            
            logger.warning("Claude API error — switching to GPT-4o fallback.")
            self._log_fallback(agent_name, preferred_model, str(exc))
            self._enter_fallback_mode()
            return self._call_openai(agent_name, system_prompt, user_message, max_tokens, task_description)

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
        # Note: Gemini system prompt is handled via the start_chat or generation_config
        full_prompt = f"SYSTEM: {system}\n\nUSER: {user}"
        response = self._gemini.generate_content(
            full_prompt,
            generation_config=genai.types.GenerationConfig(
                max_output_tokens=tokens,
                temperature=temp,
            )
        )
        if self._cost_tracker:
            # Gemini billing is complex, logging tokens for tracking
            self._cost_tracker.log_call(agent_name, GEMINI_FLASH, 0, 0, False, "Gemini Research Call")
        return response.text

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
            "fallback_model": FALLBACK_MODEL,
            "error": error,
        }
        try:
            log = json.loads(FALLBACK_LOG_PATH.read_text(encoding="utf-8"))
            log.append(entry)
            FALLBACK_LOG_PATH.write_text(json.dumps(log, indent=2), encoding="utf-8")
        except Exception as exc:
            logger.error("Could not write fallback log: %s", exc)
