-- Run this in the Supabase SQL Editor to force everyone to redo KYC and NDA

-- 1. Reset all users' KYC status to unverified
UPDATE profiles
SET kyc_status = 'unverified';

-- 2. Clear all previously submitted KYC documents
TRUNCATE TABLE kyc_documents RESTART IDENTITY CASCADE;

-- 3. Clear all previously submitted NDA/Terms Agreement signatures
DELETE FROM user_documents WHERE document_type = 'terms_agreement';
