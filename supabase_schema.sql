-- ──────────────────────────────────────────────────────────────────────────────
-- itappens.ai — Stock Monitor Migration Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- ──────────────────────────────────────────────────────────────────────────────

-- 1. Extend Profiles Table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='telegram_id') THEN
        ALTER TABLE public.profiles ADD COLUMN telegram_id TEXT;
    END IF;
END $$;

-- 2. New Table: Portfolios (User holdings)
CREATE TABLE IF NOT EXISTS public.portfolios (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ticker          TEXT NOT NULL,
    quantity        DECIMAL DEFAULT 0,
    buy_price       DECIMAL DEFAULT 0,
    added_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 3. New Table: Market Signals (Latest signals for tickers)
CREATE TABLE IF NOT EXISTS public.market_signals (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker          TEXT UNIQUE NOT NULL,
    last_signal     TEXT, -- 'BUY', 'SELL', 'HOLD'
    technical_score DECIMAL,
    fundamental_score DECIMAL,
    reasoning       TEXT,
    last_updated    TIMESTAMPTZ DEFAULT NOW()
);

-- 4. New Table: Analysis History (Archive of all agent runs)
CREATE TABLE IF NOT EXISTS public.analysis_history (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker          TEXT NOT NULL,
    signal          TEXT,
    reasoning       TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;

-- 6. Safe Policy Creation (Drop before Create)

-- Portfolios: users can only see their own
DROP POLICY IF EXISTS "portfolios_self" ON public.portfolios;
CREATE POLICY "portfolios_self" ON public.portfolios
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Market Signals: Read access for everyone
DROP POLICY IF EXISTS "market_signals_read_all" ON public.market_signals;
CREATE POLICY "market_signals_read_all" ON public.market_signals
    FOR SELECT USING (true);

-- Profiles: users can only read/write their own profile
DROP POLICY IF EXISTS "profiles_self" ON public.profiles;
CREATE POLICY "profiles_self" ON public.profiles
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Subscriptions: users can only read their own
DROP POLICY IF EXISTS "subscriptions_self_read" ON public.subscriptions;
CREATE POLICY "subscriptions_self_read" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Service Role insert for subscriptions (if needed)
DROP POLICY IF EXISTS "subscriptions_service_insert" ON public.subscriptions;
CREATE POLICY "subscriptions_service_insert" ON public.subscriptions
    FOR INSERT WITH CHECK (true);
