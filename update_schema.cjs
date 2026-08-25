const fs = require('fs');
let code = fs.readFileSync('supabase-schema.sql', 'utf8');

// I'll replace the old function block at the bottom
const oldBlock = `DROP FUNCTION IF EXISTS admin_system_update(uuid, numeric, text, text, text, date) CASCADE;
DROP FUNCTION IF EXISTS admin_system_update CASCADE; 

CREATE OR REPLACE FUNCTION admin_system_update(`;

if (code.includes(oldBlock)) {
    // Just remove everything from the first DROP FUNCTION to the end, then append the new one.
    const parts = code.split('DROP FUNCTION IF EXISTS admin_system_update(uuid, numeric, text, text, text, date) CASCADE;');
    code = parts[0];
}

code += `
-- C. Admin System Update Function (Provisions funds and records transaction)
-- 1. Ensure the column exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_balance NUMERIC DEFAULT 0;

-- 2. Recalculate total_balance for all users based on their current wallet balances
UPDATE public.profiles p
SET total_balance = (
  SELECT COALESCE(SUM(balance), 0)
  FROM public.wallets w
  WHERE w.user_id = p.id
);

-- 3. Drop old functions
DROP FUNCTION IF EXISTS admin_system_update(uuid, numeric, text, text, text, date) CASCADE;
DROP FUNCTION IF EXISTS admin_system_update CASCADE; 

-- 4. Recreate the function to update BOTH the wallet AND the profile balance
CREATE OR REPLACE FUNCTION admin_system_update(
  target_user_id UUID,
  usd_amount NUMERIC,
  asset_name TEXT,
  message_title TEXT,
  message_body TEXT,
  tx_date DATE
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_wallet_id UUID;
BEGIN
  -- Try to find an existing wallet for the user
  SELECT id INTO v_wallet_id FROM public.wallets WHERE user_id = target_user_id LIMIT 1;
  
  -- If no wallet exists, create a default system wallet
  IF v_wallet_id IS NULL THEN
    INSERT INTO public.wallets (user_id, name, type, status, balance)
    VALUES (target_user_id, 'System Wallet', 'Wallet', 'active', 0)
    RETURNING id INTO v_wallet_id;
  END IF;

  -- Add the balance to the wallet
  UPDATE public.wallets SET balance = COALESCE(balance, 0) + usd_amount WHERE id = v_wallet_id;

  -- ALSO update the total_balance on the user's profile so it shows up in the UI!
  UPDATE public.profiles SET total_balance = COALESCE(total_balance, 0) + usd_amount WHERE id = target_user_id;

  -- Create the transaction record
  INSERT INTO public.transactions (
    user_id, 
    wallet_id, 
    tx_hash, 
    type, 
    asset, 
    amount, 
    value_usd, 
    status, 
    tx_date
  ) VALUES (
    target_user_id,
    v_wallet_id,
    'SYS-' || gen_random_uuid(),
    'Deposit',
    asset_name,
    usd_amount,
    usd_amount, 
    'Completed',
    tx_date
  );

  -- Send the notification to the user
  INSERT INTO public.notifications (user_id, type, title, message)
  VALUES (target_user_id, 'system', message_title, message_body);

END;
$$;
`;

fs.writeFileSync('supabase-schema.sql', code);
