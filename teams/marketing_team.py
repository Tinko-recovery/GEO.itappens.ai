"""
teams/marketing_team.py
───────────────────────
Marketing Team: PM + Content Lead + SEO Specialist + Marketing Analyst
Runs as a CrewAI Crew. Receives a marketing brief and ships content.
All outputs pass through the Quality Gate before delivery.
"""

import logging

from crewai import Agent, Crew, Process, Task
from crewai_tools import SerperDevTool

from tools.file_tool import read_file_tool, write_file_tool
from tools.twitter_tool import twitter_post_tool, twitter_thread_tool
from customer.customer_brain import CustomerBrain

logger = logging.getLogger(__name__)

serper_tool = SerperDevTool()


def build_marketing_crew(
    team_id: str,
    marketing_brief: dict,
    customer_id: str,
    auto_router,
    llm_sonnet,
    llm_haiku,
) -> Crew:
    """
    Build a 4-agent marketing crew for the given marketing brief.
    All agents receive customer context via their backstory.
    """
    context = CustomerBrain.get_context_prompt(customer_id)
    brain = CustomerBrain.load(customer_id)
    brand_voice = brain.get("brand_voice", "Professional, direct, no jargon")
    target_customer = brain.get("target_customer", "founders and developers")

    campaign_theme = marketing_brief.get("campaign_theme", "Product launch")
    content_type = marketing_brief.get("content_type", "blog")
    cta = marketing_brief.get("primary_cta", "Visit our website")
    keywords = ", ".join(marketing_brief.get("keywords", []))
    deliverables = "\n".join(f"- {d}" for d in marketing_brief.get("deliverables", [campaign_theme]))

    from tools.human_link import HumanLinkTool
    human_tool = HumanLinkTool(telegram_reporter=None) # Injected by TeamFactory

    # ── Agents ────────────────────────────────────────────────────────────────

    pm = Agent(
        role="Marketing Project Manager",
        goal="Plan the content calendar and coordinate the marketing team.",
        backstory=(
            context +
            "You manage marketing campaigns for SaaS products. You ensure every piece of content "
            "serves a strategic purpose and hits the right audience at the right time. "
            "If the campaign direction is unclear, ask the CEO (Zenith)."
        ),
        llm=llm_haiku,
        tools=[write_file_tool, human_tool],
        verbose=True,
        allow_delegation=True,
    )

    content_lead = Agent(
        role="Content Lead",
        goal=(
            f"Write high-quality {content_type} content with brand voice: {brand_voice}. "
            "Never write generic AI filler. Every sentence must earn its place."
        ),
        backstory=(
            context +
            f"You are an expert SaaS content writer. Your brand voice is: {brand_voice}. "
            f"You write for {target_customer}. You write content that converts, not just informs."
        ),
        llm=llm_sonnet,
        tools=[read_file_tool, write_file_tool, serper_tool],
        verbose=False,
        allow_delegation=False,
    )

    seo_specialist = Agent(
        role="SEO Specialist",
        goal=(
            f"Research keywords and optimize all content for search. Primary keywords: {keywords or 'to be researched'}."
        ),
        backstory=(
            context +
            "You are an SEO specialist for SaaS companies. You find low-competition, high-intent keywords. "
            "You optimize titles, meta descriptions, and headers for both search engines and humans."
        ),
        llm=llm_haiku,
        tools=[serper_tool, read_file_tool, write_file_tool],
        verbose=False,
        allow_delegation=False,
    )

    analyst = Agent(
        role="Marketing Analyst",
        goal="Analyze the content strategy and measure projected impact. Report on expected reach and conversions.",
        backstory=(
            context +
            "You analyze content marketing effectiveness. You estimate reach, engagement, and conversion rates. "
            "You prioritize tactics by ROI and recommend the highest-impact actions."
        ),
        llm=llm_haiku,
        tools=[serper_tool, write_file_tool],
        verbose=False,
        allow_delegation=False,
    )

    # ── Tasks ─────────────────────────────────────────────────────────────────

    plan_task = Task(
        description=(
            f"Marketing Brief for Team {team_id}:\n"
            f"Campaign: {campaign_theme}\n"
            f"Content Type: {content_type}\n"
            f"Target Audience: {target_customer}\n"
            f"CTA: {cta}\n"
            f"Deliverables:\n{deliverables}\n\n"
            "Create a content production plan with deadlines and owner assignments."
        ),
        agent=pm,
        expected_output="Content plan: tasks, owners, and content angle for each deliverable.",
    )

    seo_task = Task(
        description=(
            f"Research the best keywords for this campaign. Primary topic: {campaign_theme}. "
            f"Seed keywords: {keywords or 'research needed'}. "
            "Find 5 keywords with search intent and low competition. "
            "Write results to workspace/seo_research.md"
        ),
        agent=seo_specialist,
        expected_output="SEO research: 5 keywords with intent labels and difficulty scores.",
        context=[plan_task],
    )

    content_task = Task(
        description=(
            f"Write the {content_type} content for this campaign. "
            f"Campaign theme: {campaign_theme}. "
            f"Use the SEO keywords from the research. "
            f"Brand voice: {brand_voice}. CTA: {cta}. "
            "Be specific to the product — no generic AI filler. "
            "Write to workspace/content/ with the appropriate filename."
        ),
        agent=content_lead,
        expected_output=f"Complete {content_type} content written to workspace/content/",
        context=[plan_task, seo_task],
    )

    analysis_task = Task(
        description=(
            "Review the completed content and provide: "
            "1) Estimated reach and engagement projections "
            "2) Conversion rate estimate "
            "3) Top 3 recommendations for improving performance "
            "Write analysis to workspace/content_analysis.md"
        ),
        agent=analyst,
        expected_output="Marketing analysis report with reach projections and recommendations.",
        context=[content_task, seo_task],
    )

    return Crew(
        agents=[pm, content_lead, seo_specialist, analyst],
        tasks=[plan_task, seo_task, content_task, analysis_task],
        process=Process.sequential,
        verbose=False,
    )
