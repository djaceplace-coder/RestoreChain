const fs = require('fs');

// Fix Wallets.tsx
let wallets = fs.readFileSync('src/pages/dashboard/Wallets.tsx', 'utf8');
wallets = wallets.replace(`      address: newAddress,
      network: newNetwork,
      label: newLabel || newNetwork + ' Wallet',`, `      address_or_key: newAddress,
      type: 'Wallet',
      name: newLabel || newNetwork + ' Wallet',`);
wallets = wallets.replace(`{wallet.network.charAt(0)}`, `{wallet.name ? wallet.name.charAt(0).toUpperCase() : 'W'}`);
wallets = wallets.replace(`{wallet.label || wallet.network}`, `{wallet.name}`);
wallets = wallets.replace(`{wallet.address.substring(0,6)}...{wallet.address.substring(wallet.address.length-4)}`, `{wallet.address_or_key ? \`\${wallet.address_or_key.substring(0,6)}...\${wallet.address_or_key.substring(wallet.address_or_key.length-4)}\` : 'No address'}`);
fs.writeFileSync('src/pages/dashboard/Wallets.tsx', wallets);

// Fix Notifications.tsx
let notifs = fs.readFileSync('src/pages/dashboard/Notifications.tsx', 'utf8');
notifs = notifs.replaceAll('notif.read', 'notif.is_read');
notifs = notifs.replaceAll('notif.body', 'notif.message');
notifs = notifs.replaceAll(`{ read: true }`, `{ is_read: true }`);
notifs = notifs.replaceAll(`.eq('read', false)`, `.eq('is_read', false)`);
fs.writeFileSync('src/pages/dashboard/Notifications.tsx', notifs);
console.log('Fixed!');
