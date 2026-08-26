const fs = require('fs');
let content = fs.readFileSync('src/pages/dashboard/Portfolio.tsx', 'utf8');

const targetRegex = /<\/div>\s*<\/div>\s*\}\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;

const recentTxs = `              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mt-8">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
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
                              {tx.type ? tx.type.toUpperCase() : 'TRANSFER'}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-brand-dark">
                            {Number(tx.amount).toLocaleString(undefined, {style: 'currency', currency: 'USD'})}
                          </td>
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
        </div>
      )}
    </div>
  );
}
`;

// Note: Because I am replacing the end of the file, I need to make sure the regex matches properly.
const fileEndRegex = /<\/div>\s*<\/div>\s*\)\s*\}\s*<\/div>\s*\);\s*\}/;
content = content.replace(fileEndRegex, recentTxs);

fs.writeFileSync('src/pages/dashboard/Portfolio.tsx', content);
