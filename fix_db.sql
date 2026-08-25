-- 1. Drop old support tables if they exist and recreate them to match the new UI
DROP TABLE IF EXISTS public.support_messages CASCADE;
DROP TABLE IF EXISTS public.support_tickets CASCADE;

CREATE TABLE public.support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sender TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Ensure all tables have the correct schema
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
UPDATE public.profiles SET is_admin = true WHERE email = 'adereraadenike@gmail.com';

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER 
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  );
$$;

-- 3. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.defi_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nfts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reconciliation_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Profiles access" ON public.profiles;
DROP POLICY IF EXISTS "DeFi access" ON public.defi_positions;
DROP POLICY IF EXISTS "NFTs access" ON public.nfts;
DROP POLICY IF EXISTS "Notifications access" ON public.notifications;
DROP POLICY IF EXISTS "Recon access" ON public.reconciliation_issues;
DROP POLICY IF EXISTS "Support access" ON public.support_messages;
DROP POLICY IF EXISTS "Tax access" ON public.tax_reports;
DROP POLICY IF EXISTS "Transactions access" ON public.transactions;
DROP POLICY IF EXISTS "Wallets access" ON public.wallets;

-- 5. Create policies
CREATE POLICY "Profiles access" ON public.profiles FOR ALL USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "DeFi access" ON public.defi_positions FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "NFTs access" ON public.nfts FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Notifications access" ON public.notifications FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Recon access" ON public.reconciliation_issues FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Support access" ON public.support_messages FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Tax access" ON public.tax_reports FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Transactions access" ON public.transactions FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Wallets access" ON public.wallets FOR ALL USING (auth.uid() = user_id OR public.is_admin());
