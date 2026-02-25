"""
cost/cost_tracker.py
────────────────────
Tracks every API call's token usage and cost.
Enforces a daily budget kill switch and sends Telegram alerts.
"""

import json
import threading
from datetime import datetime, date
from pathlib import Path
from typing import Optional


COST_LOG_PATH = Path(__file__).parent.parent / "memory" / "cost_log.json"

# Per-million-token pricing
PRICING = {
    "claude-sonnet-4-5":         {"input": 3.00,  "output": 15.00},
    "claude-haiku-4-5-20251001": {"input": 1.00,  "output": 5.00},
    "gpt-4o":                    {"input": 2.50,  "output": 10.00},
}

# Cached-prompt discount (90% off input tokens when cache hits)
CACHE_DISCOUNT = 0.10  # pay only 10% of input price on cache hits


class CostTracker:
    """
    Tracks per-call token usage, calculates cost, enforces daily budget.

    Usage:
        tracker = CostTracker(daily_budget_usd=20.0, alert_threshold_usd=15.0)
        tracker.log_call(agent="CEO Agent", model="claude-sonnet-4-5",
                         input_tokens=500, output_tokens=300)
        today_spent = tracker.today_spent()
        remaining   = tracker.budget_remaining()
        tracker.check_kill_switch()  # raises BudgetExceededError if over limit
    """

    def __init__(
        self,
        daily_budget_usd: float = 20.0,
        alert_threshold_usd: float = 15.0,
        telegram_notifier=None,
    ):
        self.daily_budget = daily_budget_usd
        self.alert_threshold = alert_threshold_usd
        self._telegram = telegram_notifier  # optional TelegramReporter instance
        self._lock = threading.Lock()
        self._alert_sent_today = False
        self._ensure_log()

    # ── Internal helpers ────────────────────────────────────────────────────

    def _ensure_log(self) -> None:
        COST_LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
        if not COST_LOG_PATH.exists():
            COST_LOG_PATH.write_text(json.dumps([]), encoding="utf-8")

    def _read_log(self) -> list:
        return json.loads(COST_LOG_PATH.read_text(encoding="utf-8"))

    def _write_log(self, data: list) -> None:
        COST_LOG_PATH.write_text(json.dumps(data, indent=2, default=str), encoding="utf-8")

    @staticmethod
    def _calculate_cost(
        model: str,
        input_tokens: int,
        output_tokens: int,
        cache_hit: bool = False,
    ) -> float:
        prices = PRICING.get(model, PRICING["gpt-4o"])
        input_price = prices["input"] / 1_000_000 * input_tokens
        if cache_hit:
            input_price *= CACHE_DISCOUNT
        output_price = prices["output"] / 1_000_000 * output_tokens
        return round(input_price + output_price, 6)

    # ── Public API ──────────────────────────────────────────────────────────

    def log_call(
        self,
        agent: str,
        model: str,
        input_tokens: int,
        output_tokens: int,
        cache_hit: bool = False,
        task_description: str = "",
    ) -> float:
        """
        Log a single API call and return its cost in USD.
        Thread-safe; appends to cost_log.json.
        """
        cost = self._calculate_cost(model, input_tokens, output_tokens, cache_hit)
        entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "date": date.today().isoformat(),
            "agent": agent,
            "model": model,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "cache_hit": cache_hit,
            "cost_usd": cost,
            "task": task_description,
        }
        with self._lock:
            log = self._read_log()
            log.append(entry)
            self._write_log(log)
        return cost

    def today_spent(self) -> float:
        """Return total USD spent today."""
        today = date.today().isoformat()
        with self._lock:
            log = self._read_log()
        return round(sum(e["cost_usd"] for e in log if e["date"] == today), 4)

    def budget_remaining(self) -> float:
        """Return USD budget remaining today."""
        return round(self.daily_budget - self.today_spent(), 4)

    def pct_used(self) -> float:
        """Return percentage of daily budget used (0-100)."""
        return round((self.today_spent() / self.daily_budget) * 100, 1)

    def spend_by_agent_today(self) -> dict:
        """Return a dict mapping agent name → total USD spent today."""
        today = date.today().isoformat()
        with self._lock:
            log = self._read_log()
        result: dict[str, float] = {}
        for e in log:
            if e["date"] == today:
                result[e["agent"]] = round(result.get(e["agent"], 0) + e["cost_usd"], 4)
        return dict(sorted(result.items(), key=lambda x: x[1], reverse=True))

    def ascii_bar(self, width: int = 10) -> str:
        """Return an ASCII progress bar: [███░░░░░░░] 34%"""
        pct = self.pct_used()
        filled = int((pct / 100) * width)
        bar = "█" * filled + "░" * (width - filled)
        return f"[{bar}] {pct}%"

    def check_kill_switch(self) -> None:
        """
        Check if today's spend hits the alert threshold or daily budget cap.
        Raises BudgetExceededError if at/above cap.
        Sends a Telegram warning if at/above alert threshold (once per day).
        """
        spent = self.today_spent()

        if spent >= self.daily_budget:
            msg = (
                f"🛑 *BUDGET KILLED* — Daily cap of ${self.daily_budget:.2f} reached.\n"
                f"Spent: ${spent:.4f}. All agents paused until midnight UTC."
            )
            if self._telegram:
                self._telegram.send_now(msg)
            raise BudgetExceededError(
                f"Daily budget of ${self.daily_budget:.2f} exceeded (spent ${spent:.4f}). "
                "All teams paused."
            )

        if spent >= self.alert_threshold and not self._alert_sent_today:
            msg = (
                f"⚠️ *Budget Warning* — ${spent:.4f} / ${self.daily_budget:.2f} spent today.\n"
                f"Approaching daily cap. {self.ascii_bar()}"
            )
            if self._telegram:
                self._telegram.send_now(msg)
            self._alert_sent_today = True

    def telegram_cost_block(self) -> str:
        """
        Return a Telegram Markdown cost report block.
        Includes today's spend, bar, and top 3 agents.
        """
        spent = self.today_spent()
        remaining = self.budget_remaining()
        by_agent = self.spend_by_agent_today()
        top3 = list(by_agent.items())[:3]

        lines = [
            "*💰 COST REPORT*",
            f"${spent:.4f} / ${self.daily_budget:.2f}  {self.ascii_bar()}",
            f"Remaining: ${remaining:.4f}",
            "",
            "*Top Spenders:*",
        ]
        for agent, cost in top3:
            lines.append(f"  • {agent}: ${cost:.4f}")

        # Savings vs hiring ($15,000/mo team = $500/day)
        freelancer_daily = 500
        saved = max(0, freelancer_daily - spent)
        lines.append(f"\n💚 Saved vs hiring today: ~${saved:.0f}")
        return "\n".join(lines)

    def monthly_projection(self) -> float:
        """Return projected monthly spend based on today's rate."""
        return round(self.today_spent() * 30, 2)


class BudgetExceededError(Exception):
    """Raised when the daily budget cap is reached."""
    pass
