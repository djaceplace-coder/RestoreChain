const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');
content = content.replace(
  '<p className="text-brand-text-gray mb-8 max-w-sm">\n              The premier digital asset recovery and blockchain forensic security platform.\n            </p>',
  '<p className="text-brand-text-gray mb-4 max-w-sm">\n              The premier digital asset recovery and blockchain forensic security platform.\n            </p>\n            <div className="mb-8">\n              <p className="text-brand-text-gray text-sm">Email: <a href="mailto:info@tracefield.co.uk" className="hover:text-brand-purple">info@tracefield.co.uk</a></p>\n              <p className="text-brand-text-gray text-sm">Location: London, UK</p>\n            </div>'
);
fs.writeFileSync('src/components/Footer.tsx', content);
