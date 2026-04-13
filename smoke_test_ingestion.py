"""
smoke_test_ingestion.py
───────────────────────
Verifies that the KnowledgeIngestionTool can parse raw files and generate a brain.json.
"""

import asyncio
import os
import json
from pathlib import Path
from tools.knowledge_ingestion_tool import KnowledgeIngestionTool

async def test_ingestion():
    customer_id = "test_founder_001"
    knowledge_dir = "itcontents/knowledge"
    
    # Setup test data
    os.makedirs(knowledge_dir, exist_ok=True)
    
    # 1. Create a sample context_urls.txt
    with open(f"{knowledge_dir}/context_urls.txt", "w") as f:
        f.write("https://example.com\n")
        
    # 2. Create a sample text file
    with open(f"{knowledge_dir}/product_pitch.txt", "w") as f:
        f.write("itappens.ai is a digital foundry for stealth brands. Specifically designed for Sadish Sugumaran.")

    print(f"Running ingestion test for {customer_id}...")
    tool = KnowledgeIngestionTool(customer_id=customer_id, knowledge_dir=knowledge_dir)
    result = await tool.run_ingestion()
    
    print(f"Result Status: {result['status']}")
    
    brain_path = Path(f"{knowledge_dir}/brain.json")
    if brain_path.exists():
        print("PASS: brain.json generated successfully.")
        brain_data = json.loads(brain_path.read_text())
        print(f"Entities found: {brain_data.get('entities', [])}")
        
        # Check for stealth mode (from smoke_test_stealth logic)
        content_str = json.dumps(brain_data)
        if "Sadish Sugumaran" in content_str:
            print("FAIL: STEALTH FAILURE: Personal name found in brain.json")
        else:
            print("PASS: STEALTH SUCCESS: Personal name abstracted.")
    else:
        print("FAIL: FAILED: brain.json not found.")

if __name__ == "__main__":
    asyncio.run(test_ingestion())
