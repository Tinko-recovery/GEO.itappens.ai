"""
teams/engineering_team.py
─────────────────────────
Engineering Team: PM + Lead Engineer + Backend Dev + Frontend Dev + QA Engineer
Runs as a CrewAI Crew. Receives a technical brief and ships working code.
All outputs pass through the Quality Gate before delivery.
"""

import logging
from typing import Optional

def build_engineering_crew(
    team_id: str,
    technical_brief: str,
    customer_id: str,
    auto_router,
    llm_sonnet,
    llm_haiku,
) -> object:
    """
    Build a 5-agent engineering crew for the given technical brief.
    All agents receive customer context via their system prompt backstory.
    """
    # Heavy imports moved inside for lazy loading
    from crewai import Agent, Crew, Process, Task
    from crewai_tools import SerperDevTool
    from tools.file_tool import read_file_tool, write_file_tool
    from tools.code_executor import run_python_tool, run_javascript_tool
    from tools.github_tool import github_push_tool
    from tools.human_link import HumanLinkTool
    
    context = CustomerBrain.get_context_prompt(customer_id)
    serper_tool = SerperDevTool()
    human_tool = HumanLinkTool(telegram_reporter=None) # Injected by TeamFactory later

    # ── Agents ────────────────────────────────────────────────────────────────

    pm = Agent(
        role="Project Manager",
        goal="Break the technical brief into clear tasks for each engineer. Track progress.",
        backstory=(
            context +
            "You are an experienced software project manager. You speak clearly and concisely. "
            "You decompose features into small, shippable tasks and track them to completion. "
            "If you are unsure about a requirement, ask the CEO (Zenith) using your tool."
        ),
        llm=llm_haiku,
        tools=[write_file_tool, human_tool],
        verbose=True,
        allow_delegation=True,
    )

    lead_engineer = Agent(
        role="Lead Engineer",
        goal="Design the architecture and review all code for correctness and quality.",
        backstory=(
            context +
            "You are a senior software engineer. You design clean, scalable architectures. "
            "You review every line of code and ensure it follows best practices and the customer's tech stack. "
            "Once code is finalized, you use your Github tool to ship it to the 'staging' branch."
        ),
        llm=llm_sonnet,
        tools=[read_file_tool, write_file_tool, serper_tool, github_push_tool],
        verbose=True,
        allow_delegation=True,
    )

    backend_dev = Agent(
        role="Backend Developer",
        goal="Write complete, working backend code: APIs, database models, business logic.",
        backstory=(
            context +
            "You are a skilled backend developer. You write complete, production-ready code — "
            "never placeholders. You use the customer's tech stack and follow RESTful conventions."
        ),
        llm=llm_haiku,
        tools=[read_file_tool, write_file_tool, run_python_tool, serper_tool],
        verbose=False,
        allow_delegation=False,
    )

    frontend_dev = Agent(
        role="Frontend Developer",
        goal="Build complete, working frontend components: UI, forms, API integration.",
        backstory=(
            context +
            "You are a skilled frontend developer. You build complete, usable interfaces — "
            "never skeleton code. You integrate with the backend APIs and follow the brand style."
        ),
        llm=llm_haiku,
        tools=[read_file_tool, write_file_tool, run_javascript_tool],
        verbose=False,
        allow_delegation=False,
    )

    qa_engineer = Agent(
        role="QA Engineer",
        goal="Write and run tests. Identify bugs. Verify the code runs without errors.",
        backstory=(
            context +
            "You are a QA engineer. You write unit tests and integration tests. "
            "You catch bugs before they reach the customer. You verify code actually runs."
        ),
        llm=llm_haiku,
        tools=[read_file_tool, run_python_tool, run_javascript_tool],
        verbose=False,
        allow_delegation=False,
    )

    # ── Tasks ─────────────────────────────────────────────────────────────────

    plan_task = Task(
        description=(
            f"Technical Brief for Team {team_id}:\n{technical_brief}\n\n"
            "Create a numbered task list for this sprint. Each task should be "
            "assignable to Backend, Frontend, or both. Output the task list as markdown."
        ),
        agent=pm,
        expected_output="A numbered markdown task list with owner labels (Backend/Frontend).",
    )

    architecture_task = Task(
        description=(
            "Review the PM's task list and design the technical architecture. "
            "Define: API endpoints, database schema (if needed), component structure. "
            "Write the architecture doc to workspace/architecture.md"
        ),
        agent=lead_engineer,
        expected_output="Architecture document written to workspace/architecture.md",
        context=[plan_task],
    )

    backend_task = Task(
        description=(
            "Implement ALL backend tasks from the PM plan. "
            "Write complete, working code — no TODOs or placeholders. "
            "Save each file to workspace/backend/"
        ),
        agent=backend_dev,
        expected_output="Complete backend code written to workspace/backend/",
        context=[plan_task, architecture_task],
    )

    frontend_task = Task(
        description=(
            "Implement ALL frontend tasks from the PM plan. "
            "Build a complete, working interface that integrates with the backend. "
            "Save each file to workspace/frontend/"
        ),
        agent=frontend_dev,
        expected_output="Complete frontend code written to workspace/frontend/",
        context=[plan_task, architecture_task, backend_task],
    )

    qa_task = Task(
        description=(
            "Review all backend and frontend code. Write tests for the critical paths. "
            "Run the tests using the code executor tool. "
            "Report: tests passed, tests failed, bugs found."
        ),
        agent=qa_engineer,
        expected_output="QA report: test results, bugs found, overall verdict (pass/fail).",
        context=[backend_task, frontend_task],
    )

    return Crew(
        agents=[pm, lead_engineer, backend_dev, frontend_dev, qa_engineer],
        tasks=[plan_task, architecture_task, backend_task, frontend_task, qa_task],
        process=Process.sequential,
        verbose=False,
    )
