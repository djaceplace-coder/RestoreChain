const fs = require('fs');

let adminDetail = fs.readFileSync('src/pages/admin/AdminUserDetail.tsx', 'utf8');

adminDetail = adminDetail.replace(`    const { error } = await supabase.from('wallets').insert({
      user_id: id,
      address: walletAddress,
      network: walletNetwork,
      label: walletLabel,
      balance: Number(walletBalance),
      status: 'active'
    });`, `    const { error } = await supabase.from('wallets').insert({
      user_id: id,
      address_or_key: walletAddress,
      type: walletNetwork,
      name: walletLabel || walletNetwork + ' Wallet',
      balance: Number(walletBalance),
      status: 'active'
    });`);

fs.writeFileSync('src/pages/admin/AdminUserDetail.tsx', adminDetail);
console.log("Fixed AdminUserDetail wallet insert!");
