"""
teams/scouting_team.py
──────────────────────
Scouting Team: Lead Scout + Researcher.
Specialized in finding opportunities (jobs/leads) and letting the human choose.
"""

import logging
from typing import Optional
from customer.customer_brain import CustomerBrain

def build_scouting_crew(
    team_id: str,
    scouting_brief: str,
    customer_id: str,
    auto_router,
    llm_sonnet,
    llm_haiku,
) -> object:
    """
    Build a crew that searches for items and waits for human selection.
    """
    # Heavy imports moved inside for lazy loading
    from crewai import Agent, Crew, Process, Task
    from crewai_tools import SerperDevTool
    from tools.scout_tool import ScoutSelectionTool
    from tools.file_tool import read_file_tool, write_file_tool
    
    context = CustomerBrain.get_context_prompt(customer_id)
    serper_tool = SerperDevTool()
    scout_tool = ScoutSelectionTool(telegram_reporter=None) # Injected by TeamFactory later

    # ── Agents ────────────────────────────────────────────────────────────────

    researcher = Agent(
        role="Lead Scout",
        goal=f"Find the best 5-10 opportunities matching: {scouting_brief}",
        backstory=(
            context +
            "You are an expert at digital scouting. You find high-quality, specific "
            "opportunities (jobs, leads, or projects) that match the customer's goal. "
            "You gather detailed information for each: title, source, requirements, and value."
        ),
        llm=llm_haiku,
        tools=[serper_tool, read_file_tool],
        verbose=True,
        allow_delegation=False,
    )

    coordinator = Agent(
        role="Scout Coordinator",
        goal="Present the findings to the founder and wait for their specific selection.",
        backstory=(
            context +
            "You bridge the gap between AI research and human decision-making. "
            "Once the Lead Scout finds options, you use your scouting tool to present "
            "them to the founder via Telegram. You wait until they pick the ONE they like most."
        ),
        llm=llm_sonnet,
        tools=[scout_tool, write_file_tool],
        verbose=True,
        allow_delegation=False,
    )

    # ── Tasks ─────────────────────────────────────────────────────────────────

    search_task = Task(
        description=(
            f"Search for 5-10 specific opportunities matching this brief: {scouting_brief}. "
            "Your output must be a clean list of options with a short description for each."
        ),
        agent=researcher,
        expected_output="A list of 5-10 specific opportunities with descriptions.",
    )

    selection_task = Task(
        description=(
            "Review the list of opportunities from the Lead Scout. "
            "Extract the titles of these opportunities and use your selection tool "
            "to present them to the founder. WAIT for their selection. "
            "Once selected, your output should be the specific details of the ONE item they chose."
        ),
        agent=coordinator,
        expected_output="The specific details of the opportunity chosen by the user.",
        context=[search_task],
    )

    return Crew(
        agents=[researcher, coordinator],
        tasks=[search_task, selection_task],
        process=Process.sequential,
        verbose=True,
    )
