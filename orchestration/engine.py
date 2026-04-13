from crewai import Crew, Process
from agents.technical_analyst import TechnicalAnalystAgent
from agents.fundamental_analyst import FundamentalAnalystAgent
from agents.synthesis_agent import SynthesisAgent
from database.supabase_client import SupabaseDB
from config import logger
import re

class AnalysisEngine:
    def __init__(self):
        self.tech_agent = TechnicalAnalystAgent()
        self.fund_agent = FundamentalAnalystAgent()
        self.synth_agent = SynthesisAgent()

    def run_full_analysis(self, ticker: str):
        logger.info(f"Starting full analysis for {ticker}")
        
        # 1. Define Tasks
        task_tech = self.tech_agent.get_task(ticker)
        task_fund = self.fund_agent.get_task(ticker)
        
        # We run tech and fund first to get their specialized outputs
        crew_prep = Crew(
            agents=[self.tech_agent.get_agent(), self.fund_agent.get_agent()],
            tasks=[task_tech, task_fund],
            process=Process.sequential,
        )
        
        results_prep = crew_prep.kickoff()
        
        # Extract individual outputs (simplified for MVP)
        tech_report = str(task_tech.output)
        fund_report = str(task_fund.output)
        
        # 2. Synthesis Task
        task_synth = self.synth_agent.get_task(ticker, tech_report, fund_report)
        crew_synth = Crew(
            agents=[self.synth_agent.get_agent()],
            tasks=[task_synth],
            process=Process.sequential
        )
        
        final_report = str(crew_synth.kickoff())
        
        # 3. Parse and Save to DB
        self._parse_and_save(ticker, final_report, tech_report, fund_report)
        
        return final_report

    def _parse_and_save(self, ticker: str, final_report: str, tech_report: str, fund_report: str):
        # Extract Signal (BUY/SELL/HOLD) using simple regex or string search
        signal = "HOLD"
        if "BUY" in final_report.upper(): signal = "BUY"
        elif "SELL" in final_report.upper(): signal = "SELL"
        
        # Extract Scores (Look for numbers followed by /100 or %)
        tech_score = self._extract_score(tech_report) or 50
        fund_score = self._extract_score(fund_report) or 50
        
        SupabaseDB.save_market_signal(
            ticker=ticker,
            signal=signal,
            tech_score=tech_score,
            fund_score=fund_score,
            reasoning=final_report
        )

    def _extract_score(self, text: str):
        match = re.search(r"(\d+)/100|\b(\d+)%", text)
        if match:
            return float(match.group(1) or match.group(2))
        return None
