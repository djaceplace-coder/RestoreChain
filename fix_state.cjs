const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminUserDetail.tsx', 'utf8');
content = content.replace("useState('Transfer Out')", "useState('Account Adjustment')");
fs.writeFileSync('src/pages/admin/AdminUserDetail.tsx', content);
