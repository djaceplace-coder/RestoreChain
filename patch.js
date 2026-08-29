const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/Agreement.tsx', 'utf8');
code = code.replace(/      if \(docError\) \{[\s\S]*?      \}[\s\S]*?      setAgreementStatus\('pending'\);/m, 
`      if (docError) {
        console.error("Doc Error:", docError);
        setErrorMsg("Database Error (user_documents): " + docError.message);
        setSubmitting(false);
        return;
      }
      setAgreementStatus('pending');`);
fs.writeFileSync('src/pages/dashboard/Agreement.tsx', code);
