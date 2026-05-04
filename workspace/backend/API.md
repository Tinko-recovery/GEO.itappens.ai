# API Documentation: itappens.ai Landing Page Backend

## Overview

This document describes the backend API endpoints for the itappens.ai marketing landing page. The landing page includes a waitlist signup feature that integrates with a Supabase PostgreSQL database.

---

## Endpoints

### `POST /api/waitlist`

Adds an email address to the waitlist.

#### Request

**Method**: `POST`  
**Path**: `/api/waitlist`  
**Content-Type**: `application/json`

**Body**:
```json
{
  "email": "user@example.com"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `email` | string | Yes | Valid email address. Validated server-side. |

#### Response — Success (200 OK)

```json
{
  "success": true,
  "message": "Email added to waitlist"
}
```

**Behavior**:
- Email is normalized (lowercased and trimmed)
- Entry inserted into Supabase `waitlist` table with:
  - `email`: normalized email
  - `created_at`: current UTC timestamp
  - `source`: `'landing_page'` (default)
- If email already exists, upsert silently succeeds (no duplicate error)

#### Response — Error: Invalid Email (400 Bad Request)

```json
{
  "success": false,
  "message": "Please provide a valid email address"
}
```

**Triggered when**:
- `email` field is missing
- `email` is not a valid email format (fails RFC 5322 regex check)
- `email` is not a string

#### Response — Error: Invalid JSON (400 Bad Request)

```json
{
  "success": false,
  "message": "Invalid JSON in request body"
}
```

**Triggered when**:
- Request body is not valid JSON

#### Response — Error: Method Not Allowed (405 Method Not Allowed)

```json
{
  "success": false,
  "message": "Method not allowed"
}
```

**Triggered when**:
- HTTP method is `GET`, `PUT`, `PATCH`, `DELETE`, etc. (only `POST` allowed)

#### Response — Error: Server Error (500 Internal Server Error)

```json
{
  "success": false,
  "message": "Something went wrong. Please try again."
}
```

**Triggered when**:
- Supabase database connection fails
- Unexpected exception occurs during processing
- (Details logged server-side for debugging)

---

## Request Examples

### cURL

**Valid Email**:
```bash
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com"}'
```

**Invalid Email**:
```bash
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"not-an-email"}'
```

**Duplicate Email** (gracefully handled):
```bash
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com"}'

# Returns 200 OK (not an error, even if email already exists)
```

### JavaScript/Fetch

```javascript
async function signupForWaitlist(email) {
  try {
    const response = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if (response.ok) {
      console.log('Success:', data.message)
    } else {
      console.error('Error:', data.message)
    }
  } catch (error) {
    console.error('Network error:', error)
  }
}

// Usage
signupForWaitlist('user@example.com')
```

### Postman

1. **Method**: `POST`
2. **URL**: `http://localhost:3000/api/waitlist` (or production URL)
3. **Headers**:
   - `Content-Type: application/json`
4. **Body** (raw JSON):
   ```json
   {
     "email": "test@example.com"
   }
   ```
5. **Send** and inspect response

---

## Data Flow

```
Client (Browser)
  ↓
POST /api/waitlist { email }
  ↓
Next.js Server (app/api/waitlist/route.ts)
  ├─ Parse JSON body
  ├─ Validate email format (server-side)
  ├─ Normalize: lowercase + trim
  ├─ Build payload { email, created_at, source }
  ↓
Supabase Admin Client (lib/supabase.ts)
  ├─ Service role key authentication
  ├─ UPSERT into 'waitlist' table
  ├─ ON CONFLICT (email) DO NOTHING
  ↓
Supabase PostgreSQL Database
  ├─ Insert or ignore if duplicate
  ├─ Return success
  ↓
Next.js Server
  ├─ Return 200 { success: true, message: "..." }
  ↓
Client (Browser)
  ├─ Show success state (inline message, no redirect)
```

---

## Database Schema

**Table**: `waitlist`

```sql
CREATE TABLE waitlist (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source     TEXT NOT NULL DEFAULT 'landing_page'
);

CREATE UNIQUE INDEX waitlist_email_idx ON waitlist (email);
```

| Column | Type | Constraint | Default | Notes |
|--------|------|-----------|---------|-------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Auto-generated unique ID |
| `email` | TEXT | NOT NULL, UNIQUE | — | Lowercased email address |
| `created_at` | TIMESTAMPTZ | NOT NULL | `now()` | UTC timestamp of signup |
| `source` | TEXT | NOT NULL | `'landing_page'` | Differentiates signup sources |

---

## Security Considerations

1. **Service Role Key**: The API route uses `SUPABASE_SERVICE_KEY` (service role), not the anon key. This is a server-side secret and should never be exposed to the client.

2. **Email Validation**: Email is validated both client-side (for UX) and server-side (for security). Server-side validation is authoritative.

3. **No Secrets in Response**: The API never returns sensitive data or internal error details in responses. Detailed errors are logged server-side only.

4. **CORS**: By default, Next.js API routes allow same-origin requests. Cross-origin requests from the same Vercel deployment are allowed. If needed, CORS can be configured in the route handler.

5. **Rate Limiting**: Currently not implemented. Consider adding rate limiting middleware (e.g., Vercel Edge Middleware or Upstash) to prevent abuse in production.

---

## Testing Checklist

- [ ] POST with valid email → 200 OK, data in Supabase
- [ ] POST with invalid email → 400 Bad Request
- [ ] POST with duplicate email → 200 OK (upserted gracefully)
- [ ] POST with missing email field → 400 Bad Request
- [ ] POST with non-JSON body → 400 Bad Request
- [ ] GET /api/waitlist → 405 Method Not Allowed
- [ ] PUT /api/waitlist → 405 Method Not Allowed
- [ ] DELETE /api/waitlist → 405 Method Not Allowed
- [ ] Network error handling in client → graceful error message
- [ ] Verify timestamps in Supabase (UTC, correct format)
- [ ] Verify source field is always 'landing_page'

---

## Deployment Notes

**Environment Variables** (set in Vercel project settings):
- `SUPABASE_URL`: Supabase project URL (e.g., `https://xyz.supabase.co`)
- `SUPABASE_SERVICE_KEY`: Service role key (keep secret, never commit to repo)

**Logs**: Server-side errors are logged to console. In production, consider integrating with Sentry or similar error tracking.

**Monitoring**: Monitor Supabase dashboard for:
- Number of waitlist entries
- Duplicate email attempts
- Failed inserts (database errors)

---

## Future Enhancements

1. **Email Verification**: Send confirmation email via Resend or SendGrid; add `verified` boolean to schema
2. **Rate Limiting**: Add IP-based rate limiting to `/api/waitlist`
3. **Analytics**: Track signup source, timestamp, conversion funnel
4. **Webhook Integration**: Send new signups to external service (e.g., Slack notification)
5. **Admin Dashboard**: View and manage waitlist entries, export as CSV

---

**Last Updated**: Sprint 1  
**Maintainer**: eng_2 (Backend)
