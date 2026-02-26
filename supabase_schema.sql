-- ──────────────────────────────────────────────────────────────────────────────
-- itappens.ai — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- ──────────────────────────────────────────────────────────────────────────────

-- 1. User Profiles (name, company, onboarding status)
CREATE TABLE IF NOT EXISTS public.profiles (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email           TEXT,
    user_name       TEXT,
    company_name    TEXT,
    customer_id     TEXT UNIQUE,
    onboarding_done BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security: users can only read/write their own profile
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_self" ON public.profiles
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);


-- 2. Subscriptions (Razorpay payments → plan access)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id               UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_email        TEXT,
    razorpay_order_id     TEXT UNIQUE,
    razorpay_payment_id   TEXT UNIQUE,
    plan                  TEXT NOT NULL,   -- 'seed', 'growth', 'scale'
    status                TEXT DEFAULT 'active', -- 'active', 'cancelled', 'expired'
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security: users can only read their own subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subscriptions_self_read" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Service role can insert (for server-side writes from Python backend)
CREATE POLICY "subscriptions_service_insert" ON public.subscriptions
    FOR INSERT WITH CHECK (true);


-- 3. Helper function: auto-update 'updated_at' timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
