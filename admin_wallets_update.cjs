const fs = require('fs');
const file = 'src/pages/admin/AdminUserDetail.tsx';
let code = fs.readFileSync(file, 'utf8');

// Inject the approveWallet function
if (!code.includes('approveWallet')) {
  code = code.replace(
    'const pushWallet = async (e: React.FormEvent) => {',
    `const approveWallet = async (walletId: string) => {
    await supabase.from('wallets').update({ status: 'active' }).eq('id', walletId);
  };

  const pushWallet = async (e: React.FormEvent) => {`
  );

  // Update the render of wallets to include the approve button
  code = code.replace(
    '<div>\n                      <p className="font-bold text-brand-dark">{w.label}</p>',
    `<div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-brand-dark">{w.label}</p>
                        {w.status === 'pending' && <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded">PENDING</span>}
                        {w.status === 'active' && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded">ACTIVE</span>}
                      </div>`
  );
  
  code = code.replace(
    '<span className="text-xs font-bold px-2.5 py-1 bg-gray-100 rounded-full">{w.network}</span>',
    `<div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 bg-gray-100 rounded-full">{w.network}</span>
                      {w.status === 'pending' && (
                        <button onClick={() => approveWallet(w.id)} className="px-3 py-1 bg-green-50 text-green-600 hover:bg-green-100 text-xs font-bold rounded-lg transition-colors">
                          Approve
                        </button>
                      )}
                    </div>`
  );
}

fs.writeFileSync(file, code);
