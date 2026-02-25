"""
quality/output_standards.py
────────────────────────────
Scoring rubrics and quality standards for the Quality Gate Agent.
Defines what 1-10 means for code and content outputs.
"""

# ── Code quality rubric ──────────────────────────────────────────────────────

CODE_RUBRIC = {
    "runs_without_errors": {
        "points": 3,
        "description": "The code executes without syntax or runtime errors.",
        "how_to_check": "Run the code; check for import errors, syntax errors, and obvious bugs.",
    },
    "completeness": {
        "points": 3,
        "description": "The code is a complete implementation, not a skeleton or placeholder.",
        "how_to_check": "Check for TODO comments, NotImplemented, bare stubs, or incomplete logic.",
    },
    "stack_consistency": {
        "points": 2,
        "description": "The code uses the customer's declared tech stack — not random alternatives.",
        "how_to_check": "Compare imports and frameworks to the customer's tech_stack in their brain.",
    },
    "best_practices": {
        "points": 2,
        "description": "Code follows basic best practices: meaningful names, error handling, no hardcoded secrets.",
        "how_to_check": "Check for env vars for secrets, try/except blocks, and readable variable names.",
    },
}

# ── Content quality rubric ───────────────────────────────────────────────────

CONTENT_RUBRIC = {
    "on_brand": {
        "points": 3,
        "description": "The content matches the customer's brand voice (tone, style, vocabulary).",
        "how_to_check": "Compare tone to brand_voice in customer brain. Check for jargon mismatches.",
    },
    "specificity": {
        "points": 3,
        "description": "Content is specific to the customer's product/audience — not generic AI filler.",
        "how_to_check": "Look for vague phrases like 'a wide range of', 'leverage synergies', etc.",
    },
    "human_pride": {
        "points": 2,
        "description": "A human professional would be proud to publish this as-is.",
        "how_to_check": "Read it once: does it embarrass or impress? Would you put your name on it?",
    },
    "format_and_length": {
        "points": 2,
        "description": "The output is the right length and format for its intended use.",
        "how_to_check": "Blog post = 800-1500 words. Tweet = ≤280 chars. Email = concise. Code = functional.",
    },
}

# ── Score thresholds ─────────────────────────────────────────────────────────

THRESHOLDS = {
    "deliver_immediately": (8, 10),   # Score 8-10 → deliver
    "deliver_with_warning": (5, 7),   # Score 5-7 → deliver with note
    "redo": (1, 4),                   # Score 1-4 → automatic redo
    "max_redos": 2,                   # After 2 failed redos → escalate to CEO
    "escalate_below": 5,              # Escalate if still below 5 after max redos
}

# ── Redo instruction templates ────────────────────────────────────────────────

REDO_PROMPTS = {
    "code": (
        "The previous code output scored {score}/10. Issues: {issues}.\n\n"
        "Please redo the task with these STRICT requirements:\n"
        "1. Ensure all code is COMPLETE — no placeholders or TODOs\n"
        "2. Test that imports and syntax are valid\n"
        "3. Use ONLY the customer's declared tech stack: {tech_stack}\n"
        "4. Add proper error handling with try/except blocks\n"
        "5. Do not hardcode any secrets — use os.getenv()\n\n"
        "Original task: {original_task}"
    ),
    "content": (
        "The previous content output scored {score}/10. Issues: {issues}.\n\n"
        "Please redo the task with these STRICT requirements:\n"
        "1. Brand voice must be: {brand_voice}\n"
        "2. Be SPECIFIC to {company_name} and their product — no generic filler\n"
        "3. Remove all vague phrases ('leverage', 'synergies', 'wide range')\n"
        "4. Ensure proper length/format for: {output_type}\n"
        "5. A professional human should be proud to publish this\n\n"
        "Original task: {original_task}"
    ),
}

# ── Delivery note template ────────────────────────────────────────────────────

REVIEW_RECOMMENDED_NOTE = (
    "⚠️ *Quality Gate Note* — This output scored {score}/10.\n"
    "Issues identified: {issues}\n\n"
    "Recommended: Review before deploying to production. "
    "The AI team will address these in the next iteration."
)
