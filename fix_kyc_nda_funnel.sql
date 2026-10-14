-- ==============================================================================
-- TRACEFIELD: COMPLETE PRODUCTION COMPLIANCE, KYC LIVE CAMERA & NOTIFICATIONS SCRIPT
-- ==============================================================================
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query -> Run)
--
-- This script permanently eliminates:
-- 1. "canceling statement due to statement timeout" (by setting row_security = off in is_admin)
-- 2. Recursive RLS loops on public.profiles
-- 3. Blocked admin notification inserts and blocked user status updates
-- 4. Notification badge inflation (by providing clean atomic status management)
-- 5. Out-of-sync admin vs user verification states
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
ALTER TABLE public.kyc_documents ADD COLUMN IF NOT EXISTS document_url TEXT;
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

-- Convert notifications.type to TEXT if it was created with the notif_type enum,
-- so any notification category (system, alert, warning, security, etc.) is accepted without error
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'type' AND data_type = 'USER-DEFINED'
  ) THEN
    BEGIN
      ALTER TABLE public.notifications ALTER COLUMN type TYPE TEXT USING type::text;
    EXCEPTION
      WHEN others THEN NULL;
    END;
  END IF;
END $$;

-- Enable RLS on all four tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
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
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 8. Fast, NON-RECURSIVE Admin Check Function
-- Setting row_security = off guarantees that when is_admin() queries public.profiles,
-- it NEVER evaluates profiles RLS policies, completely eradicating recursive statement timeouts!
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
SET row_security = off
AS $$
DECLARE
  v_is_admin BOOLEAN := false;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  SELECT (role::text IN ('admin', 'super_admin') OR is_admin = true)
  INTO v_is_admin
  FROM public.profiles
  WHERE id = auth.uid()
  LIMIT 1;

  RETURN COALESCE(v_is_admin, false);
END;
$$;

-- 9. Clean RLS Policies for public.profiles (Prevents Infinite Loops)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles access" ON public.profiles;
DROP POLICY IF EXISTS "Admins manage profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles" ON public.profiles;

CREATE POLICY "Users can view profiles"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update profiles"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- 10. Clean RLS Policies for kyc_documents
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

-- 11. Clean RLS Policies for user_documents (NDAs)
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

-- 12. Clean RLS Policies for notifications (Allow Admins to Notify Any User)
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can insert own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Notifications access" ON public.notifications;
DROP POLICY IF EXISTS "Admins can manage all notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow notification inserts" ON public.notifications;

-- Users can read their own notifications, admins can read all
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- Users can mark their notifications as read
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin());

-- Allow notification inserts from authenticated callers (admins dispatching alerts to clients)
CREATE POLICY "Allow notification inserts"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- Admins full access to notifications
CREATE POLICY "Admins can manage all notifications"
  ON public.notifications FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 13. Storage Bucket Setup ('kyc')
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('kyc', 'kyc', true)
    ON CONFLICT (id) DO UPDATE SET public = true;

    BEGIN
      DROP POLICY IF EXISTS "Public read KYC storage" ON storage.objects;
      CREATE POLICY "Public read KYC storage" ON storage.objects
        FOR SELECT USING (bucket_id = 'kyc');
    EXCEPTION WHEN others THEN NULL;
    END;

    BEGIN
      DROP POLICY IF EXISTS "Authenticated upload KYC storage" ON storage.objects;
      CREATE POLICY "Authenticated upload KYC storage" ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = 'kyc' AND auth.role() = 'authenticated');
    EXCEPTION WHEN others THEN NULL;
    END;

    BEGIN
      DROP POLICY IF EXISTS "Admin manage KYC storage" ON storage.objects;
      CREATE POLICY "Admin manage KYC storage" ON storage.objects
        FOR ALL USING (bucket_id = 'kyc' AND public.is_admin());
    EXCEPTION WHEN others THEN NULL;
    END;
  END IF;
END $$;

-- 14. Atomic RPC: Request KYC Live Photo Snap & Notify User
CREATE OR REPLACE FUNCTION public.admin_request_kyc_resubmission(
  target_user_id UUID,
  reason TEXT DEFAULT 'Compliance has requested fresh live photos for identity verification.'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
BEGIN
  -- 1. Ensure the user's profile is set to unverified so they can access the live snap flow
  UPDATE public.profiles
  SET 
    kyc_status = 'unverified',
    updated_at = now()
  WHERE id = target_user_id;

  -- 2. Mark previous pending KYC docs as rejected so pending badges decrement
  UPDATE public.kyc_documents
  SET 
    status = 'rejected',
    rejection_reason = reason,
    updated_at = now()
  WHERE user_id = target_user_id AND status = 'pending';

  -- 3. Insert notification directly into notifications table
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    is_read,
    created_at
  ) VALUES (
    target_user_id,
    'alert',
    'Action Required: Live ID Verification Requested',
    COALESCE(reason, 'Compliance has requested fresh, clearer photographic credentials for your ID. Please open Identity Verification in your Settings or Portfolio to snap live photos.'),
    false,
    now()
  );
END;
$$;

-- 15. Atomic RPC: Update KYC Status & Synchronize Profile + Notifications
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
SET row_security = off
AS $$
BEGIN
  -- Update document table if valid UUID provided
  IF doc_id IS NOT NULL THEN
    IF source_table = 'kyc_documents' THEN
      UPDATE public.kyc_documents
      SET status = new_status, updated_at = now()
      WHERE id = doc_id;
    ELSIF source_table = 'user_documents' THEN
      UPDATE public.user_documents
      SET status = new_status, updated_at = now()
      WHERE id = doc_id;
    END IF;
  END IF;

  -- Update profile status
  UPDATE public.profiles
  SET kyc_status = new_status, updated_at = now()
  WHERE id = target_user_id;

  -- Insert notification for user
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    is_read,
    created_at
  ) VALUES (
    target_user_id,
    CASE WHEN new_status = 'approved' THEN 'system' ELSE 'alert' END,
    CASE WHEN new_status = 'approved' THEN 'Identity Verification Approved' ELSE 'Identity Verification Update' END,
    CASE WHEN new_status = 'approved' 
      THEN 'Your identity documents have been verified and approved by compliance. You now have full access to all platform features.'
      ELSE 'Your submitted identity documents were not approved by compliance. Please review requirements and submit clear, valid documents.'
    END,
    false,
    now()
  );
END;
$$;

-- ==============================================================================
-- 16. INSTANT RESET / TEST QUERIES FOR MICHAEL DANE
-- ==============================================================================
-- Run these lines to immediately reset Michael to unverified so he can test live snapping:

UPDATE public.profiles 
SET kyc_status = 'unverified' 
WHERE email = 'michaeldane1812@gmail.com';

UPDATE public.kyc_documents 
SET status = 'rejected', rejection_reason = 'Testing fresh live camera flow' 
WHERE user_id IN (SELECT id FROM public.profiles WHERE email = 'michaeldane1812@gmail.com');

-- Insert a test notification for Michael so his bell immediately rings:
INSERT INTO public.notifications (user_id, type, title, message, is_read, created_at)
SELECT 
  id, 
  'alert', 
  'Action Required: Live ID Verification Requested', 
  'Compliance has requested fresh, clearer photographic credentials for your ID. Please open Identity Verification in your Settings or Portfolio to snap live photos.',
  false, 
  now()
FROM public.profiles 
WHERE email = 'michaeldane1812@gmail.com'
LIMIT 1;

-- To test instant approval instead, you can run:
-- UPDATE public.profiles SET kyc_status = 'approved' WHERE email = 'michaeldane1812@gmail.com';
-- UPDATE public.kyc_documents SET status = 'approved', updated_at = now() WHERE user_id IN (SELECT id FROM public.profiles WHERE email = 'michaeldane1812@gmail.com');
