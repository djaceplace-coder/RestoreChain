-- ==============================================================================
-- TRACEFIELD: COMPREHENSIVE KYC & NDA FUNNEL RESTORATION SCRIPT
-- ==============================================================================
-- Fixes:
-- 1. Invalid input value for enum user_role: "super_admin" by safely adding the enum value
--    and casting role to TEXT in all authorization checks.
-- 2. Grants admin permissions to adereraadenike@gmail.com.
-- 3. Configures RLS policies on kyc_documents & user_documents for admin full access.
-- 4. Corrects the admin_update_kyc_status RPC to only affect kyc_status on KYC documents,
--    preventing NDA approvals from inappropriately altering identity verification statuses.
-- ==============================================================================

-- 1. Add 'super_admin' to user_role enum if it doesn't already exist
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

-- 3. Ensure the admin user has full admin rights in profiles
UPDATE public.profiles
SET 
  role = 'admin'::user_role,
  is_admin = true,
  account_status = 'active'
WHERE email = 'adereraadenike@gmail.com' 
   OR role::text IN ('admin', 'super_admin') 
   OR is_admin = true;

-- 4. Ensure tables exist with appropriate columns and foreign keys
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

-- Enable RLS on both document tables
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;

-- 5. Helper function to check if caller is an admin
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

-- 6. Re-create clean RLS policies for kyc_documents
DROP POLICY IF EXISTS "Admins have full access to kyc" ON public.kyc_documents;
DROP POLICY IF EXISTS "Admins can view all KYC documents" ON public.kyc_documents;
DROP POLICY IF EXISTS "Admins can update KYC documents" ON public.kyc_documents;
DROP POLICY IF EXISTS "Users can view their own KYC documents" ON public.kyc_documents;
DROP POLICY IF EXISTS "Users can insert their own KYC documents" ON public.kyc_documents;

-- Users can view their own KYC docs
CREATE POLICY "Users can view their own KYC documents"
  ON public.kyc_documents FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- Users can insert their own KYC docs
CREATE POLICY "Users can insert their own KYC documents"
  ON public.kyc_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can update/manage all KYC docs
CREATE POLICY "Admins can manage all KYC documents"
  ON public.kyc_documents FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 7. Re-create clean RLS policies for user_documents (NDAs)
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

-- 8. Replace admin_update_kyc_status RPC with safe, robust implementation
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
  -- Verify caller is authenticated admin
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

  -- Update document in corresponding table
  IF source_table = 'user_documents' THEN
    UPDATE public.user_documents 
    SET status = new_status, updated_at = now() 
    WHERE id = doc_id;
    -- Note: We intentionally DO NOT alter profiles.kyc_status here!
    -- An NDA is a service agreement, distinct from identity verification.
  ELSIF source_table = 'kyc_documents' THEN
    UPDATE public.kyc_documents 
    SET status = new_status, updated_at = now() 
    WHERE id = doc_id;
    
    -- Only update profiles.kyc_status for identity documents
    IF new_status IN ('approved', 'rejected', 'pending') THEN
      UPDATE public.profiles 
      SET kyc_status = new_status 
      WHERE id = target_user_id;
    END IF;
  ELSE
    RAISE EXCEPTION 'Invalid document source table: %', source_table;
  END IF;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_kyc_status(UUID, UUID, TEXT, TEXT) TO authenticated;
