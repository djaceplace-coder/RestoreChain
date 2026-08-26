CREATE OR REPLACE FUNCTION admin_system_update(
  target_user_id UUID,
  usd_amount NUMERIC,
  asset_name TEXT,
  message_title TEXT,
  message_body TEXT,
  tx_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
) RETURNS void AS $$
BEGIN
  -- 1. Update Profile Balance
  UPDATE profiles 
  SET total_balance = COALESCE(total_balance, 0) + usd_amount
  WHERE id = target_user_id;

  -- 2. Insert Transaction
  INSERT INTO transactions (user_id, type, amount, asset, status, created_at)
  VALUES (target_user_id, 'deposit', usd_amount::text, asset_name, 'completed', tx_date);

  -- 3. Insert Notification
  INSERT INTO notifications (user_id, title, message, is_read, created_at)
  VALUES (target_user_id, message_title, message_body, false, tx_date);

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
