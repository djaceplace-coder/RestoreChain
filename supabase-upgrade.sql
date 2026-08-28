-- =================================================================================
-- Tracefield Phase 1 & 2 Upgrade Script
-- =================================================================================
-- 1. Adds Language Preferences for Global Internationalization Support
-- 2. Creates the Wallet Connections table for deeper asset integration
-- 3. Enables Row Level Security on the new integrations
-- =================================================================================

-- Add a preferred_language column to profiles if it does not exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'preferred_language') THEN
        ALTER TABLE public.profiles ADD COLUMN preferred_language text DEFAULT 'en';
    END IF;
END $$;

-- Update existing users to 'en'
UPDATE public.profiles SET preferred_language = 'en' WHERE preferred_language IS NULL;

-- =================================================================================
-- WALLET CONNECTIONS TABLE
-- This table stores connected wallet information for the advanced portfolio overview.
-- It supports APIs, raw addresses, and OAuth connections for various wallet types 
-- (MetaMask, TrustWallet, Centralized Exchanges, etc).
-- =================================================================================
CREATE TABLE IF NOT EXISTS public.wallet_connections (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    wallet_provider text NOT NULL, -- e.g., 'metamask', 'trustwallet', 'binance', 'coinbase'
    wallet_type text NOT NULL, -- e.g., 'web3', 'exchange', 'hardware'
    wallet_address text, -- Public key or deposit address
    api_key_encrypted text, -- Encrypted read-only API key (if applicable)
    api_secret_encrypted text, -- Encrypted API secret (if applicable)
    is_read_only boolean DEFAULT true, -- Enforce read-only logic
    status text DEFAULT 'active', -- 'active', 'disconnected', 'sync_failed'
    last_synced_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- =================================================================================
-- RLS POLICIES FOR WALLET CONNECTIONS
-- Ensures strict user data privacy. Users can only see and manage their own wallets.
-- =================================================================================
ALTER TABLE public.wallet_connections ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own wallet connections' AND tablename = 'wallet_connections') THEN
        CREATE POLICY "Users can view their own wallet connections" 
            ON public.wallet_connections FOR SELECT 
            USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own wallet connections' AND tablename = 'wallet_connections') THEN
        CREATE POLICY "Users can insert their own wallet connections" 
            ON public.wallet_connections FOR INSERT 
            WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own wallet connections' AND tablename = 'wallet_connections') THEN
        CREATE POLICY "Users can update their own wallet connections" 
            ON public.wallet_connections FOR UPDATE 
            USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own wallet connections' AND tablename = 'wallet_connections') THEN
        CREATE POLICY "Users can delete their own wallet connections" 
            ON public.wallet_connections FOR DELETE 
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- Admins can manage all wallet connections
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage all wallet connections' AND tablename = 'wallet_connections') THEN
        CREATE POLICY "Admins can manage all wallet connections" 
            ON public.wallet_connections 
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM public.profiles 
                    WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.role = 'super_admin')
                )
            );
    END IF;
END $$;
