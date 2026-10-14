-- =========================================================================
-- TRACEFIELD COMPLIANCE: UNVERIFY ACCOUNT (vroommaybach@gmail.com)
-- =========================================================================
-- This script resets vroommaybach@gmail.com and clears any pending documents
-- so your admin compliance queue tests cleanly:
--   - 0 pending when no accounts are awaiting review
--   - 1 pending when Account 1 (e.g. vroommaybach@gmail.com) submits live KYC
--   - 2 pending when Account 2 (e.g. michaeldane1812@gmail.com) submits live KYC
-- =========================================================================

-- STEP 1: Check what is currently pending in your database
SELECT 'profiles' AS table_source, id, email, kyc_status 
FROM public.profiles 
WHERE kyc_status = 'pending'
UNION ALL
SELECT 'kyc_documents', k.id, p.email, k.status 
FROM public.kyc_documents k 
LEFT JOIN public.profiles p ON p.id = k.user_id 
WHERE k.status = 'pending'
UNION ALL
SELECT 'user_documents (NDAs)', u.id, p.email, u.status 
FROM public.user_documents u 
LEFT JOIN public.profiles p ON p.id = u.user_id 
WHERE u.status = 'pending';

-- =========================================================================
-- STEP 2: Unverify vroommaybach@gmail.com
-- =========================================================================
-- 1. Reset profile KYC status back to 'unverified'
UPDATE public.profiles
SET kyc_status = 'unverified'
WHERE email = 'vroommaybach@gmail.com';

-- 2. Clear any old photographic records to allow fresh live camera capture
DELETE FROM public.kyc_documents
WHERE user_id IN (SELECT id FROM public.profiles WHERE email = 'vroommaybach@gmail.com');

-- 3. Set pending NDA status to 'approved' so it doesn't inflate the pending count
UPDATE public.user_documents
SET status = 'approved'
WHERE user_id IN (SELECT id FROM public.profiles WHERE email = 'vroommaybach@gmail.com')
  AND status = 'pending';

-- =========================================================================
-- STEP 3 (OPTIONAL): Reset Michael Dean (michaeldane1812@gmail.com)
-- =========================================================================
-- If you want Michael Dean to also start from an unverified baseline:
UPDATE public.profiles
SET kyc_status = 'unverified'
WHERE email = 'michaeldane1812@gmail.com';

DELETE FROM public.kyc_documents
WHERE user_id IN (SELECT id FROM public.profiles WHERE email = 'michaeldane1812@gmail.com');

UPDATE public.user_documents
SET status = 'approved'
WHERE user_id IN (SELECT id FROM public.profiles WHERE email = 'michaeldane1812@gmail.com')
  AND status = 'pending';

-- =========================================================================
-- STEP 4: Confirm that all pending queues are now at 0
-- =========================================================================
SELECT 
  (SELECT COUNT(*) FROM public.kyc_documents WHERE status = 'pending') AS pending_kyc,
  (SELECT COUNT(*) FROM public.user_documents WHERE status = 'pending') AS pending_ndas,
  (SELECT COUNT(*) FROM public.profiles WHERE kyc_status = 'pending') AS pending_profiles;
-- All 3 counts will now be 0.
