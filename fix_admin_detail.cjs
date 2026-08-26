const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminUserDetail.tsx', 'utf8');

// Add user_documents fetch logic
content = content.replace(
  `const [nfts, setNfts] = useState<any[]>([]);`,
  `const [nfts, setNfts] = useState<any[]>([]);\n  const [documents, setDocuments] = useState<any[]>([]);`
);

content = content.replace(
  `      // Fetch NFTs\n      const { data: userNfts } = await supabase.from('nfts').select('*').eq('user_id', id);\n      if (userNfts) setNfts(userNfts);`,
  `      // Fetch NFTs\n      const { data: userNfts } = await supabase.from('nfts').select('*').eq('user_id', id);\n      if (userNfts) setNfts(userNfts);\n      \n      // Fetch Documents\n      const { data: userDocs } = await supabase.from('user_documents').select('*').eq('user_id', id).order('created_at', { ascending: false });\n      if (userDocs) setDocuments(userDocs);`
);

// Add approve document function
const approveDocFunc = `
  const approveDocument = async (docId: string) => {
    await supabase.from('user_documents').update({ status: 'approved' }).eq('id', docId);
    await supabase.from('profiles').update({ kyc_status: 'approved' }).eq('id', id);
    // Refresh
    const { data: userDocs } = await supabase.from('user_documents').select('*').eq('user_id', id).order('created_at', { ascending: false });
    if (userDocs) setDocuments(userDocs);
  };
`;
content = content.replace(`const approveNft = async`, approveDocFunc + `\n  const approveNft = async`);


// Add Document tab link
const tabs = `          <button onClick={() => setActiveTab('nfts')} className={\`px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap \${activeTab === 'nfts' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-brand-dark'}\`}>NFTs</button>`;
const newTabs = tabs + `\n          <button onClick={() => setActiveTab('documents')} className={\`px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap \${activeTab === 'documents' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-brand-dark'}\`}>KYC Documents</button>`;
content = content.replace(tabs, newTabs);

// Add Document Tab View
const docView = `
        {/* TAB: DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="animate-fade-in max-w-4xl">
            <h2 className="text-xl font-bold text-brand-dark mb-6">User Documents (KYC/NDA)</h2>
            <div className="space-y-4">
              {documents.map(d => (
                <div key={d.id} className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-brand-dark uppercase">{d.document_type.replace('_', ' ')}</p>
                      <p className="text-xs text-gray-500 mt-1">Submitted: {new Date(d.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={\`text-xs font-bold px-2 py-1 rounded \${d.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}\`}>
                        {d.status.toUpperCase()}
                      </span>
                      {d.status === 'pending' && (
                        <button onClick={() => approveDocument(d.id)} className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors">
                          Approve Document
                        </button>
                      )}
                    </div>
                  </div>
                  {d.signature_data && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <p className="text-xs font-bold text-gray-400 mb-2 uppercase">E-Signature</p>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 inline-block">
                        <img src={d.signature_data} alt="Signature" className="max-h-24 mix-blend-multiply" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {documents.length === 0 && <p className="text-sm text-gray-500">No documents submitted.</p>}
            </div>
          </div>
        )}
`;

content = content.replace(`{/* TAB: NFTS */}`, docView + `\n        {/* TAB: NFTS */}`);

fs.writeFileSync('src/pages/admin/AdminUserDetail.tsx', content);
console.log('Fixed AdminUserDetail.tsx');
