# Code Standards

## Framework Conventions
- **Next.js App Router:** All routing uses the `app/` directory. Page components are default exports in `page.tsx`.
- **Server vs Client Components:** 
  - Default to Server Components (`page.tsx`, `layout.tsx`).
  - Add `"use client"` ONLY to the specific leaf components that require interactivity (hooks, state, event listeners).
- **API Routes:** Use the new Route Handlers (`app/api/.../route.ts`). Return standard `NextResponse`.

## TypeScript & Code Quality
- Strict TypeScript is mandatory. Avoid `any`. Define interfaces/types for all API requests/responses.
- Export types in a `types/` folder if they are shared across multiple boundaries, or inline them in the file if specific to one component.

## File Organization
- `app/api/[feature]/route.ts`: Backend endpoints.
- `components/[domain]/[ComponentName].tsx`: Reusable UI.
- `lib/[service].ts`: Pure business logic (e.g., `lib/ai.ts`, `lib/wordpress.ts`).

## Styling Rules
- Use Tailwind CSS utility classes.
- Do not write custom CSS in `globals.css` unless defining root variables or critical animations that Tailwind cannot handle.
- Combine classes using `clsx` and `tailwind-merge` (e.g., via a `cn()` utility) when merging conditional styles.
