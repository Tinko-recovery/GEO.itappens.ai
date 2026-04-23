-- Supabase Schema for GetThandora.com

-- 1. Tables
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    credits_remaining INTEGER DEFAULT 1, -- 1 free credit on signup
    plan TEXT DEFAULT 'free',
    buffer_access_token TEXT, -- encrypted at app level
    credits_expire_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.generations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    platform TEXT NOT NULL,
    copy_output TEXT NOT NULL,
    image_url TEXT,
    niche TEXT,
    brand_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    razorpay_order_id TEXT UNIQUE NOT NULL,
    amount INTEGER NOT NULL, -- in paise
    credits_added INTEGER NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, completed, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Atomic Credit Deduction Function
CREATE OR REPLACE FUNCTION deduct_credits(amount_to_deduct INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.users
    SET credits_remaining = credits_remaining - amount_to_deduct
    WHERE id = auth.uid() 
    AND credits_remaining >= amount_to_deduct
    AND credits_expire_at > NOW();

    IF FOUND THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$;

-- 3. Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Policies for public.users
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Policies for public.generations
CREATE POLICY "Users can view their own generations" ON public.generations
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own generations" ON public.generations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for public.transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

-- 4. Credit Expiry Job (pg_cron)
-- Ensure pg_cron is enabled in Supabase Dashboard (Database -> Extensions)
SELECT cron.schedule('zero-expired-credits', '0 0 * * *', $$
    UPDATE public.users
    SET credits_remaining = 0
    WHERE credits_expire_at < NOW() AND credits_remaining > 0;
$$);

-- 5. Trigger for New User Profile
-- Automatically create a profile in public.users when a new user signs up via Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email)
    VALUES (new.id, new.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
