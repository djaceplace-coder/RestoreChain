const fs = require('fs');
let content = fs.readFileSync('src/pages/dashboard/Portfolio.tsx', 'utf8');

const removeRegex = /<h2 className="text-lg font-bold font-display text-brand-dark">Your Assets<\/h2>[\s\S]*?<button[\s\S]*?setIsAddAssetOpen\(true\)[\s\S]*?<\/button>\s*<\/div>/;
content = content.replace(removeRegex, `<h2 className="text-lg font-bold font-display text-brand-dark">Your Assets</h2>
              </div>`);

const replacement = `<div className="grid grid-cols-3 gap-4 mb-8">
        <button onClick={() => setIsFundModalOpen(true)} className="p-4 bg-brand-purple text-white rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-purple-700 transition-colors shadow-md group">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus size={20} />
          </div>
          <span className="font-bold text-sm text-center">Add Funds</span>
        </button>
        <button onClick={() => setIsWithdrawModalOpen(true)} className="p-4 bg-white border border-gray-200 text-brand-dark rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm group">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Download size={20} />
          </div>
          <span className="font-bold text-sm text-center">Withdraw</span>
        </button>
        <button onClick={() => setIsAddAssetOpen(true)} className="p-4 bg-white border border-gray-200 text-brand-dark rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm group">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Wallet size={20} />
          </div>
          <span className="font-bold text-sm text-center">Add Asset</span>
        </button>
      </div>`;

const actionButtonsRegex = /\{\/\* Action Buttons \*\/\}\s*<div className="grid grid-cols-2 gap-4 mb-8">[\s\S]*?<\/div>\s*<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">/;
content = content.replace(actionButtonsRegex, `{/* Action Buttons */}
      ` + replacement + `\n      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">`);


const yourAssetsDivRegex = /(<div className="overflow-x-auto">[\s\S]*?<\/table>\s*)\}\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;
const recentTxs = `$1}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mt-8">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-lg font-bold font-display text-brand-dark">Recent Transactions</h2>
              </div>
              <div className="overflow-x-auto">
                {transactions.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">No recent transactions.</div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 text-xs text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-4 font-medium">Type</th>
                        <th className="px-6 py-4 font-medium">Amount</th>
                        <th className="px-6 py-4 font-medium">Asset</th>
                        <th className="px-6 py-4 font-medium text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {transactions.slice(0, 3).map(tx => (
                        <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <span className={\`text-xs font-bold px-2 py-1 rounded \${tx.type === 'deposit' ? 'bg-green-100 text-green-700' : tx.type === 'withdrawal' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}\`}>
                              {tx.type.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-brand-dark">{tx.amount}</td>
                          <td className="px-6 py-4 text-gray-500 text-sm">{tx.asset}</td>
                          <td className="px-6 py-4 text-right text-gray-500 text-sm">{new Date(tx.created_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

          </div>
        </div>`;
content = content.replace(yourAssetsDivRegex, recentTxs);

fs.writeFileSync('src/pages/dashboard/Portfolio.tsx', content);
