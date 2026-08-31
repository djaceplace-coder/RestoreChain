const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminUserDetail.tsx', 'utf8');

const oldPortUpdate1 = `        if (portData) {
          await supabase.from('portfolios').update({ balance: newCrypto, value: newCrypto * (finalUsdAmount / (finalCryptoQty || 1)) }).eq('id', portData.id);
        } else if (newCrypto > 0) {
          await supabase.from('portfolios').insert({ user_id: id, symbol: assetSymbol, name: assetSymbol, balance: newCrypto, value: finalUsdAmount, change_24h: 0 });
        }`;

const newPortUpdate1 = `        if (portData) {
          const { error: pErr } = await supabase.from('portfolios').update({ balance: newCrypto, value: newCrypto * (finalUsdAmount / (finalCryptoQty || 1)) }).eq('id', portData.id);
          if (pErr) console.warn("Portfolio update error:", pErr);
        } else if (newCrypto > 0) {
          const { error: pErr } = await supabase.from('portfolios').insert({ user_id: id, symbol: assetSymbol, name: assetSymbol, balance: newCrypto, value: finalUsdAmount, change_24h: 0 });
          if (pErr) console.warn("Portfolio insert error:", pErr);
        }`;

content = content.replace(oldPortUpdate1, newPortUpdate1);

const oldPortUpdate2 = `      if (txAction === 'clear') {
        await supabase.from('portfolios').update({ balance: 0, value: 0 }).eq('user_id', id);
      }`;

const newPortUpdate2 = `      if (txAction === 'clear') {
        const { error: cErr } = await supabase.from('portfolios').update({ balance: 0, value: 0 }).eq('user_id', id);
        if (cErr) console.warn("Clear portfolios error:", cErr);
      }`;

content = content.replace(oldPortUpdate2, newPortUpdate2);

fs.writeFileSync('src/pages/admin/AdminUserDetail.tsx', content);
console.log("AdminUserDetail try/catch added for portfolios");
