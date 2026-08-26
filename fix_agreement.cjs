const fs = require('fs');
let content = fs.readFileSync('src/pages/dashboard/Agreement.tsx', 'utf8');

content = content.replace(
  `const [submitting, setSubmitting] = useState(false);`,
  `const [submitting, setSubmitting] = useState(false);\n  const [errorMsg, setErrorMsg] = useState('');`
);

const newSubmit = `  const handleSubmit = async () => {
    setErrorMsg('');
    if (sigCanvas.current?.isEmpty()) {
      setErrorMsg("Please provide your signature before submitting.");
      return;
    }
    
    setSubmitting(true);
    try {
      const signatureData = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
      
      // Create document record
      const { error: docError } = await supabase.from('user_documents').insert({
        user_id: user.id,
        document_type: 'terms_agreement',
        signature_data: signatureData,
        status: 'pending'
      });

      if (docError) {
        console.error("Doc Error:", docError);
        setErrorMsg("Database Error (user_documents): " + docError.message + ". Did you run the SQL script in Supabase?");
        setSubmitting(false);
        return;
      }

      // Update profile KYC status
      const { error: profileError } = await supabase.from('profiles').update({ kyc_status: 'pending' }).eq('id', user.id);
      
      if (profileError) {
        console.error("Profile Error:", profileError);
        setErrorMsg("Database Error (profiles): " + profileError.message + ". Did you run the SQL script in Supabase?");
        setSubmitting(false);
        return;
      }

      setKycStatus('pending');
    } catch (err: any) {
      console.error("Exception:", err);
      setErrorMsg("Unexpected Error: " + err.message);
    }
    setSubmitting(false);
  };`;

content = content.replace(/  const handleSubmit = async \(\) => \{[\s\S]*?setSubmitting\(false\);\n  \};/, newSubmit);

const errorUI = `              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-bold rounded-lg">
                  {errorMsg}
                </div>
              )}
              <div className="border-2 border-dashed border-gray-300`;
content = content.replace(`              <div className="border-2 border-dashed border-gray-300`, errorUI);

fs.writeFileSync('src/pages/dashboard/Agreement.tsx', content);
