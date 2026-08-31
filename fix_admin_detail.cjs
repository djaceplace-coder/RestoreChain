const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/AdminUserDetail.tsx', 'utf8');

// Replace the RPC call with a direct implementation
const oldFunction = `      const { data, error } = await supabase.rpc('admin_update_balance', {
        p_admin_id: adminUser.user.id,
        p_user_id: id,
        p_action: txAction, // 'credit', 'debit', 'set', 'clear'
        p_usd_amount: finalUsdAmount,
        p_asset: assetSymbol,
        p_crypto_qty: finalCryptoQty,
        p_reason: deductionReason || \`Admin \${txAction} via dashboard\`
      });

      if (error) throw error;`;

const newFunction = `
      // 1. Fetch user current balances
      const { data: profile, error: profileErr } = await supabase.from('profiles').select('total_balance, fiat_balance').eq('id', id).single();
      if (profileErr) throw new Error("Could not fetch user profile: " + profileErr.message);

      const currentTotal = Number(profile.total_balance) || 0;
      const currentFiat = Number(profile.fiat_balance) || 0;

      let newTotal = currentTotal;
      let newFiat = currentFiat;
      let newCrypto = 0;
      
      let txType = 'Deposit';
      let txAmount = assetSymbol === 'USD' ? finalUsdAmount : finalCryptoQty;

      // Calculate logic
      if (txAction === 'credit') {
        newTotal += finalUsdAmount;
        if (assetSymbol === 'USD') newFiat += finalUsdAmount;
      } else if (txAction === 'debit') {
        newTotal = Math.max(0, newTotal - finalUsdAmount);
        if (assetSymbol === 'USD') newFiat = Math.max(0, newFiat - finalUsdAmount);
        txType = 'Withdrawal';
      } else if (txAction === 'set') {
        newTotal = finalUsdAmount;
        if (assetSymbol === 'USD') newFiat = finalUsdAmount;
      } else if (txAction === 'clear') {
        newTotal = 0;
        newFiat = 0;
        txType = 'Withdrawal';
        txAmount = currentTotal;
      }

      // Update portfolios if crypto
      if (assetSymbol !== 'USD') {
        const { data: portData } = await supabase.from('portfolios').select('id, balance, value').eq('user_id', id).eq('symbol', assetSymbol).maybeSingle();
        const oldCrypto = portData ? Number(portData.balance) || 0 : 0;
        
        if (txAction === 'credit') newCrypto = oldCrypto + finalCryptoQty;
        else if (txAction === 'debit') newCrypto = Math.max(0, oldCrypto - finalCryptoQty);
        else if (txAction === 'set') newCrypto = finalCryptoQty;
        else if (txAction === 'clear') newCrypto = 0;

        if (portData) {
          await supabase.from('portfolios').update({ balance: newCrypto, value: newCrypto * (finalUsdAmount / (finalCryptoQty || 1)) }).eq('id', portData.id);
        } else if (newCrypto > 0) {
          await supabase.from('portfolios').insert({ user_id: id, symbol: assetSymbol, name: assetSymbol, balance: newCrypto, value: finalUsdAmount, change_24h: 0 });
        }
      }

      if (txAction === 'clear') {
        await supabase.from('portfolios').update({ balance: 0, value: 0 }).eq('user_id', id);
      }

      // 2. Update Profile
      const { error: updateErr } = await supabase.from('profiles').update({ total_balance: newTotal, fiat_balance: newFiat }).eq('id', id);
      if (updateErr) throw new Error("Failed to update profile: " + updateErr.message);

      // 3. Insert Transaction Ledger
      const { error: txErr } = await supabase.from('transactions').insert({
        user_id: id,
        type: txType,
        amount: txAmount,
        value_usd: finalUsdAmount,
        asset: assetSymbol,
        status: 'Completed - ' + (deductionReason || 'System Update')
      });
      if (txErr) console.warn("Failed to insert transaction log (non-fatal):", txErr.message);

      // 4. Send Notification
      await supabase.from('notifications').insert({
        user_id: id,
        type: 'system',
        title: 'Balance Update',
        message: \`Your account balance was updated by \${finalUsdAmount} (\${deductionReason || 'System Action'})\`,
        is_read: false
      });
`;

content = content.replace(oldFunction, newFunction);

// Remove the old alert logic we injected previously, keep a clean alert
const oldAlert = `      if (err.message && err.message.includes('function admin_update_balance does not exist')) {
        alert("CRITICAL ERROR: The database function 'admin_update_balance' is missing! You MUST run the provided SQL script in your Supabase SQL Editor to enable balance updates.");
      } else {
        if (err.message.includes('has no field "updated_at"')) {
          alert("CRITICAL ERROR: A database trigger is trying to update an 'updated_at' column that doesn't exist on the portfolios table. Please run the SQL patch provided in the chat.");
        } else {
          alert("System Update Error: " + err.message);
        }
      }`;

content = content.replace(oldAlert, `      alert("System Update Error: " + (err.message || err));`);

fs.writeFileSync('src/pages/admin/AdminUserDetail.tsx', content);
console.log("AdminUserDetail updated.");
