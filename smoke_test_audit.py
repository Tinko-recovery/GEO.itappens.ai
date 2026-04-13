"""
smoke_test_audit.py
───────────────────
Verifies the GeoAuditorTool's ability to generate a weaponized report 
and successfully scrub personal IDs (The Principal Protocol).
"""

import asyncio
from tools.geo_auditor_tool import GeoAuditorTool

async def test_audit():
    auditor = GeoAuditorTool()
    
    # Test URL - using a high-authority competitor site for the 'benchmark' logic
    test_url = "https://openai.com" 
    print(f"Running weaponized audit on: {test_url}...")
    
    report = await auditor.run_audit(test_url)
    
    # Check for report existence
    if not report or "ERROR" in report:
        print(f"❌ FAILURE: Audit failed. {report}")
        return

    print("✅ SUCCESS: Report generated.")
    
    # Check for Stealth Protocol (Principal filter)
    forbidden_terms = ["Sadish", "Sugumaran", "sadish@itappens.ai"]
    stealth_passed = True
    for term in forbidden_terms:
        if term.lower() in report.lower():
            print(f"❌ FAILURE: Stealth protocol breached! Found forbidden term: {term}")
            stealth_passed = False
    
    if stealth_passed:
        print("✅ SUCCESS: Stealth protocol (The Principal) enforced perfectly.")

    # Check for Key Sections
    key_sections = ["BATTLECARD", "TOKEN GAP", "SEMANTIC HOOKS", "GRAVITY"]
    for section in key_sections:
        if section not in report.upper():
            print(f"⚠️ WARNING: Section '{section}' might be missing from the report.")
        else:
            print(f"✅ SUCCESS: Found section: {section}")

    print("\n--- REPORT PREVIEW (First 500 chars) ---\n")
    print(report[:500] + "...")
    print("\n--- END PREVIEW ---")

if __name__ == "__main__":
    asyncio.run(test_audit())
