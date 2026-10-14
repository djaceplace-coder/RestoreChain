-- =========================================================================
-- TRACEFIELD COMPLIANCE: SUSPEND & REQUEST KYC / NDA ATOMIC FUNCTIONS
-- =========================================================================
-- Run this in your Supabase SQL Editor (SQL Editor -> New Query -> Run)
--
-- Adds two atomic functions with SECURITY DEFINER to cleanly manage:
-- 1. admin_suspend_and_request_kyc(target_user_id, reason)
-- 2. admin_suspend_and_request_nda(target_user_id, reason)
-- =========================================================================

-- 1. Suspend & Request KYC Re-verification
CREATE OR REPLACE FUNCTION public.admin_suspend_and_request_kyc(
  target_user_id UUID,
  reason TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
BEGIN
  -- 1. Suspend account and set kyc_status to unverified
  UPDATE public.profiles
  SET 
    account_status = 'suspended',
    kyc_status = 'unverified',
    updated_at = now()
  WHERE id = target_user_id;

  -- 2. Clear old KYC photographic documents so user can snap clean fresh photos
  DELETE FROM public.kyc_documents
  WHERE user_id = target_user_id;

  -- 3. Insert high-priority compliance notification
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
    'Compliance Hold: Identity Re-Verification Required',
    COALESCE(
      reason, 
      'Your account has been temporarily placed on compliance hold pending photographic identity re-verification. Please submit fresh live photos with your camera to restore account access.'
    ),
    false,
    now()
  );
END;
$$;

-- 2. Suspend & Request NDA Execution
CREATE OR REPLACE FUNCTION public.admin_suspend_and_request_nda(
  target_user_id UUID,
  reason TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
BEGIN
  -- 1. Suspend account
  UPDATE public.profiles
  SET 
    account_status = 'suspended',
    updated_at = now()
  WHERE id = target_user_id;

  -- 2. Mark previous agreements as rejected so user is prompted to sign again
  UPDATE public.user_documents
  SET 
    status = 'rejected',
    updated_at = now()
  WHERE user_id = target_user_id 
    AND document_type = 'terms_agreement';

  -- 3. Insert compliance notification
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
    'Compliance Hold: Master Agreement / NDA Signing Required',
    COALESCE(
      reason, 
      'Your account has been placed on hold pending updated execution of your Master Services Agreement & Mutual NDA. Please navigate to Agreement (NDA) to sign.'
    ),
    false,
    now()
  );
END;
$$;

-- Grant execution privileges
GRANT EXECUTE ON FUNCTION public.admin_suspend_and_request_kyc(UUID, TEXT) TO authenticated, service_role, anon;
GRANT EXECUTE ON FUNCTION public.admin_suspend_and_request_nda(UUID, TEXT) TO authenticated, service_role, anon;
