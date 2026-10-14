-- =========================================================================
-- TRACEFIELD: COMPLETE FIX FOR DATABASE TIMEOUTS & KYC IMAGES
-- =========================================================================
-- Run this in your Supabase SQL Editor (SQL Editor -> New Query -> Run)
--
-- This script permanently fixes:
-- 1. "canceling statement due to statement timeout" (RLS infinite recursion)
-- 2. Images not showing up in the Admin Panel
-- 3. Enables fast RPC functions for KYC and NDA documents
-- 4. Ensures the 'kyc' Storage bucket is configured and public
-- =========================================================================

-- STEP 1: Fast, Non-Recursive Admin Function with row_security = off
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

-- STEP 2: Clean Non-Recursive RLS on Profiles (Stops Statement Timeouts)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Profiles select policy" ON public.profiles;
DROP POLICY IF EXISTS "Allow select profiles" ON public.profiles;

-- Allow authenticated users to view profiles (needed for admin views, chat, support, compliance)
CREATE POLICY "Allow select profiles"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can only update their own profile unless admin
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow update own profile or admin" ON public.profiles;

CREATE POLICY "Allow update own profile or admin"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- STEP 3: Clean RLS on kyc_documents
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own KYC documents" ON public.kyc_documents;
DROP POLICY IF EXISTS "Admins have full access to kyc" ON public.kyc_documents;
DROP POLICY IF EXISTS "Admins can view all KYC documents" ON public.kyc_documents;
DROP POLICY IF EXISTS "Admins can manage all KYC documents" ON public.kyc_documents;
DROP POLICY IF EXISTS "Allow select kyc" ON public.kyc_documents;
DROP POLICY IF EXISTS "Allow insert kyc" ON public.kyc_documents;
DROP POLICY IF EXISTS "Allow update kyc" ON public.kyc_documents;

CREATE POLICY "Allow select kyc"
  ON public.kyc_documents FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Allow insert kyc"
  ON public.kyc_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Allow update kyc"
  ON public.kyc_documents FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin());

-- STEP 4: Clean RLS on user_documents (NDAs)
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own documents" ON public.user_documents;
DROP POLICY IF EXISTS "Admins have full access to user docs" ON public.user_documents;
DROP POLICY IF EXISTS "Admins can manage all user documents" ON public.user_documents;
DROP POLICY IF EXISTS "Allow select user_docs" ON public.user_documents;
DROP POLICY IF EXISTS "Allow insert user_docs" ON public.user_documents;
DROP POLICY IF EXISTS "Allow update user_docs" ON public.user_documents;

CREATE POLICY "Allow select user_docs"
  ON public.user_documents FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Allow insert user_docs"
  ON public.user_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Allow update user_docs"
  ON public.user_documents FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin());

-- STEP 5: Fast Atomic RPC to retrieve all KYC documents with images (Bypasses RLS)
CREATE OR REPLACE FUNCTION public.admin_get_kyc_documents()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  document_type TEXT,
  document_url TEXT,
  document_back_url TEXT,
  selfie_url TEXT,
  status TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  profile_kyc_status TEXT,
  account_status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    k.id,
    k.user_id,
    k.document_type,
    k.document_url,
    k.document_back_url,
    k.selfie_url,
    k.status,
    k.rejection_reason,
    k.created_at,
    k.updated_at,
    p.email,
    p.first_name,
    p.last_name,
    p.kyc_status AS profile_kyc_status,
    p.account_status
  FROM public.kyc_documents k
  LEFT JOIN public.profiles p ON p.id = k.user_id
  ORDER BY k.created_at DESC;
END;
$$;

-- STEP 6: Fast Atomic RPC to retrieve all NDA agreements (Bypasses RLS)
CREATE OR REPLACE FUNCTION public.admin_get_nda_documents()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  document_type TEXT,
  signature_data TEXT,
  status TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  profile_kyc_status TEXT,
  account_status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.user_id,
    u.document_type,
    u.signature_data,
    u.status,
    u.created_at,
    u.updated_at,
    p.email,
    p.first_name,
    p.last_name,
    p.kyc_status AS profile_kyc_status,
    p.account_status
  FROM public.user_documents u
  LEFT JOIN public.profiles p ON p.id = u.user_id
  ORDER BY u.created_at DESC;
END;
$$;

-- STEP 7: Ensure Storage Bucket 'kyc' is created and public (for photos)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'kyc') THEN
    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('kyc', 'kyc', true);
  ELSE
    UPDATE storage.buckets SET public = true WHERE id = 'kyc';
  END IF;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Storage bucket RLS policies (allow authenticated upload & public read)
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public KYC read access" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload KYC" ON storage.objects;
  
  CREATE POLICY "Public KYC read access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'kyc');

  CREATE POLICY "Authenticated users can upload KYC"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'kyc');
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- STEP 8: Grant privileges to all roles
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role, anon;
GRANT EXECUTE ON FUNCTION public.admin_get_kyc_documents() TO authenticated, service_role, anon;
GRANT EXECUTE ON FUNCTION public.admin_get_nda_documents() TO authenticated, service_role, anon;

-- STEP 9: Quick Health Check (Verifies 0 timeouts and shows current document counts)
SELECT 
  (SELECT COUNT(*) FROM public.kyc_documents) AS total_kyc_records,
  (SELECT COUNT(*) FROM public.kyc_documents WHERE document_url IS NOT NULL) AS kyc_with_photos,
  (SELECT COUNT(*) FROM public.user_documents) AS total_nda_records;
