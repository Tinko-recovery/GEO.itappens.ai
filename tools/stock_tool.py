"""
tools/stock_tool.py
───────────────────
Stock data tools for the Stock Intelligence feature.
Fetches BSE/NSE OHLCV data via yfinance and computes
RSI, MACD, and VWAP technical indicators in-process.
Keeps external API calls to a minimum — one yfinance
call per ticker covers data + fundamentals.
"""

import logging
from datetime import date, timedelta
from typing import Any

import pandas as pd
import yfinance as yf
from crewai.tools import BaseTool

logger = logging.getLogger(__name__)


# ── Helpers ──────────────────────────────────────────────────────────────────

def _rsi(close: pd.Series, period: int = 14) -> float:
    delta = close.diff()
    gain = delta.clip(lower=0).rolling(period).mean()
    loss = (-delta.clip(upper=0)).rolling(period).mean()
    rs = gain / loss.replace(0, float("nan"))
    rsi_series = 100 - (100 / (1 + rs))
    return round(float(rsi_series.iloc[-1]), 2)


def _macd(close: pd.Series) -> dict:
    ema12 = close.ewm(span=12, adjust=False).mean()
    ema26 = close.ewm(span=26, adjust=False).mean()
    macd_line = ema12 - ema26
    signal_line = macd_line.ewm(span=9, adjust=False).mean()
    histogram = macd_line - signal_line
    crossover = (
        "bullish" if (macd_line.iloc[-1] > signal_line.iloc[-1] and
                      macd_line.iloc[-2] <= signal_line.iloc[-2])
        else "bearish" if (macd_line.iloc[-1] < signal_line.iloc[-1] and
                           macd_line.iloc[-2] >= signal_line.iloc[-2])
        else "neutral"
    )
    return {
        "macd": round(float(macd_line.iloc[-1]), 4),
        "signal": round(float(signal_line.iloc[-1]), 4),
        "histogram": round(float(histogram.iloc[-1]), 4),
        "crossover": crossover,
    }


def _vwap(df: pd.DataFrame) -> float:
    """Intraday VWAP using today's 1-minute data."""
    typical = (df["High"] + df["Low"] + df["Close"]) / 3
    vwap = (typical * df["Volume"]).cumsum() / df["Volume"].cumsum()
    return round(float(vwap.iloc[-1]), 2)


def _ticker(symbol: str) -> str:
    """Normalise raw symbol to yfinance format (e.g. RELIANCE → RELIANCE.NS)."""
    s = symbol.upper().strip()
    if s.endswith(".NS") or s.endswith(".BO"):
        return s
    # 6-digit BSE code → .BO
    if s.isdigit() and len(s) == 6:
        return f"{s}.BO"
    return f"{s}.NS"  # default to NSE


# ── Tools ─────────────────────────────────────────────────────────────────────

class StockDataTool(BaseTool):
    name: str = "stock_data"
    description: str = (
        "Fetch OHLCV price history and key fundamentals for an Indian stock. "
        "Input: stock symbol e.g. 'RELIANCE', 'TCS', 'INFY', or BSE code '500325'. "
        "Returns: current price, 30-day OHLCV, RSI, MACD, and fundamental snapshot."
    )

    def _run(self, symbol: str) -> str:
        ticker = _ticker(symbol)
        try:
            tkr = yf.Ticker(ticker)
            hist = tkr.history(period="60d", interval="1d", auto_adjust=True)
            if hist.empty:
                return f"No data found for {ticker}. Check the symbol."

            close = hist["Close"]
            current_price = round(float(close.iloc[-1]), 2)
            prev_close = round(float(close.iloc[-2]), 2)
            change_pct = round(((current_price - prev_close) / prev_close) * 100, 2)

            rsi = _rsi(close)
            macd = _macd(close)

            info = tkr.info or {}
            fundamentals = {
                "pe_ratio": info.get("trailingPE", "N/A"),
                "market_cap_cr": round(info.get("marketCap", 0) / 1e7, 0) if info.get("marketCap") else "N/A",
                "debt_to_equity": info.get("debtToEquity", "N/A"),
                "promoter_holding_pct": info.get("heldPercentInsiders", "N/A"),
                "revenue_growth": info.get("revenueGrowth", "N/A"),
                "sector": info.get("sector", "N/A"),
            }

            rsi_signal = (
                "oversold — potential buy zone" if rsi < 35
                else "overbought — caution" if rsi > 70
                else "neutral zone"
            )

            return (
                f"=== {ticker} ===\n"
                f"Price: ₹{current_price} ({'+' if change_pct >= 0 else ''}{change_pct}% today)\n"
                f"RSI(14): {rsi} → {rsi_signal}\n"
                f"MACD: {macd['macd']} | Signal: {macd['signal']} | Crossover: {macd['crossover']}\n"
                f"Fundamentals: P/E={fundamentals['pe_ratio']} | "
                f"Mkt Cap=₹{fundamentals['market_cap_cr']}Cr | "
                f"D/E={fundamentals['debt_to_equity']} | "
                f"Promoter={fundamentals['promoter_holding_pct']} | "
                f"Sector={fundamentals['sector']}\n"
                f"Revenue Growth: {fundamentals['revenue_growth']}"
            )
        except Exception as e:
            logger.error("StockDataTool error for %s: %s", ticker, e)
            return f"Error fetching data for {ticker}: {e}"


class MarketMoodTool(BaseTool):
    name: str = "market_mood"
    description: str = (
        "Check the overall Indian market mood: Nifty 50 and Sensex levels, "
        "trend, and whether conditions favour buying or sitting out. "
        "No input required."
    )

    def _run(self, input: str = "") -> str:
        try:
            results = []
            indices = {
                "Nifty 50": "^NSEI",
                "Sensex": "^BSESN",
                "Nifty Bank": "^NSEBANK",
                "Nifty IT": "^CNXIT",
            }
            for name, sym in indices.items():
                tkr = yf.Ticker(sym)
                hist = tkr.history(period="5d", interval="1d", auto_adjust=True)
                if hist.empty:
                    continue
                close = hist["Close"]
                current = round(float(close.iloc[-1]), 2)
                prev = round(float(close.iloc[-2]), 2)
                chg = round(((current - prev) / prev) * 100, 2)
                rsi = _rsi(close)
                results.append(
                    f"{name}: {current:,.0f} ({'+' if chg >= 0 else ''}{chg}%) | RSI {rsi}"
                )

            # Overall mood
            nifty_hist = yf.Ticker("^NSEI").history(period="10d", interval="1d", auto_adjust=True)
            close = nifty_hist["Close"]
            above_ma5 = close.iloc[-1] > close.rolling(5).mean().iloc[-1]
            mood = "BULLISH — market trending up, buying conditions favourable" if above_ma5 \
                else "BEARISH — market below 5-day average, prefer caution or hedging"

            return "\n".join(results) + f"\n\nOverall Mood: {mood}"
        except Exception as e:
            logger.error("MarketMoodTool error: %s", e)
            return f"Error fetching market data: {e}"


class IntradaySignalTool(BaseTool):
    name: str = "intraday_signal"
    description: str = (
        "Get an intraday trade setup for a stock with entry, target, and stop-loss. "
        "Uses VWAP + RSI on 5-minute data. "
        "Input: stock symbol e.g. 'TATAMOTORS', 'SBIN'."
    )

    def _run(self, symbol: str) -> str:
        ticker = _ticker(symbol)
        try:
            tkr = yf.Ticker(ticker)
            hist = tkr.history(period="1d", interval="5m", auto_adjust=True)
            if hist.empty or len(hist) < 20:
                return f"Not enough intraday data for {ticker}."

            current_price = round(float(hist["Close"].iloc[-1]), 2)
            vwap = _vwap(hist)
            rsi = _rsi(hist["Close"], period=9)

            # Simple VWAP-reclaim long setup
            above_vwap = current_price > vwap
            momentum_ok = 40 < rsi < 65

            if above_vwap and momentum_ok:
                entry = current_price
                sl = round(vwap * 0.995, 2)
                target1 = round(entry + (entry - sl) * 1.5, 2)
                target2 = round(entry + (entry - sl) * 2.5, 2)
                rr = round((target1 - entry) / (entry - sl), 1)
                return (
                    f"=== Intraday Setup: {ticker} ===\n"
                    f"Bias: LONG (price above VWAP + RSI healthy)\n"
                    f"Entry: ₹{entry} | VWAP: ₹{vwap}\n"
                    f"Stop-Loss: ₹{sl} (0.5% below VWAP)\n"
                    f"Target 1: ₹{target1} | Target 2: ₹{target2}\n"
                    f"Risk/Reward: 1:{rr}\n"
                    f"RSI(9): {rsi}"
                )
            else:
                reason = []
                if not above_vwap:
                    reason.append(f"price ₹{current_price} is below VWAP ₹{vwap}")
                if not momentum_ok:
                    reason.append(f"RSI {rsi} is {'overbought' if rsi >= 65 else 'weak'}")
                return (
                    f"No clean intraday setup for {ticker} right now.\n"
                    f"Reason: {'; '.join(reason)}. Wait for a better entry."
                )
        except Exception as e:
            logger.error("IntradaySignalTool error for %s: %s", ticker, e)
            return f"Error computing intraday signal for {ticker}: {e}"
