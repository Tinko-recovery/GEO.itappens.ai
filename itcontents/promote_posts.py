"""
itcontents/promote_posts.py
──────────────────────────
Utility to promote reviewed content from 'ready/' to 'published/'.
Checks for approved posts in a batch and moves them while logging the event.
"""

import os
import json
import shutil
from pathlib import Path
from datetime import datetime

READY_DIR = Path("ready")
PUBLISHED_DIR = Path("published")
LOG_FILE = Path("published_log.json")

def promote_all():
    """Move all JSON files from ready/ to published/ and log the action."""
    if not READY_DIR.exists():
        print("No 'ready/' directory found.")
        return

    PUBLISHED_DIR.mkdir(exist_ok=True)
    
    files = list(READY_DIR.glob("*.json"))
    if not files:
        print("No content ready for promotion.")
        return

    print(f"🚀 Promoting {len(files)} posts to Published...")
    
    log_entries = []
    
    for f in files:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        target_name = f"{timestamp}_{f.name}"
        target_path = PUBLISHED_DIR / target_name
        
        # Log the content we're moving
        try:
            content = json.loads(f.read_text())
            log_entries.append({
                "original_file": f.name,
                "published_as": target_name,
                "timestamp": datetime.now().isoformat(),
                "summary": str(content)[:100] + "..."
            })
            
            # Move the file
            shutil.move(str(f), str(target_path))
            print(f"✅ Promoted: {f.name}")
        except Exception as e:
            print(f"❌ Failed to promote {f.name}: {e}")

    # Update log
    if log_entries:
        existing_log = []
        if LOG_FILE.exists():
            try:
                existing_log = json.loads(LOG_FILE.read_text())
            except:
                pass
        
        existing_log.extend(log_entries)
        LOG_FILE.write_text(json.dumps(existing_log, indent=2))
        print(f"\n📊 Updated published_log.json with {len(log_entries)} new entries.")

if __name__ == "__main__":
    # Change to script directory context
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    promote_all()
