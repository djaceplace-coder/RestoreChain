const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminUserDetail.tsx', 'utf8');

const missingFunc = `
  const pushReconIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setReconStatus('Submitting...');
    
    const { error } = await supabase.from('reconciliation_issues').insert({
      user_id: id,
      issue_type: reconType,
      issue_desc: reconDesc,
      amount: reconAmount,
      asset: reconAsset,
      status: 'open'
    });

    if (error) {
      setReconStatus('Error: ' + error.message);
    } else {
      setReconStatus('Issue pushed successfully.');
      fetchUserAndData();
      setTimeout(() => setReconStatus(''), 3000);
    }
  };

`;

content = content.replace("const resolveReconIssue", missingFunc + "const resolveReconIssue");
fs.writeFileSync('src/pages/admin/AdminUserDetail.tsx', content);
console.log("Fixed pushReconIssue!");
