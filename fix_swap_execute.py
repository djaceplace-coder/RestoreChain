import os
import re

path = 'src/pages/dashboard/Swap.tsx'
with open(path, 'r') as f:
    content = f.read()

replacement = """      // Deduct Pay Token
      if (payToken.id === 'fiat') {
        const currentFiat = Number(userProfile?.fiat_balance || 0);
        await supabase.from('profiles').update({ fiat_balance: Math.max(0, currentFiat - payTokenQty) }).eq('id', user.id);
      } else {
        const existingPay = userPortfolios.find(a => a.symbol.toUpperCase() === payToken.symbol.toUpperCase());
        if (existingPay && existingPay.balance >= payTokenQty) {
          const { error: pErr } = await supabase.from('portfolios').update({
            balance: Math.max(0, existingPay.balance - payTokenQty),
            value: Math.max(0, existingPay.value - payUsdVal)
          }).eq('id', existingPay.id);
          if (pErr) {
            await supabase.from('assets').update({
              balance: Math.max(0, existingPay.balance - payTokenQty),
              value: Math.max(0, existingPay.value - payUsdVal)
            }).eq('id', existingPay.id);
          }
        }
      }

      // Add Receive Token
      if (receiveToken.id === 'fiat') {
        const currentFiat = Number(userProfile?.fiat_balance || 0);
        await supabase.from('profiles').update({ fiat_balance: currentFiat + receiveTokenQty }).eq('id', user.id);
      } else {
        const existingReceive = userPortfolios.find(a => a.symbol.toUpperCase() === receiveToken.symbol.toUpperCase());
        if (existingReceive) {
          const { error: pErr } = await supabase.from('portfolios').update({
            balance: (Number(existingReceive.balance) || 0) + receiveTokenQty,
            value: (Number(existingReceive.value) || 0) + netReceiveUsd
          }).eq('id', existingReceive.id);
          if (pErr) {
            await supabase.from('assets').update({
              balance: (Number(existingReceive.balance) || 0) + receiveTokenQty,
              value: (Number(existingReceive.value) || 0) + netReceiveUsd
            }).eq('id', existingReceive.id);
          }
        } else {
          const portfolioPayload = {
            user_id: user.id,
            name: receiveToken.name,
            symbol: receiveToken.symbol,
            balance: receiveTokenQty,
            value: netReceiveUsd,
            color: receiveToken.iconBg
          };
          const { error: pErr } = await supabase.from('portfolios').insert(portfolioPayload);
          if (pErr) {
            await supabase.from('assets').insert(portfolioPayload);
          }
        }
      }"""

content = re.sub(r'// Update Pay portfolio item if present[\s\S]*?await supabase\.from\(\'assets\'\)\.insert\(portfolioPayload\);\s*\}\s*\}', replacement, content)

with open(path, 'w') as f:
    f.write(content)
