-- ==============================================================================
-- TRACEFIELD: COMPLETE PRODUCTION COMPLIANCE & NOTIFICATIONS ALIGNMENT SCRIPT
-- ==============================================================================
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query -> Run)
--
-- This script fixes and configures:
-- 1. Adds 'super_admin' to enum user_role without error.
-- 2. Ensures profiles table has is_admin, kyc_status, account_status, and clean constraints.
-- 3. Grants full Admin rights to adereraadenike@gmail.com and existing admin accounts.
-- 4. Ensures kyc_documents & user_documents tables exist with proper columns and foreign keys.
-- 5. Ensures notifications table exists with proper columns and non-blocking RLS.
-- 6. Configures public.is_admin() helper function with SECURITY DEFINER to bypass recursion.
-- 7. Configures clean RLS policies allowing Admins to manage all tables, users to view/create their own.
-- 8. Adds performance indexes on user_id and status to eliminate query timeouts.
-- 9. Deploys atomic admin_update_kyc_status RPC function for one-click UI approvals.
-- ==============================================================================

-- 1. Ensure 'super_admin' exists in user_role enum
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    BEGIN
      ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'super_admin';
    EXCEPTION
      WHEN duplicate_object THEN NULL;
      WHEN others THEN NULL;
    END;
  END IF;
END $$;

-- 2. Ensure columns exist on profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS kyc_status TEXT DEFAULT 'unverified';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'active';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_currency TEXT DEFAULT 'USD';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en';

-- 3. Elevate Admin account(s)
UPDATE public.profiles
SET 
  role = 'admin'::user_role,
  is_admin = true,
  account_status = 'active'
WHERE email = 'adereraadenike@gmail.com' 
   OR role::text IN ('admin', 'super_admin') 
   OR is_admin = true;

-- 4. Ensure KYC Documents Table exists
CREATE TABLE IF NOT EXISTS public.kyc_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL,
  document_url TEXT,
  document_back_url TEXT,
  selfie_url TEXT,
  status TEXT DEFAULT 'pending' NOT NULL,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure all columns exist on kyc_documents
ALTER TABLE public.kyc_documents ADD COLUMN IF NOT EXISTS document_back_url TEXT;
ALTER TABLE public.kyc_documents ADD COLUMN IF NOT EXISTS selfie_url TEXT;
ALTER TABLE public.kyc_documents ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE public.kyc_documents ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- 5. Ensure Agreements / NDAs Table exists
CREATE TABLE IF NOT EXISTS public.user_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL,
  document_url TEXT,
  signature_data TEXT,
  status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Ensure Notifications Table exists
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT DEFAULT 'system',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'system';

-- Enable RLS on all three tables
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 7. High-Performance Indexing to prevent query statement timeouts
CREATE INDEX IF NOT EXISTS idx_kyc_docs_user_id ON public.kyc_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_docs_status ON public.kyc_documents(status);
CREATE INDEX IF NOT EXISTS idx_user_docs_user_id ON public.user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_docs_status ON public.user_documents(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_profiles_kyc_status ON public.profiles(kyc_status);

-- 8. Fast Security Definer Admin Check Function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() 
      AND (
        role::text IN ('admin', 'super_admin')
        OR is_admin = true
      )
  );
$$;

-- 9. Clean RLS Policies for kyc_documents
DROP POLICY IF EXISTS "Admins have full access to kyc" ON public.kyc_documents;
DROP POLICY IF EXISTS "Admins can view all KYC documents" ON public.kyc_documents;
DROP POLICY IF EXISTS "Admins can update KYC documents" ON public.kyc_documents;
DROP POLICY IF EXISTS "Admins can manage all KYC documents" ON public.kyc_documents;
DROP POLICY IF EXISTS "Users can view their own KYC documents" ON public.kyc_documents;
DROP POLICY IF EXISTS "Users can insert their own KYC documents" ON public.kyc_documents;
DROP POLICY IF EXISTS "Users can update their own KYC documents" ON public.kyc_documents;

CREATE POLICY "Users can view their own KYC documents"
  ON public.kyc_documents FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert their own KYC documents"
  ON public.kyc_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own KYC documents"
  ON public.kyc_documents FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can manage all KYC documents"
  ON public.kyc_documents FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 10. Clean RLS Policies for user_documents (NDAs)
DROP POLICY IF EXISTS "Admins have full access to user docs" ON public.user_documents;
DROP POLICY IF EXISTS "Users can view their own documents" ON public.user_documents;
DROP POLICY IF EXISTS "Users can insert their own documents" ON public.user_documents;
DROP POLICY IF EXISTS "Admins can manage all user documents" ON public.user_documents;

CREATE POLICY "Users can view their own documents"
  ON public.user_documents FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert their own documents"
  ON public.user_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all user documents"
  ON public.user_documents FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 11. Clean RLS Policies for notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can insert own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Notifications access" ON public.notifications;
DROP POLICY IF EXISTS "Admins can manage all notifications" ON public.notifications;

-- Users can read their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- Users can mark their notifications as read
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin());

-- System & Admin inserts (Allow authenticated callers to insert notifications for target users)
CREATE POLICY "Allow notification inserts"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- Admins full access to notifications
CREATE POLICY "Admins can manage all notifications"
  ON public.notifications FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 12. Robust admin_update_kyc_status RPC
CREATE OR REPLACE FUNCTION public.admin_update_kyc_status(
  target_user_id UUID, 
  doc_id UUID, 
  source_table TEXT, 
  new_status TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_is_admin BOOLEAN;
BEGIN
  -- Verify caller is administrator
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
      AND (
        role::text IN ('admin', 'super_admin') 
        OR is_admin = true
      )
  ) INTO v_caller_is_admin;

  IF NOT v_caller_is_admin THEN
    RAISE EXCEPTION 'Access Denied: Caller is not authorized as an administrator';
  END IF;

  IF source_table = 'user_documents' THEN
    UPDATE public.user_documents 
    SET status = new_status, updated_at = now() 
    WHERE id = doc_id;
  ELSIF source_table = 'kyc_documents' THEN
    UPDATE public.kyc_documents 
    SET status = new_status, updated_at = now() 
    WHERE id = doc_id;
    
    -- Only update profiles.kyc_status for identity documents
    IF new_status IN ('approved', 'rejected', 'pending', 'unverified') THEN
      UPDATE public.profiles 
      SET kyc_status = new_status 
      WHERE id = target_user_id;
    END IF;
  ELSE
    RAISE EXCEPTION 'Invalid document source table: %', source_table;
  END IF;
END;
$$;

-- 13. Grant Permissions to authenticated and anon users
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_kyc_status(UUID, UUID, TEXT, TEXT) TO authenticated;
GRANT ALL ON TABLE public.kyc_documents TO authenticated;
GRANT ALL ON TABLE public.user_documents TO authenticated;
GRANT ALL ON TABLE public.notifications TO authenticated;

-- ==============================================================================
-- OPTIONAL DIRECT APPROVAL / RESET SHORTCUTS (Uncomment if needed)
-- ==============================================================================
--
-- A. Instantly approve Michael Dane (or any specific user by email):
-- UPDATE public.profiles SET kyc_status = 'approved' WHERE email = 'michaeldane1812@gmail.com';
-- UPDATE public.kyc_documents SET status = 'approved', updated_at = now() WHERE user_id IN (SELECT id FROM public.profiles WHERE email = 'michaeldane1812@gmail.com');
--
-- B. Instantly approve ALL pending KYC submissions:
-- UPDATE public.profiles SET kyc_status = 'approved' WHERE kyc_status = 'pending';
-- UPDATE public.kyc_documents SET status = 'approved', updated_at = now() WHERE status = 'pending';
--
-- C. Reset Michael Dane to unverified so he can submit fresh photos:
-- UPDATE public.profiles SET kyc_status = 'unverified' WHERE email = 'michaeldane1812@gmail.com';
-- UPDATE public.kyc_documents SET status = 'rejected', rejection_reason = 'Photo re-upload requested' WHERE user_id IN (SELECT id FROM public.profiles WHERE email = 'michaeldane1812@gmail.com');
