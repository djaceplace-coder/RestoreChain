const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminUserDetail.tsx', 'utf8');
content = content.replace('MinusCircle', 'MinusCircle, Trash2');
fs.writeFileSync('src/pages/admin/AdminUserDetail.tsx', content);
