-- Run this in the Supabase SQL Editor to wipe all user balances and transaction history

-- 1. Reset Profile Balances
UPDATE profiles
SET total_balance = 0, fiat_balance = 0;

-- 2. Delete all records in balance-dependent tables
TRUNCATE TABLE portfolios RESTART IDENTITY CASCADE;
TRUNCATE TABLE transactions RESTART IDENTITY CASCADE;
TRUNCATE TABLE reconciliation_issues RESTART IDENTITY CASCADE;

-- (Optional) If you also want to wipe tax reports and notifications:
-- TRUNCATE TABLE notifications RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE tax_reports RESTART IDENTITY CASCADE;
