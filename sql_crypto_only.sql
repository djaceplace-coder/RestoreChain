-- 1. Clean up the old functions to avoid conflicts
DROP FUNCTION IF EXISTS public.admin_update_user_balance CASCADE;
DROP FUNCTION IF EXISTS public.admin_update_user_balance_v2 CASCADE;
DROP FUNCTION IF EXISTS public.admin_provision_btc CASCADE;

-- 2. Create the streamlined Crypto-only Admin Provisioning function
CREATE OR REPLACE FUNCTION public.admin_provision_btc(
  p_user_id UUID,
  p_action TEXT, -- 'add', 'deduct', 'clear'
  p_btc_amount NUMERIC, 
  p_usd_value NUMERIC, -- The USD equivalent for logging & total_balance
  p_tx_date TIMESTAMPTZ,
  p_narration TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_current_btc NUMERIC := 0;
  v_new_btc NUMERIC;
  v_tx_type TEXT;
BEGIN
  -- Security Check: Guarantee caller is an admin
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role::text = 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can perform balance updates';
  END IF;

  -- Fetch existing BTC balance
  SELECT COALESCE(balance, 0) 
  INTO v_current_btc
  FROM public.portfolios WHERE user_id = p_user_id AND symbol = 'BTC';

  -- Process Math and Determine Final Balance
  IF p_action = 'add' THEN
    v_new_btc := v_current_btc + p_btc_amount;
    v_tx_type := 'Deposit';
  ELSIF p_action = 'deduct' THEN
    v_new_btc := GREATEST(0, v_current_btc - p_btc_amount);
    v_tx_type := 'Withdrawal';
  ELSIF p_action = 'clear' THEN
    v_new_btc := 0;
    v_tx_type := 'Withdrawal';
    p_btc_amount := v_current_btc; -- Log what was actually cleared
  ELSE 
    RAISE EXCEPTION 'Invalid action.'; 
  END IF;

  -- Update or Insert Portfolio for BTC
  IF EXISTS (SELECT 1 FROM public.portfolios WHERE user_id = p_user_id AND symbol = 'BTC') THEN
    UPDATE public.portfolios SET balance = v_new_btc, value = p_usd_value, updated_at = NOW() WHERE user_id = p_user_id AND symbol = 'BTC';
  ELSE
    IF v_new_btc > 0 THEN
      INSERT INTO public.portfolios (user_id, name, symbol, balance, value) VALUES (p_user_id, 'Bitcoin', 'BTC', v_new_btc, p_usd_value);
    END IF;
  END IF;
  
  -- Update the Total Balance on the Profile to reflect the latest injected USD value
  -- (This helps the Admin UI show a quick glance total balance)
  UPDATE public.profiles SET total_balance = p_usd_value WHERE id = p_user_id;

  -- Transaction Record for Crypto (Log it as USD so it displays cleanly in the UI)
  IF p_btc_amount > 0 THEN
     INSERT INTO public.transactions (user_id, type, asset, amount, value_usd, status, tx_date, created_at)
     VALUES (
       p_user_id, 
       v_tx_type, 
       'BTC', 
       p_btc_amount, 
       p_usd_value, 
       'Completed - ' || p_narration, 
       COALESCE(p_tx_date, NOW()), 
       NOW()
     );
  END IF;

  -- Real-Time User Notification Push
  INSERT INTO public.notifications (user_id, type, title, message, is_read)
  VALUES (
    p_user_id, 
    'system', 
    'BTC Balance Update', 
    'Your crypto portfolio was updated. Reason: ' || COALESCE(p_narration, 'System Update'), 
    false
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
