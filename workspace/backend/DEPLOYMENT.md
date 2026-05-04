# Deployment Guide: itappens.ai Landing Page

This guide covers deploying the itappens.ai marketing landing page to Vercel at the root domain.

---

## Prerequisites

1. **GitHub Repository**: Repo created and pushed to GitHub
2. **Vercel Account**: Free or paid (free tier sufficient for MVP)
3. **Supabase Instance**: URL and service role key obtained from eng_1 or DevOps
4. **Custom Domain**: DNS records pointing to Vercel (e.g., itappens.ai)
5. **Next.js Project**: Already initialized with dependencies installed locally

---

## Step 1: Environment Variables Setup

### Local Development (`.env.local`)

1. Create `.env.local` in the project root:

```bash
touch .env.local
```

2. Add environment variables:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
```

3. Verify `.env.local` is in `.gitignore` (should be by default):

```bash
cat .gitignore | grep ".env.local"
```

### Production (Vercel)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to **Settings → Environment Variables**
4. Add the following variables:

| Key | Value | Development | Preview | Production |
|-----|-------|-------------|---------|------------|
| `SUPABASE_URL` | `https://your-project.supabase.co` | ✓ | ✓ | ✓ |
| `SUPABASE_SERVICE_KEY` | `service-role-key-value` | — | ✓ | ✓ |

> **Note**: Check boxes for Preview and Production only (not Development, which uses `.env.local`).

5. Click **Save**

---

## Step 2: Connect GitHub to Vercel

### Option A: New Project (First Time)

1. Go to [Vercel](https://vercel.com)
2. Click **New Project**
3. Select **Import Git Repository**
4. Authorize GitHub and select your repo
5. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `next build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (or `yarn install`)
6. Click **Deploy**

### Option B: Existing Vercel Project

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Git**
3. Connect or reconnect your GitHub repository
4. Ensure branch is set to `main` (or your default branch)

---

## Step 3: Configure Custom Domain

### Add Domain to Vercel

1. In Vercel project settings, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `itappens.ai`)
4. Choose configuration method:

#### Method A: Nameservers (Recommended)

1. Vercel provides nameservers. Update your domain registrar:
   - Log in to your domain registrar (GoDaddy, Namecheap, Route53, etc.)
   - Point nameservers to Vercel's provided nameservers
   - Wait 24–48 hours for DNS propagation

#### Method B: CNAME Record (If Nameservers Not Available)

1. Add CNAME record in your registrar:
   - **Name**: `itappens.ai` (or subdomain)
   - **Target**: `cname.vercel-dns.com`
2. Add A record for root domain:
   - **Name**: `@` (root)
   - **Type**: A
   - **Value**: `76.76.19.0` (Vercel IPv4)
3. Wait for DNS propagation

### Verify Domain

1. In Vercel, click **Verify** next to your domain
2. Once verified, you'll see a green checkmark
3. Your site is now live at your domain (e.g., `https://itappens.ai`)

---

## Step 4: Configure Build Settings (Next.js 14)

### Vercel Auto-Detects Next.js

By default, Vercel detects Next.js and configures:
- **Framework**: Next.js
- **Build Command**: `next build`
- **Output Directory**: `.next`

### Static Export (Optional)

If you want to export as static HTML (no server-side rendering):

1. Update `next.config.ts`:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // ... other config
}

module.exports = nextConfig
```

> **Note**: If using `output: 'export'`, the `/api/waitlist` route will NOT work (it requires server-side execution). For this project, use default SSR (no static export) so the API route remains functional.

---

## Step 5: Verify Environment Variables in Production

### Check Vercel Functions

1. After deployment, navigate to **Deployments**
2. Click the latest deployment
3. Go to **Functions** tab
4. Verify `/api/waitlist` is listed as a Serverless Function

### Test API Endpoint in Production

```bash
curl -X POST https://itappens.ai/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Email added to waitlist"
}
```

---

## Step 6: Test Waitlist Form End-to-End

### Functional Testing

1. **Valid Email**:
   - Navigate to `https://itappens.ai`
   - Fill in email field with valid email (e.g., `user@example.com`)
   - Click "Join Waitlist" / "Sign Up Free" button
   - Verify success message appears inline
   - Check Supabase dashboard: email should appear in `waitlist` table

2. **Invalid Email**:
   - Fill in email field with invalid format (e.g., `not-an-email`)
   - Click button
   - Verify error message displays

3. **Duplicate Email**:
   - Submit the same email twice
   - Verify graceful handling (success or info message, no error)
   - Check Supabase: only one entry for that email

4. **Empty Field**:
   - Click button without entering email
   - Verify validation error

5. **Network Error**:
   - Temporarily disable network in DevTools
   - Try to submit form
   - Verify error message displays and user can retry

### Browser Testing

- [ ] Chrome (Windows, macOS, Linux)
- [ ] Firefox (Windows, macOS, Linux)
- [ ] Safari (macOS, iOS)
- [ ] Edge (Windows)

### Device Testing

- [ ] Desktop (1920x1080, 1440x900)
- [ ] Tablet (768px width)
- [ ] Mobile (375px width, iPhone size)

---

## Step 7: Verify CTA Button Links

### Hard Links to eng_1 /signup

1. Verify all CTA buttons (Hero, Pricing sections) have **hard links** (not Next.js router):

```jsx
<a href="https://app.itappens.ai/signup" target="_blank" rel="noopener noreferrer">
  Sign Up
</a>
```

2. Test in production:
   - Click CTA button
   - Verify navigation to eng_1's /signup endpoint
   - Confirm no console errors

> **Coordinate with eng_1**: Confirm the exact URL for `/signup` endpoint (may be subdomain or subroute).

---

## Step 8: Lighthouse & Performance Audit

### Run Lighthouse in Vercel

1. In Vercel project dashboard, navigate to **Analytics**
2. Check **Web Vitals**:
   - First Contentful Paint (FCP): < 1.5s
   - Largest Contentful Paint (LCP): < 2.5s
   - Cumulative Layout Shift (CLS): < 0.1

### Run Local Lighthouse

```bash
npm install -g lighthouse

lighthouse https://itappens.ai --view
```

### Acceptance Criteria

| Metric | Target |
|--------|--------|
| Performance | ≥ 90 |
| Accessibility | ≥ 90 |
| Best Practices | ≥ 90 |
| SEO | ≥ 90 |

If score < 90:
1. Review Lighthouse report for suggestions
2. Optimize images, lazy-load below-fold content
3. Minimize CSS/JS bundles
4. Re-run audit after optimizations

---

## Step 9: Monitor Logs and Errors

### Vercel Logs

1. In Vercel dashboard, go to **Deployments**
2. Click latest deployment → **Logs**
3. Monitor for errors in API routes or build process

### Supabase Logs

1. Go to Supabase dashboard
2. Navigate to **Logs** → **API Requests** or **Database Logs**
3. Verify no errors during waitlist inserts

### Sentry Integration (Optional)

For production error tracking:

1. Sign up at [Sentry.io](https://sentry.io)
2. Create a Next.js project
3. Install Sentry package:

```bash
npm install --save @sentry/nextjs
```

4. Configure in `next.config.ts`:

```typescript
import { withSentryConfig } from '@sentry/nextjs'

const nextConfig = {
  // ... config
}

export default withSentryConfig(
  nextConfig,
  { org: 'your-org', project: 'your-project' },
  { hideSourceMaps: true }
)
```

5. Add Sentry DSN to Vercel environment variables

---

## Step 10: DNS & Domain Final Checks

### Propagation Check

Use [DNS Checker](https://dnschecker.org):

1. Enter your domain (e.g., `itappens.ai`)
2. Verify DNS records propagated globally:
   - A record points to Vercel IP (76.76.19.0)
   - CNAME records correct (if using CNAME method)
   - TXT records for verification (if applicable)

### SSL Certificate

1. Vercel automatically issues SSL cert (Let's Encrypt)
2. In Vercel project, verify SSL status shows ✓ (green checkmark)
3. Test HTTPS:

```bash
curl -I https://itappens.ai
```

Should return `200 OK` with `Strict-Transport-Security` header.

---

## Deployment Checklist

- [ ] `.env.local` created locally (git-ignored)
- [ ] `.env.example` committed to repo (with placeholder values)
- [ ] Supabase `waitlist` table created and schema confirmed
- [ ] `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` set in Vercel environment
- [ ] GitHub repo connected to Vercel
- [ ] Build succeeds without errors
- [ ] `/api/waitlist` endpoint deployed as Serverless Function
- [ ] Custom domain added to Vercel and verified
- [ ] DNS records propagated (verify with DNS checker)
- [ ] SSL certificate issued (green lock icon)
- [ ] Landing page loads at custom domain
- [ ] Waitlist form submits and data appears in Supabase
- [ ] CTA buttons link correctly to eng_1's `/signup`
- [ ] No console errors in production
- [ ] Lighthouse score ≥ 90 (Performance, Accessibility, SEO)
- [ ] Mobile responsiveness tested (375px, 768px, 1024px)
- [ ] Tested on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Network error handling tested
- [ ] Duplicate email handling verified
- [ ] Vercel logs show no errors
- [ ] eng_1 confirms `/signup` endpoint accessible from CTA link

---

## Rollback Procedure

If something goes wrong after deployment:

1. **Revert Commit**: Push a revert commit to `main` branch:

```bash
git revert <commit-hash>
git push origin main
```

2. **Vercel Auto-Redeploys**: Vercel automatically redeploys the previous version.

3. **Manual Rollback**: In Vercel dashboard:
   - Go to **Deployments**
   - Click the previous successful deployment
   - Click **Promote to Production**

---

## Troubleshooting

### Build Fails

1. Check Vercel logs: **Deployments** → **Logs**
2. Look for missing dependencies or syntax errors
3. Verify `next.config.ts` is valid
4. Run `npm run build` locally to reproduce

### API Route 404

1. Verify route file exists: `app/api/waitlist/route.ts`
2. Confirm exports are correct: `export async function POST(...)`
3. Check Vercel **Functions** tab to see if route is deployed

### Environment Variables Not Found

1. Verify variables are set in Vercel **Settings → Environment Variables**
2. Redeploy after adding/updating variables
3. Check variable names match exactly (case-sensitive)

### Domain Not Resolving

1. Use [DNS Propagation Checker](https://www.whatsmydns.net)
2. If A/CNAME records not showing, wait 24–48 hours
3. Double-check registrar settings
4. Contact registrar support if DNS stuck

### Supabase Connection Error

1. Verify `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are correct
2. Check Supabase project is running (not paused)
3. Verify service role key has permission to insert into `waitlist` table
4. Test connection locally with `.env.local` values

---

## Post-Deployment Monitoring

### Daily Checklist

- [ ] Landing page loads
- [ ] No Vercel build errors
- [ ] Supabase has new waitlist entries
- [ ] No JavaScript errors in browser console
- [ ] API response times < 1s

### Weekly Checklist

- [ ] Review Supabase logs for errors
- [ ] Check Lighthouse score (maintain ≥ 90)
- [ ] Monitor Core Web Vitals
- [ ] Review waitlist growth metrics

---

## Contact & Support

- **Backend Issues**: Contact eng_2 (backend developer)
- **Frontend Issues**: Contact eng_1 (frontend developer)
- **Supabase/Database**: Contact DevOps or eng_1
- **Vercel/Deployment**: Vercel support or DevOps

---

**Last Updated**: Sprint 1  
**Deployment Engineer**: eng_2 (Backend)
