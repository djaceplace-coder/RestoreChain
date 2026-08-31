const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminUserDetail.tsx', 'utf8');
content = content.replace("kyc_documents", "user_documents");
fs.writeFileSync('src/pages/admin/AdminUserDetail.tsx', content);
