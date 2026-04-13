from agents.technical_analyst import TechnicalAnalystAgent
from agents.fundamental_analyst import FundamentalAnalystAgent
from agents.synthesis_agent import SynthesisAgent
from orchestration.engine import AnalysisEngine
from tools.market_explorer import MarketExplorer
from database.supabase_client import SupabaseDB
from config import logger
import asyncio

class MarketStrategist:
    def __init__(self):
        self.engine = AnalysisEngine()
        
    def get_top_10_recommendations(self):
        """Scans top Nifty stocks and ranks the best buys."""
        # Major NSE tickers to scan
        tickers = [
            "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "ICICIBANK.NS",
            "BHARTIARTL.NS", "SBIN.NS", "LICI.NS", "ITC.NS", "HINDUNILVR.NS",
            "LT.NS", "BAJFINANCE.NS", "ADANIENT.NS", "MARUTI.NS", "TITAN.NS"
        ]
        
        results = []
        logger.info(f"Strategist: Scanning {len(tickers)} stocks for Top 10 rankings...")
        
        for ticker in tickers[:12]: # Limit scan for speed in MVP
            try:
                report = self.engine.run_full_analysis(ticker)
                # Simple extraction of score from report text for ranking
                score = 50 # Default
                if "Score:" in report:
                    try:
                        score = float(report.split("Score:")[1].split("/")[0].strip())
                    except: pass
                
                results.append({
                    "ticker": ticker,
                    "report": report,
                    "score": score
                })
            except Exception as e:
                logger.error(f"Failed to scan {ticker}: {e}")
                
        # Sort by score descending
        top_10 = sorted(results, key=lambda x: x['score'], reverse=True)[:10]
        return top_10

    def analyze_portfolio_for_sell(self, user_id):
        """Checks existing holdings and flags 'SELL' signals."""
        holdings = SupabaseDB.get_portfolio(user_id)
        recommendations = []
        
        for stock in holdings:
            ticker = stock['ticker']
            if not ticker.endswith(('.NS', '.BO')):
                ticker += ".NS" # Default to NSE
                
            report = self.engine.run_full_analysis(ticker)
            
            signal = "HOLD"
            if "SELL" in report.upper(): signal = "SELL"
            elif "BUY" in report.upper(): signal = "BUY"
            
            recommendations.append({
                "ticker": stock['ticker'],
                "current_signal": signal,
                "reasoning": report
            })
            
        return recommendations
