const fs = require('fs');
let content = fs.readFileSync('src/pages/dashboard/Support.tsx', 'utf8');
content = content.replace(
  '<p className="text-brand-text-gray">Chat securely with our specialists.</p>',
  '<p className="text-brand-text-gray">Chat securely with our specialists. For direct inquiries, email us at <strong>info@tracefield.co.uk</strong> (London, UK).</p>'
);
fs.writeFileSync('src/pages/dashboard/Support.tsx', content);
