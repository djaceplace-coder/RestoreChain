const fs = require('fs');
let file = fs.readFileSync('sql_crypto_only.sql', 'utf8');

file = file.replace(
  /UPDATE public\.portfolios SET balance = v_new_btc, updated_at = NOW\(\) WHERE user_id = p_user_id AND symbol = 'BTC';/g,
  "UPDATE public.portfolios SET balance = v_new_btc, value = p_usd_value, updated_at = NOW() WHERE user_id = p_user_id AND symbol = 'BTC';"
);

fs.writeFileSync('sql_crypto_only.sql', file);
console.log('Fixed sql_crypto_only.sql again');
