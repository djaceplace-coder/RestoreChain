const fs = require('fs');
let content = fs.readFileSync('src/pages/Privacy.tsx', 'utf8');
content = content.replace(
  '<p className="mb-6">If you have any questions about this Privacy Policy, please contact our Data Protection Officer.</p>',
  '<p className="mb-6">If you have any questions about this Privacy Policy, please contact our Data Protection Officer at <strong>info@tracefield.co.uk</strong> or write to us at our London, UK office.</p>'
);
fs.writeFileSync('src/pages/Privacy.tsx', content);
