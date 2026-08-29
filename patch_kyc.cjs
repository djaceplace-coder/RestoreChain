const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminKYC.tsx', 'utf8');

content = content.replace(
`  const fetchDocuments = async () => {
    // We want to fetch pending documents first, and we need the user's email/name from profiles
    // We can join the profiles table since user_documents has a foreign key to profiles(id)
    const { data, error } = await supabase
      .from('user_documents')
      .select('*, profiles(email, first_name, last_name)')
      .order('created_at', { ascending: false });

    if (data) {
      setDocuments(data);
    }
    setLoading(false);
  };`,
`  const fetchDocuments = async () => {
    // We want to fetch pending documents first, and we need the user's email/name from profiles
    // We can join the profiles table since user_documents has a foreign key to profiles(id)
    const { data: ndaData } = await supabase
      .from('user_documents')
      .select('*, profiles(email, first_name, last_name)')
      .order('created_at', { ascending: false });

    if (ndaData) {
      setDocuments(ndaData);
    }
    
    const { data: kycData } = await supabase
      .from('kyc_documents')
      .select('*, profiles(email, first_name, last_name)')
      .order('created_at', { ascending: false });
      
    if (kycData) {
      setKycDocs(kycData);
    }

    setLoading(false);
  };`
);

fs.writeFileSync('src/pages/admin/AdminKYC.tsx', content);
console.log('patched');
