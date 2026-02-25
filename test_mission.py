import asyncio
import os
import sys
from main import run_company

async def start_test_mission():
    """
    Control Center for itappens.ai Missions.
    Usage: python test_mission.py "My Mission Goal"
    """
    goal = sys.argv[1] if len(sys.argv) > 1 else input("🚀 Enter Mission Goal: ")
    customer_id = "test_user_001"

    print(f"\n--- MISSION INITIALIZED ---")
    print(f"Goal: {goal}")
    print(f"User: {customer_id}")
    print(f"---------------------------\n")

    try:
        # We decrease teams for faster/cheaper tests
        result = await run_company(
            goal=goal,
            customer_id=customer_id,
            num_eng_teams=1,
            num_mkt_teams=1
        )
        
        print(f"\n✅ Mission Status: {result.get('status', 'complete')}")
        if "reason" in result:
            print(f"💡 Note: {result['reason']}")
            
    except Exception as e:
        print(f"\n❌ Mission Failed: {e}")

if __name__ == "__main__":
    asyncio.run(start_test_mission())
