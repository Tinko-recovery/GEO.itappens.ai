from crewai import Agent, Task
from config import DISCLAIMER

class SynthesisAgent:
    def get_agent(self):
        return Agent(
            role='Senior Portfolio Strategist',
            goal='Synthesize technical and fundamental findings into a final, actionable recommendation.',
            backstory="""You are the ultimate decision-maker. You take the charts from the Technical Analyst 
            and the balance sheets from the Fundamental Analyst, and you decide what the final signal should be. 
            You communicate in plain English, explaining exactly WHY a recommendation is being made, 
            balancing short-term momentum with long-term value.""",
            verbose=True,
            allow_delegation=False,
            memory=True,
            llm="anthropic/claude-3-5-sonnet-20241022"
        )

    def get_task(self, ticker: str, technical_output: str, fundamental_output: str):
        return Task(
            description=f"""
            Synthesize the following reports for {ticker} into a final recommendation.
            
            TECHNICAL REPORT:
            {technical_output}
            
            FUNDAMENTAL REPORT:
            {fundamental_output}
            
            1. Recommend ONE signal: BUY, SELL, or HOLD.
            2. Provide a 3-4 sentence explanation in plain English for a non-expert user.
            3. Highlight the single most important factor (risk or opportunity).
            4. Assign an overall Confidence Score (0-100%).
            
            Every message MUST conclude with the following disclaimer verbatim:
            {DISCLAIMER}
            """,
            expected_output="A final synthesis report with Signal, Plain English Explanation, Key Factor, Confidence Score, and the mandatory Disclaimer.",
            agent=self.get_agent()
        )
