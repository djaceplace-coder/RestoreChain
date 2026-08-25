const fs = require('fs');

let code = fs.readFileSync('src/pages/admin/AdminUserDetail.tsx', 'utf8');

// 1. Add state for defi and nfts
code = code.replace(
  "const [taxReports, setTaxReports] = useState<any[]>([]);",
  `const [taxReports, setTaxReports] = useState<any[]>([]);
  const [defiPositions, setDefiPositions] = useState<any[]>([]);
  const [nfts, setNfts] = useState<any[]>([]);`
);

// 2. Add queries inside fetchUserDetail
code = code.replace(
  "const { data: taxData } = await supabase.from('tax_reports').select('*').eq('user_id', id).order('created_at', { ascending: false });",
  `const { data: taxData } = await supabase.from('tax_reports').select('*').eq('user_id', id).order('created_at', { ascending: false });
    const { data: defiData } = await supabase.from('defi_positions').select('*').eq('user_id', id).order('created_at', { ascending: false });
    if (defiData) setDefiPositions(defiData);
    const { data: nftData } = await supabase.from('nfts').select('*').eq('user_id', id).order('created_at', { ascending: false });
    if (nftData) setNfts(nftData);`
);

// 3. Add handleApproveDefi / handleApproveNft
code = code.replace(
  "const pushNotification = async (e: React.FormEvent) => {",
  `const approveDefi = async (posId: string) => {
    await supabase.from('defi_positions').update({ status: 'active' }).eq('id', posId);
    setDefiPositions(defiPositions.map(d => d.id === posId ? { ...d, status: 'active' } : d));
  };
  const approveNft = async (nftId: string) => {
    await supabase.from('nfts').update({ status: 'active' }).eq('id', nftId);
    setNfts(nfts.map(n => n.id === nftId ? { ...n, status: 'active' } : n));
  };
  
  const pushNotification = async (e: React.FormEvent) => {`
);

// 4. Update the Tab menu
code = code.replace(
  "{ id: 'notifications', label: 'Notifications' },",
  `{ id: 'notifications', label: 'Notifications' },
          { id: 'defi', label: 'DeFi' },
          { id: 'nfts', label: 'NFTs' },`
);

// 5. Add the actual Tabs Content
code = code.replace(
  "      </div>\n    </div>\n  );\n}",
  `        {/* TAB: DEFI */}
        {activeTab === 'defi' && (
          <div className="animate-fade-in max-w-4xl">
            <h2 className="text-xl font-bold text-brand-dark mb-6">DeFi Positions</h2>
            <div className="space-y-3">
              {defiPositions.map(d => (
                <div key={d.id} className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-brand-dark">{d.protocol}</p>
                      {d.status === 'pending' && <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded">PENDING</span>}
                      {d.status === 'active' && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded">ACTIVE</span>}
                    </div>
                    <p className="text-xs text-gray-500 font-mono mt-1">{d.type} - {d.asset}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-brand-dark">\${d.balance}</p>
                      <p className="text-xs text-gray-400 font-bold">{d.apy}% APY</p>
                    </div>
                    {d.status === 'pending' && (
                      <button onClick={() => approveDefi(d.id)} className="px-3 py-1 bg-green-50 text-green-600 hover:bg-green-100 text-xs font-bold rounded-lg transition-colors">
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {defiPositions.length === 0 && <p className="text-sm text-gray-500">No DeFi positions requested.</p>}
            </div>
          </div>
        )}
        
        {/* TAB: NFTS */}
        {activeTab === 'nfts' && (
          <div className="animate-fade-in max-w-4xl">
            <h2 className="text-xl font-bold text-brand-dark mb-6">NFT Collection</h2>
            <div className="space-y-3">
              {nfts.map(n => (
                <div key={n.id} className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-brand-dark">{n.name}</p>
                      {n.status === 'pending' && <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded">PENDING</span>}
                      {n.status === 'active' && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded">ACTIVE</span>}
                    </div>
                    <p className="text-xs text-gray-500 font-mono mt-1">{n.collection}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Floor</p>
                      <p className="font-bold text-brand-dark">\${n.floor_price}</p>
                    </div>
                    {n.status === 'pending' && (
                      <button onClick={() => approveNft(n.id)} className="px-3 py-1 bg-green-50 text-green-600 hover:bg-green-100 text-xs font-bold rounded-lg transition-colors">
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {nfts.length === 0 && <p className="text-sm text-gray-500">No NFTs requested.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}`
);

fs.writeFileSync('src/pages/admin/AdminUserDetail.tsx', code);
