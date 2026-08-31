const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminUserDetail.tsx', 'utf8');

content = content.replace(
  `alert("System Update Error: " + err.message);`,
  `if (err.message.includes('has no field "updated_at"')) {
          alert("CRITICAL ERROR: A database trigger is trying to update an 'updated_at' column that doesn't exist on the portfolios table. Please run the SQL patch provided in the chat.");
        } else {
          alert("System Update Error: " + err.message);
        }`
);

fs.writeFileSync('src/pages/admin/AdminUserDetail.tsx', content);
console.log("Updated.");
