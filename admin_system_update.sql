-- 1. Drop the old function first to clear out the mismatched parameters
DROP FUNCTION IF EXISTS admin_system_update(uuid, numeric, text, text, text, date) CASCADE;
DROP FUNCTION IF EXISTS admin_system_update CASCADE; 

-- 2. Create the fixed function with the value_usd field
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
  -- 1. Try to find an existing wallet for the user
  SELECT id INTO v_wallet_id FROM public.wallets WHERE user_id = target_user_id LIMIT 1;
  
  -- 2. If no wallet exists, create a default system wallet
  IF v_wallet_id IS NULL THEN
    INSERT INTO public.wallets (user_id, name, type, status, balance)
    VALUES (target_user_id, 'System Wallet', 'Wallet', 'active', 0)
    RETURNING id INTO v_wallet_id;
  END IF;

  -- 3. Add the balance to the wallet
  UPDATE public.wallets SET balance = COALESCE(balance, 0) + usd_amount WHERE id = v_wallet_id;

  -- 4. Create the transaction record
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

  -- 5. Send the notification to the user
  INSERT INTO public.notifications (user_id, type, title, message)
  VALUES (target_user_id, 'system', message_title, message_body);

END;
$$;
