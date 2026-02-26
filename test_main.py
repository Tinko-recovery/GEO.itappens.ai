import time

def timed_import(msg, import_fn):
    start = time.time()
    print(f"{msg}...", end="", flush=True)
    import_fn()
    end = time.time()
    print(f" DONE ({end-start:.2f}s)")

print("=== Granular Import Timer ===")

timed_import("Importing asyncio", lambda: __import__('asyncio'))
timed_import("Importing logging", lambda: __import__('logging'))
timed_import("Importing os", lambda: __import__('os'))
timed_import("Importing datetime", lambda: __import__('datetime'))
timed_import("Importing dotenv", lambda: __import__('dotenv'))
timed_import("Importing SprintBoard", lambda: __import__('memory.sprint_board'))
timed_import("Importing CostTracker", lambda: __import__('cost.cost_tracker'))
timed_import("Importing AutoRouter", lambda: __import__('cost.auto_router'))
timed_import("Importing TelegramReporter", lambda: __import__('telegram_bot.reporter'))
timed_import("Importing CEOAgent", lambda: __import__('orchestration.ceo_agent'))
timed_import("Importing CTOAgent", lambda: __import__('orchestration.cto_agent'))
timed_import("Importing CPOAgent", lambda: __import__('orchestration.cpo_agent'))
timed_import("Importing QualityGateAgent", lambda: __import__('quality.quality_gate'))
timed_import("Importing engineering_team (lazy)", lambda: __import__('teams.engineering_team'))
timed_import("Importing marketing_team (lazy)", lambda: __import__('teams.marketing_team'))
timed_import("Importing sales_team (lazy)", lambda: __import__('teams.sales_team'))
timed_import("Importing TeamFactory", lambda: __import__('teams.team_factory'))

print("=== Timer Done ===")
