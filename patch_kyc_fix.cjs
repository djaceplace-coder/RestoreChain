const fs = require('fs');
let content = fs.readFileSync('src/components/KYCModal.tsx', 'utf8');

content = content.replace(/\| "environment">.*?\n/, '');

fs.writeFileSync('src/components/KYCModal.tsx', content);
