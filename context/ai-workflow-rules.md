# AI Workflow Rules

These are direct instructions to the AI coding agent. Follow them strictly.

## 1. Overall Approach
- You are executing a **Spec-Driven, Incremental** build.
- Do not guess the architecture. Read the context files and execute the current unit spec.

## 2. Scoping Rules
- Work on exactly **one unit** at a time.
- Do not implement features, UI elements, or database fields that are not explicitly stated in the current unit's spec file.
- Do not make speculative changes to "future-proof" the codebase if it violates the current spec.

## 3. When to Split Work
- If a unit spec requires changes to more than 5 files across different boundaries (e.g., DB schema + API + UI), split the execution. Do the DB/Backend first, verify, then do the UI.

## 4. Handling Missing Requirements
- If a spec asks for a UI component but does not specify the design, rely strictly on `ui-context.md`. Do not invent colors or layouts.
- If a spec asks for business logic that is logically impossible or missing critical dependencies (like an auth check), STOP and ask the user for clarification.

## 5. File Protection
- Do NOT arbitrarily modify `globals.css`, `tailwind.config.ts`, or the core `prisma/schema.prisma` unless the current spec explicitly demands it.

## 6. Verification Checklist
Before declaring a unit "complete" and updating the progress tracker:
1. Ensure the code compiles (no glaring syntax or TS errors).
2. Ensure the specific success criteria for that unit are met.
3. Ensure no architectural invariants (from `architecture.md`) were violated.
