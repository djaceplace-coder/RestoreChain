const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminUserDetail.tsx', 'utf8');

content = content.replace(
/const \[txAction, setTxAction\] = useState<'credit' \| 'debit'>\('credit'\);/,
"const [txAction, setTxAction] = useState<'credit' | 'debit' | 'set' | 'clear'>('credit');"
);

fs.writeFileSync('src/pages/admin/AdminUserDetail.tsx', content);
