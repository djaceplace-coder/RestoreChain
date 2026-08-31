const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminUserDetail.tsx', 'utf8');

content = content.replace(
  `      console.error("System Update Error:", err);
      setUpdateStatus(\`Error: \${err.message}\`);
      setTimeout(() => setUpdateStatus(''), 4000);`,
  `      console.error("System Update Error:", err);
      if (err.message && err.message.includes('function admin_update_balance does not exist')) {
        alert("CRITICAL ERROR: The database function 'admin_update_balance' is missing! You MUST run the provided SQL script in your Supabase SQL Editor to enable balance updates.");
      } else {
        alert("System Update Error: " + err.message);
      }
      setUpdateStatus(\`Error: \${err.message}\`);`
);

fs.writeFileSync('src/pages/admin/AdminUserDetail.tsx', content);
console.log("Updated.");
