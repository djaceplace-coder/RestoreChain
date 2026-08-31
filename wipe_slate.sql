-- =========================================================================================
-- WIPE SLATE SCRIPT (CLEAN ALL USERS, BALANCES, TRANSACTIONS, NOTIFICATIONS, SUPPORT)
-- =========================================================================================

-- WARNING: This will delete ALL users including admins.
-- You will need to sign up again and set your role to 'admin' in the profiles table.

DELETE FROM auth.users;

-- If for any reason foreign keys didn't cascade (they usually do), run these safely:
TRUNCATE TABLE profiles CASCADE;
TRUNCATE TABLE portfolios CASCADE;
TRUNCATE TABLE assets CASCADE;
TRUNCATE TABLE transactions CASCADE;
TRUNCATE TABLE notifications CASCADE;
TRUNCATE TABLE support_tickets CASCADE;
TRUNCATE TABLE messages CASCADE;
TRUNCATE TABLE wallets CASCADE;
TRUNCATE TABLE wallet_connections CASCADE;

-- Reset sequences if any exist (usually UUIDs are used, but just in case)
-- No sequences used typically in this project for primary keys.

-- Output success
SELECT 'All users and data have been wiped successfully. Please sign up to create a new Admin account.' as status;
