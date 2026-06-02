# Unit 01: The Public Marketing Landing Page

## Goal
Create a high-converting, dark-mode, glassmorphic marketing landing page at `app/aeo/page.tsx` (or similar public route, we will use `app/itappens-aeo/page.tsx` as a public marketing page, or just hijack the root if requested, but let's put it at `/itappens-aeo` to not disrupt the main `itappens.ai` flow unless this is a dedicated repo. Since this repo is `itappens-geo`, we will replace the root `app/page.tsx` with this marketing page).

Wait, the root `app/page.tsx` currently has the main itappens GEO marketing page. We should build this at `app/aeo/page.tsx` to serve as the dedicated product page for "itappens AEO".

*Correction:* We will build this at `app/aeo/page.tsx`.

## Design
- **Theme:** Dark mode, slate backgrounds (`bg-slate-950`).
- **Accents:** Indigo and violet (`text-indigo-400`, `bg-indigo-600`).
- **Glassmorphism:** Navigation and feature cards should use `backdrop-blur-md bg-slate-900/40 border border-slate-800`.
- **Typography:** Tight tracking on headers (`tracking-tight font-extrabold`), relaxed body (`leading-relaxed text-slate-400`).

## Implementation

### 1. Public Layout
- Create `app/aeo/layout.tsx` if a specific public layout is needed, or just use the root layout if it fits. We will just build the page inside `app/aeo/page.tsx`.

### 2. Hero Section
- Bold H1: "itappens AEO: The Answer Engine Optimization Auto-Blogger."
- Subtitle: "Fully automated, deeply researched content pipelines that publish directly to your WordPress. Designed for Agencies and E-Commerce."
- CTA Button: "Start Free Trial" (links to `/dashboard` or Auth0 login).
- Trust Badge: "Powered by Claude 3.5 Haiku + Unsplash".

### 3. Features Grid
- 3-column grid mapping to our core features:
  - Smart Keyword Planner
  - AI Content Generation
  - Unsplash Image Integration
  - WordPress Auto-Publishing
  - Drip-Feed Scheduler
  - E-Commerce Product Injection

### 4. Pricing Section
- Mimic the 3-tier pricing strategy (Starter, Growth, Agency).
- Highlight extreme cost-effectiveness.

### 5. Social Proof / "Trusted By"
- Add a section mimicking the "Real Results" section from Blogauto.ai, adapted for "NewKRINN's Verdict" and generic Agency clients.

## Dependencies
- `lucide-react` (for icons, assuming it is installed, otherwise install it).

## Verify when done
- [ ] Page renders without errors at `/aeo`.
- [ ] Dark mode aesthetic matches `ui-context.md`.
- [ ] Responsive on mobile (stacking grids).
- [ ] Links to the Auth0 login correctly.
