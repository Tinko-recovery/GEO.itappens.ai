"""
smoke_test_bypass.py
────────────────────
Verifies that the Partner Bypass logic correctly unlocks 'Scale' tier features.
Uses Playwright to simulate entering the code and verifying UI transitions.
"""

import asyncio
from playwright.async_api import async_playwright

async def test_bypass():
    async with async_playwright() as p:
        # 1. Start browser
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        # 2. Navigate to dashboard (Assumed local dev server)
        url = "http://localhost:5173" # Update as per your local Vite port
        try:
            await page.goto(url)
            print(f"Navigated to {url}")
        except Exception as e:
            print(f"Could not connect to {url}. Is the frontend running? {e}")
            await browser.close()
            return

        # 3. Enter the Partner Code
        selector = "input[type='password']"
        await page.wait_for_selector(selector)
        await page.fill(selector, "prelaunch_testing")
        print("Bypass code entered.")

        # 4. Verify Immediate Feedback (Alert)
        # Handle the dialog
        page.on("dialog", lambda dialog: dialog.accept())
        
        # 5. Verify UI Changes
        # Check if the Knowledge Vault tab is clicked and doesn't show the Lock
        # We look for the "vault" button
        await page.click("button:has-text('Knowledge Vault')")
        print("Switched to Knowledge Vault tab.")

        # Check for the lock icon/overlay
        lock_exists = await page.is_visible("text=Scale Plan Required")
        if not lock_exists:
            print("✅ SUCCESS: Partner Bypass unlocked Scale features.")
        else:
            print("❌ FAILURE: Knowledge Vault is still locked.")

        # 6. Verify Persistence after refresh
        await page.reload()
        print("Page refreshed. Checking persistence...")
        await page.click("button:has-text('Knowledge Vault')")
        lock_exists = await page.is_visible("text=Scale Plan Required")
        if not lock_exists:
            print("✅ SUCCESS: Bypass state persisted in localStorage.")
        else:
            print("❌ FAILURE: Bypass state lost after refresh.")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(test_bypass())
