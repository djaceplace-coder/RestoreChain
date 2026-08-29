const fs = require('fs');
let content = fs.readFileSync('src/pages/dashboard/Transactions.tsx', 'utf8');

content = content.replace(
/tx\.value \|\| tx\.amount/g,
"tx.value_usd || tx.value || parseFloat(String(tx.amount).replace(/[^0-9.-]+/g, ''))"
);

fs.writeFileSync('src/pages/dashboard/Transactions.tsx', content);
console.log('patched Transactions.tsx');
