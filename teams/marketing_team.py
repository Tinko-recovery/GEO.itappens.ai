"""
teams/marketing_team.py
───────────────────────
Marketing Team: PM + Content Lead + SEO Specialist + Marketing Analyst
Runs as a CrewAI Crew. Receives a marketing brief and ships content.
All outputs pass through the Quality Gate before delivery.
"""

import logging
from crewai import Agent, Task, Crew, Process
from crewai_tools import SerperDevTool
from tools.human_link import HumanLinkTool
from tools.knowledge_ingestion_tool import KnowledgeIngestionTool
from tools.buffer_tool import BufferPostTool
from tools.file_tool import read_file_tool, write_file_tool

logger = logging.getLogger(__name__)
def build_marketing_crew(
    team_id: str,
    marketing_brief: dict,
    customer_id: str,
    auto_router,
    llm_sonnet,
    llm_haiku,
) -> object:
    """
    Build a 4-agent marketing crew for the given marketing brief.
    All agents receive customer context via their backstory.
    """
    from customer.customer_brain import CustomerBrain
    
    brain = CustomerBrain.load(customer_id)
    if brain.get("tier") != "Scale":
        logger.warning("Marketing Team creation halted for %s. Scale Plan required.", customer_id)
        # We return a dummy object or raise an error? For now, we'll let TeamFactory handle it if we raise, 
        # but to be safe we'll return a minimal 'Locked' notice via an Exception or similar.
        raise ValueError(f"Scale Plan Required for {customer_id} to run marketing campaigns.")

    context = CustomerBrain.get_context_prompt(customer_id)
    brand_voice = brain.get("brand_voice", "Professional, direct, no jargon")
    target_customer = brain.get("target_customer", "founders and developers")

    campaign_theme = marketing_brief.get("campaign_theme", "Product launch")
    content_type = marketing_brief.get("content_type", "blog")
    cta = marketing_brief.get("primary_cta", "Visit our website")
    keywords = ", ".join(marketing_brief.get("keywords", []))
    deliverables = "\n".join(f"- {d}" for d in marketing_brief.get("deliverables", [campaign_theme]))

    human_tool = HumanLinkTool(telegram_reporter=None) # Injected by TeamFactory
    serper_tool = SerperDevTool()
    ingestion_tool = KnowledgeIngestionTool(customer_id=customer_id)
    buffer_tool = BufferPostTool()

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

    geo_strategist = Agent(
        role="GEO Content Strategist",
        goal=(
            f"Incorporate deep knowledge into the campaign and optimize for Citation Gravity. "
            "Run the KnowledgeIngestionTool first to ensure we have the latest truth."
        ),
        backstory=(
            context +
            "You are a specialist in Generative Engine Optimization (GEO). You ensure our content "
            "is factual, authoritative, and structured for AI search engines (ChatGPT/Perplexity). "
            "You use the 'itcontents/knowledge/' vault as your ground truth."
        ),
        llm=llm_sonnet,
        tools=[serper_tool, read_file_tool],
        verbose=True,
        allow_delegation=False,
    )

    social_manager = Agent(
        role="Social Distribution Manager",
        goal="Adapt high-level content into social variations and stage them for review.",
        backstory=(
            context +
            "You are an expert in social media distribution. You take blog posts or campaigns "
            "and create variants for LinkedIn, Twitter (X), and Instagram. "
            "You stage everything in the 'itcontents/ready/' folder and Buffer for human review."
        ),
        llm=llm_haiku,
        tools=[buffer_tool, write_file_tool],
        verbose=True,
        allow_delegation=False,
    )

    # ── Tasks ─────────────────────────────────────────────────────────────────

    ingestion_task = Task(
        description=(
            "First, run the KnowledgeIngestionTool to process all files and URLs in 'itcontents/knowledge/'. "
            "This will generate or update 'brain.json'. Review the findings to align the team."
        ),
        agent=geo_strategist,
        expected_output="A summary of new entities and GEO triggers found in the knowledge vault.",
    )

    plan_task = Task(
        description=(
            f"Marketing Brief for Team {team_id}:\n"
            f"Campaign: {campaign_theme}\n"
            f"Content Type: {content_type}\n"
            f"Target Audience: {target_customer}\n"
            f"CTA: {cta}\n"
            "Create a content production plan including GEO citation strategies."
        ),
        agent=pm,
        expected_output="Content plan: tasks, owners, and GEO citation strategy for each deliverable.",
        context=[ingestion_task],
    )

    content_task = Task(
        description=(
            f"Write the {content_type} content for this campaign based on the updated brain insights. "
            f"Brand voice: {brand_voice}. CTA: {cta}. "
            "Write to workspace/content/ with the appropriate filename."
        ),
        agent=content_lead,
        expected_output=f"Complete {content_type} content written to workspace/content/",
        context=[plan_task, ingestion_task],
    )

    social_task = Task(
        description=(
            "Generate social media snippets (LinkedIn post, 3 Tweets, IG caption) from the content. "
            "Inject 2-3 'Semantic Hooks' for Perplexity citations in each variant. "
            "1. Save variants as a JSON file in 'itcontents/ready/sprint_output.json'. "
            "2. Stage the posts in Buffer for review using the BufferTool."
        ),
        agent=social_manager,
        expected_output="Social variants saved to itcontents/ready/ and staged in Buffer.",
        context=[content_task],
    )

    return Crew(
        agents=[pm, content_lead, geo_strategist, social_manager],
        tasks=[ingestion_task, plan_task, content_task, social_task],
        process=Process.sequential,
        verbose=False,
    )
