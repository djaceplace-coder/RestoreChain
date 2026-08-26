const fs = require('fs');
let content = fs.readFileSync('src/pages/dashboard/Agreement.tsx', 'utf8');

content = content.replace(
  `const signatureData = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');`,
  `const signatureData = sigCanvas.current.getCanvas().toDataURL('image/png');`
);

fs.writeFileSync('src/pages/dashboard/Agreement.tsx', content);
