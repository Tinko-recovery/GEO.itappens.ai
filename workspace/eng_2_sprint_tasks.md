# eng_2 Sprint Tasks: Public Marketing Landing Page

## Project Overview
Build and deploy a public marketing landing page (Next.js 14) at the root domain (itappens.ai) with a waitlist signup form. The page drives traffic to eng_1's /signup endpoint. Coordinate with eng_1 on Supabase database schema to avoid duplication.

---

## Sprint Tasks

### 1. **Coordinate Supabase Database Setup with eng_1**
   - **Owner**: Backend
   - **Description**: Confirm whether eng_1 is using Vercel Postgres or Supabase. If Supabase, verify the shared instance details. Confirm the 'waitlist' table schema exists or create it: `waitlist { id (uuid), email (unique), createdAt, source (default: 'landing_page') }`. Obtain SUPABASE_URL and SUPABASE_SERVICE_KEY.
   - **Acceptance Criteria**:
     - Supabase instance confirmed (shared or dedicated)
     - 'waitlist' table created with schema above
     - Email field has UNIQUE constraint
     - Environment variables documented and ready for Vercel deployment

### 2. **Set Up Next.js 14 Project with Tailwind CSS**
   - **Owner**: Frontend
   - **Description**: Initialize a new Next.js 14 project with Tailwind CSS. Configure for static export or edge rendering (test both if needed). Set up folder structure: `/app`, `/components`, `/api/routes`, `/public`. Install dependencies: `next`, `tailwindcss`, `@supabase/supabase-js`.
   - **Acceptance Criteria**:
     - Next.js 14 project initialized and builds without errors
     - Tailwind CSS configured and working
     - Project runs locally on http://localhost:3000
     - Folder structure organized and documented

### 3. **Build Hero Section (Headline, Subheadline, CTA)**
   - **Owner**: Frontend
   - **Description**: Create the hero component with:
     - Bold headline (max 10 words, value prop-focused) — e.g., "Never Lose Track of Your Invoices"
     - Single-sentence subheadline — e.g., "Know exactly who owes you and get paid faster."
     - Primary CTA button linking to `{eng_1_production_domain}/signup` (hard link, no client-side routing)
     - Responsive design (mobile-first)
   - **Acceptance Criteria**:
     - Hero section visually prominent and mobile-responsive
     - Headline and subheadline copy approved by product/brand
     - CTA button links to eng_1's /signup (confirm URL with eng_1)
     - Component exported and tested in isolation

### 4. **Build Three Core Benefits Section**
   - **Owner**: Frontend
   - **Description**: Create three benefit cards, each with:
     - Icon (use a free icon library: Heroicons, Lucide Icons, or simple SVG)
     - Title (e.g., "Never Lose Track of an Invoice")
     - One-sentence description
     - Responsive grid layout (3 columns on desktop, 1 on mobile)
   - **Acceptance Criteria**:
     - All three benefit cards render correctly
     - Icons are consistent in style and size
     - Copy is clear and benefit-focused
     - Grid is responsive across breakpoints (mobile, tablet, desktop)

### 5. **Integrate Product Visual (Screenshot or GIF)**
   - **Owner**: Frontend + Backend (coordination)
   - **Description**: 
     - Coordinate with eng_1 to obtain a screenshot or muted looping GIF/video of the dashboard from their deployed app (or Figma mockup)
     - Add the visual to the landing page using `next/image` for optimization
     - Lazy-load if possible; ensure it doesn't block hero render
     - Host asset in `/public` folder or CDN (clarify with eng_1)
   - **Acceptance Criteria**:
     - Visual asset obtained and permissions confirmed
     - Image optimized via `next/image` component
     - Visual loads without breaking layout
     - Mobile responsive (scales or stacks appropriately)

### 6. **Build Pricing Section**
   - **Owner**: Frontend
   - **Description**: Create a simple pricing section for MVP:
     - Single tier: "Free during beta" with brief description OR
     - Two-tier layout: Free (e.g., "Up to 50 invoices/month") + Pro ("Custom pricing, contact us")
     - Keep messaging honest and simple (no dark patterns)
     - CTA button in each tier links to eng_1's /signup
   - **Acceptance Criteria**:
     - Pricing cards display correctly
     - Copy is clear and non-misleading
     - CTA buttons link to eng_1's /signup
     - Section responsive and visually balanced

### 7. **Build Waitlist Signup Form Component**
   - **Owner**: Frontend
   - **Description**: Create a form component with:
     - Email input field with placeholder ("your@email.com")
     - Submit button ("Join Waitlist" or "Sign Up Free")
     - Client-side email validation (regex or HTML5 validation)
     - Error message display (e.g., "Please enter a valid email")
     - Loading state on button during submission
     - Success state display (e.g., "Thank you! Check your email." or similar inline message)
     - No page redirect on success (keep user on landing page)
   - **Acceptance Criteria**:
     - Form validates email format client-side before submit
     - Submit button shows loading state
     - Success message displays inline after submission
     - Form resets or hides after success
     - Mobile keyboard friendly (email input type)

### 8. **Create Next.js API Route: POST /api/waitlist**
   - **Owner**: Backend
   - **Description**: Build the server-side endpoint to:
     - Accept POST request with `{ email }`
     - Validate email format server-side (do not trust client)
     - Prepare payload: `{ email, createdAt: new Date(), source: 'landing_page' }`
     - Upsert into Supabase 'waitlist' table (handle duplicate email gracefully; use UPSERT or ON CONFLICT clause)
     - Return HTTP 200 + JSON `{ success: true, message: "Email added to waitlist" }`
     - Return HTTP 400 + error message for invalid email or database errors
     - Use environment variables `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` (service role key, not anon key)
   - **Acceptance Criteria**:
     - Endpoint accepts and validates email
     - Valid emails inserted into Supabase 'waitlist' table
     - Duplicate emails handled (upsert or 409 response)
     - Invalid emails rejected with 400 + clear error message
     - Endpoint tested with curl/Postman before integration
     - No client-side secrets exposed; service role key used only server-side

### 9. **Integrate Waitlist Form with API Endpoint**
   - **Owner**: Frontend
   - **Description**: Connect the form component to the `/api/waitlist` endpoint:
     - Form POSTs email to `/api/waitlist` on submit
     - Handle 200 response: show success message
     - Handle 400 response: display server error message in form
     - Handle network errors: show generic error message
     - Prevent duplicate submissions (disable button after first submit)
   - **Acceptance Criteria**:
     - Form submission sends POST request to `/api/waitlist`
     - Success response triggers success state in form
     - Error responses display user-friendly error message
     - No duplicate submissions possible
     - Network errors handled gracefully

### 10. **Create Landing Page Layout (Sections Combined)**
   - **Owner**: Frontend
   - **Description**: Assemble all sections into a single-page layout:
     - Hero → Benefits → Product Visual → Pricing → Waitlist Form (footer or inline)
     - Responsive navigation/header (optional: logo + CTA link to eng_1 /signup)
     - Footer with links (privacy, terms, contact, social) if needed
     - Smooth scrolling and visual hierarchy
     - Accessibility: semantic HTML, alt text on images, proper heading hierarchy (h1, h2, h3)
   - **Acceptance Criteria**:
     - All sections present and in correct order
     - Page is mobile-responsive (test on 375px, 768px, 1024px viewports)
     - Accessibility check: Lighthouse score ≥ 90 (performance, accessibility)
     - No console errors or warnings
     - Page loads in < 3 seconds (Core Web Vitals target)

### 11. **Set Up Environment Variables for Vercel**
   - **Owner**: Backend + Frontend
   - **Description**: Document and configure environment variables for Vercel deployment:
     - `SUPABASE_URL`: Supabase instance URL
     - `SUPABASE_SERVICE_KEY`: Supabase service role key (never expose to client)
     - `NEXT_PUBLIC_*`: None required for this phase (no client-side Supabase calls)
     - Create `.env.local` for local development (not committed to repo)
     - Document all vars in `README.md` or `.env.example`
   - **Acceptance Criteria**:
     - All environment variables documented
     - `.env.local` created and gitignored
     - `.env.example` provided (with placeholder values)
     - Vercel environment variables configured in project settings
     - Local development works with env vars

### 12. **Deploy to Vercel at Root Domain**
   - **Owner**: Backend + Frontend
   - **Description**: 
     - Connect GitHub repo to Vercel
     - Configure custom domain (e.g., itappens.ai) to point to root
     - Verify env vars are set in Vercel project settings
     - Configure build settings: `next build` and `next export` if using static export, or default for edge rendering
     - Test deployment: ensure landing page loads, form submits to API, waitlist entries appear in Supabase
   - **Acceptance Criteria**:
     - Landing page live at custom domain (itappens.ai)
     - All sections render correctly in production
     - Waitlist form submits successfully and data appears in Supabase
     - No console errors in production
     - API endpoint (/api/waitlist) responds correctly
     - Coordinate with eng_1 to ensure `/app` subroute is accessible (eng_1's domain config)

### 13. **Test Waitlist Form End-to-End**
   - **Owner**: Frontend + Backend
   - **Description**: Full functional testing of waitlist submission:
     - Submit valid email → success message appears
     - Submit duplicate email → graceful handling (success or informational message)
     - Submit invalid email → error message displays
     - Submit empty field → validation error
     - Test on multiple browsers (Chrome, Firefox, Safari)
     - Test on mobile and desktop
     - Verify data in Supabase admin panel: emails, createdAt, source fields populated
   - **Acceptance Criteria**:
     - All test cases pass
     - No console errors
     - Data integrity confirmed in Supabase
     - User experience is smooth across devices

### 14. **Verify Coordination with eng_1 (/signup Endpoint)**
   - **Owner**: Frontend + Backend
   - **Description**: 
     - Confirm eng_1's /signup endpoint URL and deployment status
     - Test CTA button click → redirects to eng_1's /signup (no errors)
     - Confirm no auth logic is built into landing page
     - Verify landing page and app subdomain/subroute configuration with eng_1
   - **Acceptance Criteria**:
     - eng_1's /signup endpoint is live and accessible
     - CTA buttons on landing page correctly link to /signup
     - No authentication or session logic on landing page
     - Confirm eng_1 does not expect landing page to provide auth tokens or user context

### 15. **Documentation and Handoff**
   - **Owner**: Backend + Frontend
   - **Description**: Create or update documentation:
     - `README.md`: Project overview, setup instructions, deployment steps
     - `DEPLOYMENT.md`: Vercel configuration, env vars, domain setup
     - `API.md`: `/api/waitlist` endpoint documentation (request/response examples)
     - `ARCHITECTURE.md`: Tech stack, folder structure, component overview
     - Code comments: highlight critical sections (Supabase integration, service role key)
     - Handoff notes for future iterations (e.g., SEO, analytics, A/B testing)
   - **Acceptance Criteria**:
     - All documentation is clear and up-to-date
     - New team member can deploy and run the project from README
     - API endpoint behavior is documented with examples
     - Environment setup is explicit
     - Future improvements noted (SEO, email verification, analytics)

---

## Deployment Checklist (Before Launch)
- [ ] Supabase 'waitlist' table created and tested
- [ ] SUPABASE_URL and SUPABASE_SERVICE_KEY configured in Vercel
- [ ] Landing page builds and renders without errors
- [ ] `/api/waitlist` endpoint tested locally and in production
- [ ] Waitlist form submits and data persists in Supabase
- [ ] CTA buttons link correctly to eng_1's /signup
- [ ] Mobile responsiveness verified (375px, 768px, 1024px)
- [ ] Lighthouse score ≥ 90 (performance, accessibility, SEO)
- [ ] No console errors in production
- [ ] DNS/custom domain configured and live
- [ ] eng_1 confirms /signup endpoint is accessible from landing page CTA

---

## Notes
- **Avoid**: Building any authentication logic. The landing page is a marketing funnel, not an auth surface.
- **Coordinate with eng_1**: On Supabase instance, /signup URL, and app subdomain/subroute config.
- **Service Role Key**: Use SUPABASE_SERVICE_KEY (not anon key) for API route. Never expose to client.
- **Form Success**: Keep user on landing page after signup; no redirect needed.
- **Monitoring**: Consider adding simple logging or error tracking (Sentry, LogRocket) for production issues.
