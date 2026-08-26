const fs = require('fs');
let content = fs.readFileSync('src/pages/ForgotPassword.tsx', 'utf8');
content = content.replace("redirectTo: \\`\\${window.location.origin}/reset-password\\`,", "redirectTo: `${window.location.origin}/reset-password`,");
fs.writeFileSync('src/pages/ForgotPassword.tsx', content);
