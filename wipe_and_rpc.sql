-- 1. ADD FREEZE FEATURE TO PROFILES
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_frozen BOOLEAN DEFAULT false;

-- 2. CREATE STREAMLINED ADMIN BALANCE MANAGER RPC
CREATE OR REPLACE FUNCTION admin_update_balance(
  p_admin_id UUID,
  p_user_id UUID,
  p_action TEXT, -- 'credit', 'debit', 'set', 'clear'
  p_usd_amount NUMERIC,
  p_asset TEXT, -- 'USD', 'BTC', etc.
  p_crypto_qty NUMERIC,
  p_reason TEXT
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_admin_role TEXT;
  v_user_total NUMERIC;
  v_user_fiat NUMERIC;
  v_new_total NUMERIC;
  v_new_fiat NUMERIC;
  v_tx_id UUID;
  v_portfolio_id UUID;
  v_old_crypto NUMERIC;
  v_new_crypto NUMERIC;
  v_tx_type TEXT;
  v_tx_amount_str TEXT;
BEGIN
  -- 1. Verify Admin
  SELECT role INTO v_admin_role FROM profiles WHERE id = p_admin_id;
  IF v_admin_role != 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can manage balances.';
  END IF;

  -- 2. Lock and get user profile
  SELECT total_balance, fiat_balance INTO v_user_total, v_user_fiat 
  FROM profiles WHERE id = p_user_id FOR UPDATE;

  IF v_user_total IS NULL THEN
    RAISE EXCEPTION 'User profile not found.';
  END IF;

  v_user_total := COALESCE(v_user_total, 0);
  v_user_fiat := COALESCE(v_user_fiat, 0);

  -- 3. Calculate New Balances
  IF p_action = 'credit' THEN
    v_new_total := v_user_total + p_usd_amount;
    v_tx_type := 'deposit';
    v_tx_amount_str := '+$' || p_usd_amount::TEXT;
    IF p_asset != 'USD' THEN
      v_tx_amount_str := '+' || p_crypto_qty::TEXT || ' ' || p_asset;
    END IF;
  ELSIF p_action = 'debit' THEN
    v_new_total := GREATEST(0, v_user_total - p_usd_amount);
    v_tx_type := 'withdrawal';
    v_tx_amount_str := '-$' || p_usd_amount::TEXT;
    IF p_asset != 'USD' THEN
      v_tx_amount_str := '-' || p_crypto_qty::TEXT || ' ' || p_asset;
    END IF;
  ELSIF p_action = 'set' THEN
    v_new_total := GREATEST(0, p_usd_amount);
    v_tx_type := 'deposit'; -- Classify manual override as system deposit/correction
    v_tx_amount_str := 'Set to $' || p_usd_amount::TEXT;
  ELSIF p_action = 'clear' THEN
    v_new_total := 0;
    v_tx_type := 'withdrawal';
    v_tx_amount_str := 'Balance Cleared';
  ELSE
    RAISE EXCEPTION 'Invalid action. Must be credit, debit, set, or clear.';
  END IF;

  v_new_fiat := v_user_fiat;

  -- 4. Handle Fiat vs Crypto logic
  IF p_asset = 'USD' THEN
    IF p_action = 'credit' THEN v_new_fiat := v_user_fiat + p_usd_amount;
    ELSIF p_action = 'debit' THEN v_new_fiat := GREATEST(0, v_user_fiat - p_usd_amount);
    ELSIF p_action = 'set' THEN v_new_fiat := p_usd_amount;
    ELSIF p_action = 'clear' THEN v_new_fiat := 0;
    END IF;
  ELSE
    -- Handle Crypto Portfolio
    SELECT id, balance INTO v_portfolio_id, v_old_crypto FROM portfolios WHERE user_id = p_user_id AND symbol = p_asset LIMIT 1;
    v_old_crypto := COALESCE(v_old_crypto, 0);
    
    IF p_action = 'credit' THEN v_new_crypto := v_old_crypto + p_crypto_qty;
    ELSIF p_action = 'debit' THEN v_new_crypto := GREATEST(0, v_old_crypto - p_crypto_qty);
    ELSIF p_action = 'set' THEN v_new_crypto := p_crypto_qty;
    ELSIF p_action = 'clear' THEN v_new_crypto := 0;
    END IF;

    IF v_portfolio_id IS NOT NULL THEN
      UPDATE portfolios SET balance = v_new_crypto, value = v_new_crypto * (p_usd_amount / NULLIF(p_crypto_qty, 0)) WHERE id = v_portfolio_id;
    ELSE
      IF v_new_crypto > 0 THEN
        INSERT INTO portfolios (user_id, symbol, name, balance, value, change_24h)
        VALUES (p_user_id, p_asset, p_asset, v_new_crypto, p_usd_amount, 0);
      END IF;
    END IF;
  END IF;

  IF p_action = 'clear' THEN
    -- If clear is called, wipe all crypto balances too
    UPDATE portfolios SET balance = 0, value = 0 WHERE user_id = p_user_id;
    UPDATE assets SET balance = 0, value = 0 WHERE user_id = p_user_id;
  END IF;

  -- 5. Update Profile
  UPDATE profiles SET total_balance = v_new_total, fiat_balance = v_new_fiat WHERE id = p_user_id;

  -- 6. Insert Transaction Record
  INSERT INTO transactions (user_id, type, amount, value_usd, asset, status, created_at)
  VALUES (
    p_user_id, 
    v_tx_type, 
    v_tx_amount_str, 
    p_usd_amount, 
    p_asset, 
    'completed - ' || COALESCE(p_reason, 'System Update'), 
    NOW()
  );

  -- 7. Insert Notification
  INSERT INTO notifications (user_id, type, title, message, is_read, created_at)
  VALUES (
    p_user_id,
    'system',
    'Balance Update',
    'Your account balance was updated. ' || v_tx_amount_str || ' (' || COALESCE(p_reason, 'System Action') || ')',
    false,
    NOW()
  );

  RETURN jsonb_build_object('success', true, 'new_total', v_new_total);
END;
$$;
