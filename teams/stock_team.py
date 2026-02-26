"""
teams/stock_team.py
────────────────────
Stock Intelligence Team — 3 specialist agents:

  1. Market Analyst     — technical analysis per stock (RSI, MACD, VWAP)
  2. Fundamentals Scout — earnings, debt, promoter activity screening
  3. Risk Manager       — final buy/sell/hold verdict with stop-loss sizing

Routing:
  - Market Analyst      → Gemini Flash  (long context, many tickers)
  - Fundamentals Scout  → Groq Llama    (fast structured screening)
  - Risk Manager        → Claude Sonnet (mission-critical decision)

Scheduled triggers (set in main.py):
  - Morning briefing: 08:30 IST daily (before NSE/BSE open at 09:15)
  - Intraday scan:    every 30 min between 09:15–15:30 IST
"""

import logging
from typing import Optional

logger = logging.getLogger(__name__)


def build_stock_crew(
    portfolio: list[str],
    customer_id: str,
    auto_router,
    telegram_notifier=None,
    mode: str = "morning",  # "morning" | "intraday"
) -> object:
    """
    Build the Stock Intelligence crew.

    Args:
        portfolio:  List of stock symbols e.g. ["RELIANCE", "TCS", "INFY"]
        customer_id: Customer identifier for memory
        auto_router: AutoRouter instance
        telegram_notifier: TelegramReporter for live alerts
        mode: "morning" for pre-market briefing, "intraday" for live signals
    """
    from crewai import Agent, Crew, Process, Task
    from tools.stock_tool import StockDataTool, MarketMoodTool, IntradaySignalTool
    from customer.customer_brain import CustomerBrain

    stock_tool = StockDataTool()
    mood_tool = MarketMoodTool()
    intraday_tool = IntradaySignalTool()
    context = CustomerBrain.get_context_prompt(customer_id)
    portfolio_str = ", ".join(portfolio)

    # ── LLM assignments (matches GEMINI_AGENTS / GROQ_AGENTS / SONNET_AGENTS) ─
    from langchain_anthropic import ChatAnthropic
    from langchain_openai import ChatOpenAI
    import os

    llm_sonnet = ChatAnthropic(
        model="claude-3-5-sonnet-20241022",
        api_key=os.getenv("ANTHROPIC_API_KEY"),
        temperature=0.3,
    )
    llm_haiku = ChatAnthropic(
        model="claude-3-5-haiku-20241022",
        api_key=os.getenv("ANTHROPIC_API_KEY"),
        temperature=0.2,
    )

    # ── Agents ────────────────────────────────────────────────────────────────

    market_analyst = Agent(
        role="Market Analyst",
        goal=(
            "Analyse each stock in the portfolio using RSI, MACD, and VWAP. "
            "Identify which stocks are in strong uptrends, which are overextended, "
            "and which are setting up for a move. Check the broader market mood first."
        ),
        backstory=(
            "You are a technical analyst with 15 years of experience on NSE and BSE. "
            "You read charts like a language, spotting patterns before they happen. "
            "You never recommend a stock without checking the Nifty trend first — "
            "you know a rising tide lifts all boats, and a falling market drowns them."
        ),
        tools=[stock_tool, mood_tool],
        llm=llm_haiku,
        verbose=True,
    )

    fundamentals_scout = Agent(
        role="Fundamentals Scout",
        goal=(
            "Screen each stock for fundamental health: P/E ratio vs sector average, "
            "debt-to-equity, revenue growth, and promoter holding trends. "
            "Flag any red flags — rising debt, promoter selling, or shrinking margins."
        ),
        backstory=(
            "You are a fundamental analyst trained on Indian corporate filings. "
            "You care about real business quality, not just price action. "
            "A technically perfect chart means nothing if the promoters are selling. "
            "You find the hidden risks the charts don't show."
        ),
        tools=[stock_tool],
        llm=llm_haiku,
        verbose=True,
    )

    risk_manager = Agent(
        role="Risk Manager",
        goal=(
            "Synthesise the technical and fundamental analysis into a final verdict "
            "for each stock: BUY, HOLD, or EXIT. "
            "For BUY signals: provide exact entry range, target price, and stop-loss. "
            "For intraday mode: identify the single best trade setup with entry, "
            "target, stop-loss, and risk/reward ratio. "
            "Never recommend buying when the overall market is in a downtrend."
        ),
        backstory=(
            "You are a veteran risk manager who has survived three Indian market crashes. "
            "You never let a good story override a bad chart, or vice versa. "
            "Your verdicts are precise, confident, and always include a stop-loss — "
            "because capital preservation is the first rule of trading. "
            "You deliver your analysis in plain English so any founder can understand it."
        ),
        tools=[mood_tool, intraday_tool],
        llm=llm_sonnet,
        verbose=True,
    )

    # ── Tasks ─────────────────────────────────────────────────────────────────

    if mode == "morning":
        task_technical = Task(
            description=(
                f"Check the overall market mood first (Nifty 50, Sensex, sector trends). "
                f"Then analyse each stock in this portfolio: {portfolio_str}. "
                f"For each stock: RSI level and signal, MACD crossover status, "
                f"and whether it is above or near key support. "
                f"Summarise in a clean table format."
            ),
            expected_output=(
                "A market mood summary followed by a technical analysis table "
                "with RSI, MACD signal, and trend for each portfolio stock."
            ),
            agent=market_analyst,
        )

        task_fundamentals = Task(
            description=(
                f"Screen the fundamental health of each stock: {portfolio_str}. "
                f"For each: P/E ratio, debt-to-equity, revenue growth, and promoter holding. "
                f"Flag any with concerning fundamentals. Keep it concise — one line per stock."
            ),
            expected_output=(
                "A one-line fundamental health summary per stock, "
                "with any red flags clearly highlighted."
            ),
            agent=fundamentals_scout,
            context=[task_technical],
        )

        task_verdict = Task(
            description=(
                f"Using the technical and fundamental analysis, deliver the morning briefing "
                f"for {customer_id}'s portfolio: {portfolio_str}. "
                f"Format:\n"
                f"MARKET MOOD: [1-2 sentences on Nifty/Sensex trend]\n"
                f"For each stock:\n"
                f"  [SYMBOL] — [BUY / HOLD / EXIT]\n"
                f"  Reason: [plain English, 1-2 sentences]\n"
                f"  [If BUY: Entry: ₹X | Target: ₹Y | Stop-Loss: ₹Z]\n"
                f"\nEnd with: TOP OPPORTUNITY TODAY: [single best stock and why]"
            ),
            expected_output=(
                "A complete morning briefing with market mood, verdict per stock, "
                "and the single best opportunity of the day."
            ),
            agent=risk_manager,
            context=[task_technical, task_fundamentals],
        )

        tasks = [task_technical, task_fundamentals, task_verdict]

    else:  # intraday mode
        task_mood = Task(
            description=(
                "Check the current market mood right now. Is Nifty above VWAP? "
                "Are FII flows positive? Is the broader trend up or down intraday? "
                "This sets the bias for all intraday trades."
            ),
            expected_output="A 2-3 sentence intraday market bias: bullish, bearish, or sideways.",
            agent=market_analyst,
        )

        task_scan = Task(
            description=(
                f"Scan these stocks for intraday setups: {portfolio_str}. "
                f"Look for VWAP reclaim patterns, RSI(9) momentum entries, or breakout setups. "
                f"Only flag setups that have a clear entry, stop-loss, and 1:1.5+ risk/reward."
            ),
            expected_output=(
                "A list of active intraday setups with entry, target, and stop-loss. "
                "If no clean setups exist, say so clearly — 'No trade today' is a valid answer."
            ),
            agent=risk_manager,
            context=[task_mood],
        )

        tasks = [task_mood, task_scan]

    # ── Crew ──────────────────────────────────────────────────────────────────

    crew = Crew(
        agents=[market_analyst, fundamentals_scout, risk_manager],
        tasks=tasks,
        process=Process.sequential,
        verbose=True,
    )

    return crew


async def run_morning_briefing(
    portfolio: list[str],
    customer_id: str,
    auto_router,
    telegram_notifier,
) -> str:
    """Run the morning pre-market briefing and send result to Telegram."""
    import asyncio
    logger.info("Stock Intelligence: starting morning briefing for %s", customer_id)
    try:
        crew = build_stock_crew(
            portfolio=portfolio,
            customer_id=customer_id,
            auto_router=auto_router,
            telegram_notifier=telegram_notifier,
            mode="morning",
        )
        result = await asyncio.to_thread(crew.kickoff)
        report = str(result)

        if telegram_notifier:
            header = "📈 *Morning Market Briefing*\n━━━━━━━━━━━━━━━━━━━━\n"
            # Telegram message limit is 4096 chars
            msg = header + report[:3800]
            telegram_notifier.send_now(msg)

        logger.info("Stock Intelligence: morning briefing complete for %s", customer_id)
        return report
    except Exception as e:
        logger.error("Stock Intelligence morning briefing failed: %s", e)
        if telegram_notifier:
            telegram_notifier.send_now(f"⚠️ Morning briefing failed: {e}")
        return f"Error: {e}"


async def run_intraday_scan(
    portfolio: list[str],
    customer_id: str,
    auto_router,
    telegram_notifier,
) -> str:
    """Run an intraday scan and alert only if actionable setups are found."""
    import asyncio
    logger.info("Stock Intelligence: intraday scan for %s", customer_id)
    try:
        crew = build_stock_crew(
            portfolio=portfolio,
            customer_id=customer_id,
            auto_router=auto_router,
            telegram_notifier=telegram_notifier,
            mode="intraday",
        )
        result = await asyncio.to_thread(crew.kickoff)
        report = str(result)

        # Only send Telegram alert if there's an actual trade setup
        no_trade_phrases = ["no trade", "no clean", "no setup", "wait", "sideways"]
        has_setup = not any(p in report.lower() for p in no_trade_phrases)

        if telegram_notifier and has_setup:
            header = "🚨 *Intraday Alert*\n━━━━━━━━━━━━━━━━━━━━\n"
            telegram_notifier.send_now(header + report[:3600])
            logger.info("Stock Intelligence: intraday alert sent for %s", customer_id)
        else:
            logger.info("Stock Intelligence: no actionable intraday setup, skipping alert")

        return report
    except Exception as e:
        logger.error("Stock Intelligence intraday scan failed: %s", e)
        return f"Error: {e}"
