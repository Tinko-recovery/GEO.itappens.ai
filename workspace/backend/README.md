# itappens.ai Marketing Landing Page

A modern, responsive marketing landing page for itappens.ai built with Next.js 14, Tailwind CSS, and Supabase. The page features a hero section, product benefits, pricing, and a waitlist signup form that integrates with Supabase.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 18.x or higher
- **npm** or **yarn**: Latest version
- **Git**: For version control
- **Supabase Account**: For database (shared instance with eng_1)

### Installation

1. **Clone the repository**:

```bash
git clone https://github.com/your-org/itappens-landing.git
cd itappens-landing
```

2. **Install dependencies**:

```bash
npm install
# or
yarn install
```

3. **Set up environment variables**:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
```

4. **Run development server**:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
itappens-landing/
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── api/
│       └── waitlist/
│           └── route.ts          # POST /api/waitlist endpoint
├── components/
│   ├── sections/                 # Page sections
│   │   ├── HeroSection.tsx
│   │   ├── BenefitsSection.tsx
│   │   ├── ProductVisual.tsx
│   │   ├── PricingSection.tsx
│   │   └── WaitlistSection.tsx
│   ├── ui/                       # Reusable UI components
│   │   ├── BenefitCard.tsx
│   │   ├── PricingCard.tsx
│   │   ├── WaitlistForm.tsx
│   │   └── Button.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/
│   └── supabase.ts               # Supabase client (server-side)
├── types/
│   └── waitlist.ts               # TypeScript type definitions
├── public/
│   └── assets/                   # Static assets
├── .env.example                  # Environment template
├── .gitignore
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
├── API.md                        # API documentation
├── DEPLOYMENT.md                 # Deployment guide
└── README.md                     # This file
```

---

## 🛠️ Development

### Available Scripts

```bash
# Development server (hot reload)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting (if ESLint configured)
npm run lint

# Type checking
npm run type-check
```

### Local Database Setup

1. **Create Supabase account** (if not already done):
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note the project URL and service role key

2. **Create `waitlist` table** in Supabase:

```sql
CREATE TABLE waitlist (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source     TEXT NOT NULL DEFAULT 'landing_page'
);

CREATE UNIQUE INDEX waitlist_email_idx ON waitlist (email);
```

3. **Test API locally**:

```bash
curl -X POST http://localhost:3000/api/waitlist \
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

## 🎨 Customization

### Update Copy

- **Hero Section**: Edit `components/sections/HeroSection.tsx`
- **Benefits**: Edit `components/sections/BenefitsSection.tsx`
- **Pricing**: Edit `components/sections/PricingSection.tsx`

### Update CTA URLs

Replace `eng_1_production_domain` with actual URL from eng_1:

```bash
# Search for placeholder
grep -r "eng_1_production_domain" --include="*.tsx"

# Update to actual /signup URL (e.g., https://app.itappens.ai/signup)
```

### Update Product Visual

1. Obtain screenshot/GIF from eng_1
2. Place in `public/assets/dashboard-preview.png`
3. Update reference in `components/sections/ProductVisual.tsx`

---

## 🔒 Security

### Environment Variables

- **Never commit `.env.local`**: Already in `.gitignore`
- **Service role key only**: Use `SUPABASE_SERVICE_KEY`, not anon key
- **Server-side only**: Supabase client only in `lib/supabase.ts`
- **No client-side secrets**: All DB access through `/api/waitlist`

### API Security

- Email validated server-side (never trust client)
- Service role key never exposed to frontend
- Error messages don't leak internal details
- Rate limiting recommended for production (see DEPLOYMENT.md)

---

## 📊 Monitoring

### Local Testing

```bash
# Test form submission
npm run dev

# Open http://localhost:3000
# Fill email → submit → check browser console + Supabase dashboard
```

### Production Monitoring

- **Vercel Logs**: Dashboard → Deployments → Logs
- **Supabase Dashboard**: View waitlist entries in real-time
- **Lighthouse**: Verify Core Web Vitals ≥ 90
- **Error Tracking**: Set up Sentry (optional, see DEPLOYMENT.md)

---

## 🚢 Deployment

### Quick Deploy to Vercel

1. **Push to GitHub**:

```bash
git add .
git commit -m "Initial landing page commit"
git push origin main
```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select GitHub repo
   - Add environment variables (see DEPLOYMENT.md)
   - Deploy

3. **Configure Custom Domain**:
   - In Vercel project settings → Domains
   - Add `itappens.ai` (or your domain)
   - Update DNS at registrar

For detailed deployment steps, see [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## 📚 Documentation

- **[API.md](./API.md)**: `/api/waitlist` endpoint documentation
- **[DEPLOYMENT.md](./DEPLOYMENT.md)**: Step-by-step deployment guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Tech stack & architecture overview (if available)

---

## 🔄 Coordination with eng_1

This project coordinates with eng_1's backend:

| Item | Action |
|------|--------|
| Supabase instance | Confirm shared URL + service key with eng_1 |
| `/signup` endpoint | Obtain production URL from eng_1 (hard-code in CTAs) |
| Product screenshot | Request from eng_1 (place in `/public/assets`) |
| Domain config | Confirm subdomain (app.itappens.ai) vs. subroute (/app) |

**Contact eng_1 before sprint start** to align on above items.

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Hero section renders correctly
- [ ] Benefits cards display with icons
- [ ] Product visual loads without layout shift
- [ ] Pricing section visible and readable
- [ ] Waitlist form validates email client-side
- [ ] Submit button shows loading state
- [ ] Success message displays after submit
- [ ] Form resets after success
- [ ] CTA buttons link to eng_1 /signup
- [ ] No console errors or warnings
- [ ] Mobile responsive (375px, 768px, 1024px)
- [ ] Works on Chrome, Firefox, Safari
- [ ] Data persists in Supabase

### Automated Testing (Future)

Consider adding:
- Jest + React Testing Library for component tests
- Cypress or Playwright for E2E tests
- Lighthouse CI for performance regression testing

---

## 🐛 Troubleshooting

### Blank Page / 500 Error

1. Check Vercel logs: `npm run build` locally
2. Verify environment variables in `.env.local`
3. Check Supabase connection

### Form Submit Fails

1. Verify `/api/waitlist` endpoint exists
2. Check Supabase `SUPABASE_SERVICE_KEY` is correct
3. Check Supabase `waitlist` table exists with correct schema
4. Check browser console for network errors

### Poor Lighthouse Score

1. Optimize images with `next/image`
2. Lazy-load below-fold components
3. Minimize CSS/JS bundles
4. Enable static export if possible (see next.config.ts)

---

## 📈 Future Improvements

- [ ] Email verification / double opt-in
- [ ] SEO metadata (OG tags, structured data, sitemap.xml)
- [ ] Analytics integration (PostHog, Plausible)
- [ ] Rate limiting on API endpoint
- [ ] A/B testing hero copy
- [ ] Error monitoring (Sentry)
- [ ] Admin dashboard for waitlist management
- [ ] Email notifications to ops team on new signups

---

## 📝 License

[Add license info if applicable]

---

## 👥 Team

- **Backend (API)**: eng_2
- **Frontend (Pages, Components)**: eng_1 or eng_2
- **Infrastructure**: DevOps

---

## 📞 Support

For issues or questions:

1. Check [API.md](./API.md) for endpoint documentation
2. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
3. Contact eng_2 (backend) for server-side issues
4. Contact eng_1 for `/signup` endpoint coordination

---

**Last Updated**: Sprint 1  
**Project**: itappens.ai Marketing Landing Page  
**Status**: ✅ MVP Ready for Deployment
