# Invoice Tracker MVP - Sprint Task List (eng_1)

## Setup & Infrastructure

1. **Initialize Next.js 14 project with App Router** — Backend/Frontend
   - Create new Next.js 14 app with `create-next-app`
   - Configure `jsconfig` or `tsconfig` for path aliases
   - Install dependencies: `next`, `react`, `react-dom`

2. **Set up PostgreSQL database (Vercel Postgres or Supabase)** — Backend
   - Create Postgres instance on Vercel or Supabase
   - Obtain DATABASE_URL connection string
   - Store securely in `.env.local` (development) and Vercel env vars (production)

3. **Install and configure Prisma ORM** — Backend
   - Install `@prisma/client` and `prisma` (dev)
   - Initialize Prisma: `npx prisma init`
   - Set up `.env` with DATABASE_URL

4. **Install authentication & security dependencies** — Backend
   - Install `next-auth@5`, `bcryptjs`, `@next-auth/prisma-adapter`
   - Install `jose` for JWT handling (if using custom JWT setup with NextAuth.js)

---

## Database Schema & Migrations

5. **Create Prisma schema with User and Invoice models** — Backend
   - Define `User` model: `id`, `email` (unique), `password` (hashed), `name`, `createdAt`, `updatedAt`
   - Define `Invoice` model: `id`, `userId` (FK), `clientName`, `clientEmail`, `invoiceNumber` (unique), `lineItems` (JSON), `subtotal`, `tax`, `total`, `status` (ENUM), `dueDate`, `deletedAt` (soft delete), `createdAt`, `updatedAt`
   - Add index on `userId` and `invoiceNumber` for query performance
   - Add unique constraint: (userId, invoiceNumber)

6. **Run initial Prisma migration** — Backend
   - Execute `npx prisma migrate dev --name init`
   - Verify schema in database
   - Generate Prisma client

---

## Authentication System

7. **Configure NextAuth.js with Credentials provider** — Backend
   - Create `auth.ts` configuration file
   - Implement Credentials provider with email/password validation
   - Set up Prisma adapter for session persistence
   - Configure JWT session strategy with expiration
   - Set `NEXTAUTH_SECRET` and `NEXTAUTH_URL` env vars

8. **Implement `/api/auth/signup` route** — Backend
   - Accept POST with `email`, `password`, `name`
   - Validate email format and password strength (min 8 chars, at least 1 uppercase, 1 number)
   - Hash password with bcryptjs
   - Create user in database
   - Return 201 with user ID and email on success
   - Return 400 if email already exists
   - Return 400 if validation fails

9. **Implement `/api/auth/login` route (via NextAuth.js)** — Backend
   - NextAuth handles POST to `/api/auth/callback/credentials`
   - Validate email exists and password matches (bcryptjs compare)
   - Return user object on success
   - Return null on invalid credentials

10. **Create session validation middleware** — Backend
    - Build helper function to extract and validate JWT session
    - Check token expiration and signature
    - Return user ID if valid, throw 401 if invalid
    - Export for use in all protected API routes

11. **Implement `/api/auth/logout` route** — Backend
    - Clear NextAuth session/cookies
    - Return 200 on success

---

## Invoice CRUD API

12. **Implement `GET /api/invoices` (list endpoint)** — Backend
    - Validate session (401 if missing)
    - Accept query params: `status` (optional, filter by draft|sent|paid|overdue), `limit` (default 20), `offset` (default 0)
    - Fetch invoices where `userId === currentUser.id` and `deletedAt IS NULL`
    - Apply status filter if provided
    - Order by `createdAt DESC`
    - Return JSON array with pagination metadata

13. **Implement `POST /api/invoices` (create endpoint)** — Backend
    - Validate session (401 if missing)
    - Accept JSON: `clientName`, `clientEmail`, `lineItems` (array), `dueDate`
    - Validate required fields present
    - Validate lineItems array: each has `description`, `qty` (positive number), `unitPrice` (positive number)
    - Validate dueDate is ISO-8601 and >= today
    - Calculate subtotal = sum(qty × unitPrice for each lineItem)
    - Apply 10% tax (configurable): `tax = subtotal * 0.1`
    - Calculate total = subtotal + tax
    - Auto-generate `invoiceNumber` = `{userId}-{nextSequence}` (e.g., user-123-0001)
    - Set status = 'draft', createdAt = now, updatedAt = now
    - Insert into database
    - Return 201 with created invoice object

14. **Implement `PUT /api/invoices/:id` (update endpoint)** — Backend
    - Validate session (401 if missing)
    - Verify invoice exists and userId matches (403 if not owner)
    - Accept JSON: `clientName`, `clientEmail`, `lineItems`, `dueDate`, `status` (optional)
    - Re-validate all fields same as POST
    - Only allow status transitions: draft→sent, sent→paid, sent→overdue (reject invalid transitions with 400)
    - Recalculate subtotal, tax, total
    - Update updatedAt = now
    - Save to database
    - Return 200 with updated invoice

15. **Implement `DELETE /api/invoices/:id` (soft delete endpoint)** — Backend
    - Validate session (401 if missing)
    - Verify invoice exists and userId matches (403 if not owner)
    - Set deletedAt = now
    - Update updatedAt = now
    - Save to database (do NOT remove record)
    - Return 204 No Content

---

## Scheduled Status Updates

16. **Implement automatic 'sent' → 'overdue' status checker** — Backend
    - Create `/api/cron/update-overdue` endpoint (Vercel Cron-compatible)
    - Require `Authorization: Bearer {CRON_SECRET}` header (env var protected)
    - Query invoices: `status = 'sent'` AND `dueDate < today` AND `deletedAt IS NULL`
    - Update status to 'overdue' and updatedAt for each matching invoice
    - Return 200 with count of updated invoices
    - Set up Vercel Cron Job (`vercel.json` config) to call endpoint daily at 00:00 UTC
    - Alternatively: add lightweight check in middleware to trigger on first request after dueDate passes (optional fallback)

---

## Dashboard Frontend

17. **Create `/dashboard` layout and page** — Frontend
    - Build server component at `app/dashboard/page.tsx`
    - Fetch current user session on server
    - Redirect to `/login` if not authenticated
    - Fetch invoices from `/api/invoices` on server

18. **Implement dashboard summary cards** — Frontend
    - Display **Total Outstanding**: sum of `total` for all invoices with status in [sent, overdue] where `deletedAt IS NULL`
    - Display **Total Paid**: sum of `total` for all invoices with status = 'paid' where `deletedAt IS NULL`
    - Use responsive grid (Tailwind or similar)
    - Show formatted currency (USD with 2 decimals)

19. **Build invoice data table component** — Frontend
    - Create table rows: invoiceNumber, clientName, dueDate, total, status
    - Status column: show badge with color (draft=gray, sent=blue, paid=green, overdue=red)
    - Add quick-action buttons per row:
      - "Mark Sent" button → if status=draft, calls PUT to change to sent
      - "Mark Paid" button → if status=sent|overdue, calls PUT to change to paid
      - "Delete" button → calls DELETE endpoint, removes row on success
    - Handle button clicks with optimistic UI updates
    - Show loading state during API calls

20. **Add invoice list filters & pagination** — Frontend
    - Add filter dropdown for status (All, Draft, Sent, Paid, Overdue)
    - Add pagination controls: Previous/Next (or page numbers)
    - Re-fetch from `/api/invoices?status=X&offset=Y` on filter/pagination change
    - Show "No invoices" message when list is empty

21. **Build authentication pages (sign up & login forms)** — Frontend
    - Create `/signup` page with form: email, password (with strength indicator), name
    - Create `/login` page with form: email, password
    - On submit: POST to `/api/auth/signup` or trigger NextAuth signIn
    - On success: redirect to `/dashboard`
    - On error: display error message (e.g., "Email already exists", "Invalid password")
    - Add loading state during submission

22. **Implement navigation header with logout** — Frontend
    - Add persistent header/nav on all dashboard pages
    - Display current user name/email
    - Add "Logout" button → calls `/api/auth/logout`, redirects to `/login`
    - Add "New Invoice" button → navigate to `/invoices/create` (future feature, or simple link)

---

## Invoice Create/Edit Pages

23. **Build `/invoices/create` page with form** — Frontend
    - Form fields: clientName, clientEmail, lineItems (dynamic array), dueDate
    - Allow adding/removing line items dynamically
    - Each line item: description, qty (number), unitPrice (number)
    - Show real-time calculation: subtotal, tax (10%), total
    - Submit button → POST to `/api/invoices`
    - On success: redirect to `/dashboard` with toast notification
    - On error: display validation messages

24. **Build `/invoices/:id/edit` page** — Frontend
    - Fetch invoice data from `/api/invoices/:id` (new GET endpoint for single invoice, or load from context)
    - Pre-fill form with existing invoice data
    - Disable invoiceNumber and clientEmail (read-only)
    - Submit button → PUT to `/api/invoices/:id`
    - On success: redirect to `/dashboard`

---

## Single Invoice GET Endpoint

25. **Implement `GET /api/invoices/:id` (fetch single invoice)** — Backend
    - Validate session (401 if missing)
    - Verify invoice exists and userId matches (403 if not owner)
    - Return 404 if not found or deleted (deletedAt IS NOT NULL)
    - Return 200 with full invoice object

---

## UI Components & Styling

26. **Set up Tailwind CSS and component library** — Frontend
    - Configure Tailwind in `globals.css`
    - Create reusable button, input, card, badge components
    - Define color palette (draft=gray, sent=blue, paid=green, overdue=red)
    - Ensure responsive design (mobile-first)

27. **Add form validation & error display** — Frontend
    - Client-side validation for email format, password strength, required fields
    - Display field-level error messages
    - Show API error messages from backend

28. **Add loading states and skeleton screens** — Frontend
    - Show spinners during form submission
    - Show skeleton loaders while fetching invoice list
    - Add toast notifications for success/error feedback

---

## Testing & Quality

29. **Write API route tests (unit/integration)** — Backend
    - Test signup: valid input, duplicate email, invalid password, validation errors
    - Test login: valid credentials, invalid email, wrong password
    - Test POST /api/invoices: valid input, missing fields, invalid status, unauthorized access
    - Test PUT /api/invoices/:id: valid update, invalid status transition, forbidden access, not found
    - Test DELETE /api/invoices/:id: soft delete succeeds, forbidden access
    - Test GET /api/invoices: filtering by status, pagination, unauthorized
    - Use Jest + Supertest or similar

30. **Write database migration tests** — Backend
    - Verify schema is created correctly
    - Verify constraints (unique, FK, NOT NULL)
    - Test seed data (optional)

---

## Deployment & Environment

31. **Set up Vercel deployment configuration** — Backend/Frontend
    - Create `vercel.json` with build settings and environment variable requirements
    - Document required env vars: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `CRON_SECRET`
    - Ensure no hardcoded secrets in code
    - Test build process locally: `npm run build`

32. **Configure environment variables for production** — Backend
    - Generate `NEXTAUTH_SECRET` with `openssl rand -base64 32`
    - Set `DATABASE_URL` to Vercel Postgres or Supabase connection string
    - Set `NEXTAUTH_URL` to production domain (e.g., `https://invoice-tracker.vercel.app`)
    - Set `CRON_SECRET` for cron job authentication
    - Add all vars to Vercel dashboard > Settings > Environment Variables

33. **Deploy to Vercel** — Backend/Frontend
    - Connect Git repository to Vercel
    - Trigger production build
    - Run database migrations on production: `npx prisma migrate deploy`
    - Test signup, login, invoice CRUD on live URL
    - Provide final production URL to team

34. **Create deployment README** — Backend/Frontend
    - Document: how to set up env vars, how to run locally, how to deploy
    - Include curl examples for API testing
    - Document Prisma migration process for future schema changes

---

## Handoff Notes

35. **Prepare eng_2 integration guide** — Backend/Frontend
    - Document exact signup/login route paths: `/signup`, `/login`
    - Provide JWT token format and validation method (if needed by eng_2)
    - Provide API base URL for any cross-team API calls
    - **IMPORTANT**: Confirm eng_2 landing page CTA links to `{APP_URL}/signup` only — NO duplicate auth in eng_2

---

**Total Tasks: 35**
**Owner Breakdown:**
- **Backend-only**: Tasks 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 25, 29, 30, 31, 32
- **Frontend-only**: Tasks 17, 18, 19, 20, 21, 22, 23, 24, 26, 27, 28
- **Both**: Tasks 1, 4, 31, 32, 33, 34, 35
