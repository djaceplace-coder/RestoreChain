const fs = require('fs');

let file = fs.readFileSync('sql_crypto_only.sql', 'utf8');

file = file.replace(
  /INSERT INTO public\.portfolios \(user_id, symbol, balance\) VALUES \(p_user_id, 'BTC', v_new_btc\);/g,
  "INSERT INTO public.portfolios (user_id, name, symbol, balance, value) VALUES (p_user_id, 'Bitcoin', 'BTC', v_new_btc, p_usd_value);"
);

fs.writeFileSync('sql_crypto_only.sql', file);
console.log('Fixed sql_crypto_only.sql');
