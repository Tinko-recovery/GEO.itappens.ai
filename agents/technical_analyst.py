from crewai import Agent
from config import ANTHROPIC_API_KEY
from tools.market_data import MarketDataTool

class TechnicalAnalystAgent:
    def get_agent(self):
        return Agent(
            role='Senior Technical Analyst',
            goal='Analyze technical price action and indicators to determine market momentum and trend strength.',
            backstory="""You are an expert quantitative trader with decades of experience reading chart patterns 
            and technical indicators. You specialize in RSI, MACD, Moving Averages, and Volume profiles. 
            You are objective, data-driven, and ignore market noise to focus solely on what the charts are saying.""",
            verbose=True,
            allow_delegation=False,
            memory=True,
            llm="anthropic/claude-3-5-sonnet-20241022"
        )

    def get_task(self, ticker: str):
        market_data = MarketDataTool()
        df = market_data.get_stock_data(ticker)
        tech_indicators = market_data.calculate_technical_indicators(df)
        
        from crewai import Task
        return Task(
            description=f"""
            Conduct a thorough technical analysis for {ticker}.
            Current Technical Data:
            {tech_indicators}
            
            1. Analyze the RSI: Is it overbought (>70) or oversold (<30)?
            2. Check the MACD: Is there a bullish or bearish crossover?
            3. Evaluate price relative to SMA_50 and SMA_200.
            4. Look at general volume trends.
            
            Provide a technical rating from 0-100 (0 = extremely bearish, 100 = extremely bullish).
            """,
            expected_output="A detailed technical report including a 0-100 score and specific findings on RSI, MACD, and Moving Averages.",
            agent=self.get_agent()
        )
