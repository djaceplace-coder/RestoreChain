const fs = require('fs');
const file = 'src/pages/admin/AdminUserDetail.tsx';
let code = fs.readFileSync(file, 'utf8');

// Inject tax_reports state
code = code.replace(
  'const [notifications, setNotifications] = useState<any[]>([]);',
  `const [notifications, setNotifications] = useState<any[]>([]);\n  const [taxReports, setTaxReports] = useState<any[]>([]);`
);

// Inject fetch logic
code = code.replace(
  ".on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${id}` }, fetchUserAndData)",
  `.on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: \`user_id=eq.\${id}\` }, fetchUserAndData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tax_reports', filter: \`user_id=eq.\${id}\` }, fetchUserAndData)`
);

code = code.replace(
  "if (notifData) setNotifications(notifData);",
  `if (notifData) setNotifications(notifData);

    const { data: taxData } = await supabase.from('tax_reports').select('*').eq('user_id', id).order('created_at', { ascending: false });
    if (taxData) setTaxReports(taxData);`
);

// Inject completeTaxReport function
code = code.replace(
  'const pushWallet = async (e: React.FormEvent) => {',
  `const completeTaxReport = async (reportId: string) => {
    await supabase.from('tax_reports').update({ status: 'completed' }).eq('id', reportId);
  };

  const pushWallet = async (e: React.FormEvent) => {`
);

// Add Taxes to tabs
code = code.replace(
  "{ id: 'wallets', label: 'Wallets', icon: Wallet },",
  `{ id: 'wallets', label: 'Wallets', icon: Wallet },
          { id: 'taxes', label: 'Tax Reports', icon: Receipt, badge: taxReports.filter(t=>t.status==='pending').length },`
);

// Inject Taxes tab UI
code = code.replace(
  "{/* TAB: NOTIFICATIONS */}",
  `{/* TAB: TAX REPORTS */}
        {activeTab === 'taxes' && (
          <div className="animate-fade-in max-w-2xl">
            <h2 className="text-xl font-bold text-brand-dark mb-6">Manage User Tax Reports</h2>
            <div className="space-y-3">
              {taxReports.map(t => (
                <div key={t.id} className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm flex items-center justify-between">
                  <div>
                    <p className="font-bold text-brand-dark">Tax Year {t.tax_year}</p>
                    <p className="text-xs text-gray-500 mt-1">Requested: {new Date(t.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {t.status === 'pending' ? (
                      <>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-700">PENDING</span>
                        <button onClick={() => completeTaxReport(t.id)} className="px-4 py-2 bg-brand-dark text-white text-xs font-bold rounded-lg hover:bg-black transition-colors">
                          Mark as Completed
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-green-100 text-green-700 flex items-center gap-1"><CheckCircle size={12}/> COMPLETED</span>
                    )}
                  </div>
                </div>
              ))}
              {taxReports.length === 0 && <p className="text-sm text-gray-500">No tax reports requested by this user.</p>}
            </div>
          </div>
        )}

        {/* TAB: NOTIFICATIONS */}`
);

fs.writeFileSync(file, code);
