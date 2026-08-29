const fs = require('fs');
let content = fs.readFileSync('src/pages/Terms.tsx', 'utf8');
content = content.replace(
  '<p className="mb-6">If you have any questions or concerns about these terms of service, please contact our legal team.</p>',
  '<p className="mb-6">If you have any questions or concerns about these terms of service, please contact our legal team at <strong>info@tracefield.co.uk</strong> or write to us at our London, UK office.</p>'
);
fs.writeFileSync('src/pages/Terms.tsx', content);
