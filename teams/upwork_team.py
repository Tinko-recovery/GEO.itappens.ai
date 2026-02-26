"""
teams/upwork_team.py
────────────────────
Upwork Team: Researcher + Proposal Writer + Application Bot.
Handles the end-to-end flow: Find -> Propose -> Submit.
"""

import logging
from typing import Optional
from customer.customer_brain import CustomerBrain

def build_upwork_crew(
    team_id: str,
    job_target: str,
    customer_id: str,
    auto_router,
    llm_sonnet,
    llm_haiku,
) -> object:
    """
    Build a crew that finds Upwork jobs and submits applications autonomously.
    """
    from crewai import Agent, Crew, Process, Task
    from crewai_tools import SerperDevTool
    from tools.browser_tool import BrowserTool
    from tools.file_tool import read_file_tool
    from tools.human_link import HumanLinkTool
    
    context = CustomerBrain.get_context_prompt(customer_id)
    browser_tool = BrowserTool()
    serper_tool = SerperDevTool()
    human_tool = HumanLinkTool()

    # ── Agents ────────────────────────────────────────────────────────────────

    scout = Agent(
        role="Upwork Scout",
        goal=f"Find specific Upwork job URLs matching: {job_target}",
        backstory=(
            context +
            "You are an expert at finding high-paying freelancing jobs. "
            "You use Google and direct browsing to find job URLs on Upwork.com "
            "that perfectly match the customer's technical expertise."
        ),
        llm=llm_haiku,
        tools=[serper_tool, browser_tool],
        verbose=True,
    )

    writer = Agent(
        role="Proposal Architect",
        goal="Write a winning, personalized cover letter for the selected job.",
        backstory=(
            context +
            "You write cover letters that get hired. You analyze the job requirements "
            "and map them directly to the customer's past successes and the AI team's capabilities. "
            "You are concise, professional, and persuasive."
        ),
        llm=llm_sonnet,
        tools=[read_file_tool],
        verbose=True,
    )

    autopilot = Agent(
        role="Autonomous Application Bot",
        goal="Log in to Upwork, navigate to the job URL, and submit the proposal.",
        backstory=(
            context +
            "You share the customer's browser session. You navigate to the Upwork job URL, "
            "click 'Apply Now', fill in the cover letter provided by the Writer, "
            "and click 'Submit Proposal'. If you encounter a login screen or MFA, "
            "you use the Human Link tool to ask the founder for help."
        ),
        llm=llm_sonnet,
        tools=[browser_tool, human_tool],
        verbose=True,
    )

    # ── Tasks ─────────────────────────────────────────────────────────────────

    find_jobs = Task(
        description=f"Find the #1 best matching Upwork job for: {job_target}. Return the exact URL.",
        agent=scout,
        expected_output="The URL of the best matching Upwork job.",
    )

    draft_proposal = Task(
        description="Write a personalized cover letter for the job found. Use the customer context to make it compelling.",
        agent=writer,
        expected_output="A complete, ready-to-paste cover letter.",
        context=[find_jobs],
    )

    submit_application = Task(
        description=(
            "1. Navigate to the job URL.\n"
            "2. Click 'Apply Now'.\n"
            "3. Fill in the cover letter from the Writer.\n"
            "4. If there are milestone fields, set a reasonable default based on job type.\n"
            "5. Click 'Submit Proposal'.\n"
            "6. Report back with a confirmation or if you needed human intervention."
        ),
        agent=autopilot,
        expected_output="Confirmation of submission or a detailed error report.",
        context=[draft_proposal, find_jobs],
    )

    return Crew(
        agents=[scout, writer, autopilot],
        tasks=[find_jobs, draft_proposal, submit_application],
        process=Process.sequential,
        verbose=True,
    )
