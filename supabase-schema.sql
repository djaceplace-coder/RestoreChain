-- ==========================================
-- RESTORECHAIN: FULL SUPABASE SQL SCHEMA
-- ==========================================
-- Run this script in your Supabase SQL Editor.
-- It creates all tables, role-based access control (RLS) policies,
-- functions, and automated triggers.

-- 1. ENUMS & CUSTOM TYPES
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE notif_type AS ENUM ('system', 'alert', 'message', 'transaction', 'security');

-- 2. TABLES

-- PROFILES (Extended User Data)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role user_role DEFAULT 'user'::user_role NOT NULL,
  plan TEXT DEFAULT 'Free' NOT NULL,
  recon_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- WALLETS & EXCHANGES
CREATE TABLE public.wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'Exchange', 'Wallet'
  address_or_key TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'error'
  balance NUMERIC DEFAULT 0,
  last_sync TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRANSACTIONS
CREATE TABLE public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE,
  tx_hash TEXT,
  type TEXT NOT NULL, -- 'Deposit', 'Withdrawal', 'Trade', 'Reward'
  asset TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  value_usd NUMERIC NOT NULL,
  status TEXT DEFAULT 'Completed',
  tx_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SUPPORT TICKETS
CREATE TABLE public.support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  status ticket_status DEFAULT 'open'::ticket_status NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SUPPORT MESSAGES (Real-time Chat)
CREATE TABLE public.support_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_internal_note BOOLEAN DEFAULT FALSE, -- Hidden from users
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS (Push/Alerts)
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- NULL means broadcast to all
  type notif_type DEFAULT 'system'::notif_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (is_admin());

-- Wallets Policies
CREATE POLICY "Users can manage own wallets" ON public.wallets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all wallets" ON public.wallets FOR ALL USING (is_admin());

-- Transactions Policies
CREATE POLICY "Users can manage own txs" ON public.transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all txs" ON public.transactions FOR ALL USING (is_admin());

-- Support Tickets Policies
CREATE POLICY "Users can manage own tickets" ON public.support_tickets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all tickets" ON public.support_tickets FOR ALL USING (is_admin());

-- Support Messages Policies
CREATE POLICY "Users can view own ticket msgs (non-internal)" ON public.support_messages FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.support_tickets t WHERE t.id = ticket_id AND t.user_id = auth.uid()) AND is_internal_note = FALSE);
CREATE POLICY "Users can insert to own tickets" ON public.support_messages FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.support_tickets t WHERE t.id = ticket_id AND t.user_id = auth.uid()));
CREATE POLICY "Admins can manage all msgs" ON public.support_messages FOR ALL USING (is_admin());

-- Notifications Policies
CREATE POLICY "Users can view own or broadcast notifs" ON public.notifications FOR SELECT 
  USING (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "Users can update own notifs (mark read)" ON public.notifications FOR UPDATE 
  USING (user_id = auth.uid());
CREATE POLICY "Admins can manage all notifs" ON public.notifications FOR ALL USING (is_admin());

-- 4. AUTOMATED TRIGGERS & FUNCTIONS

-- A. Auto-create Profile on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  
  -- Trigger Welcome Notification
  INSERT INTO public.notifications (user_id, type, title, message)
  VALUES (NEW.id, 'system', 'Welcome to RestoreChain!', 'Your account has been created successfully. Connect a wallet to get started.');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- B. Auto Update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_tickets_modtime BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
