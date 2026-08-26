const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminUserDetail.tsx', 'utf8');

// Change `txDate` state initialization to support `datetime-local` format
content = content.replace(
  "const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);",
  "const [txDate, setTxDate] = useState(new Date().toISOString().slice(0, 16));"
);

// Change `type="date"` to `type="datetime-local"` for txDate
content = content.replace(
  /type="date" required value=\{txDate\}/g,
  'type="datetime-local" required value={txDate}'
);

// Add Profit Rate form underneath the System Update form
const systemUpdateFormEndRegex = /<\/form>\s*<\/div>\s*\)\}/;
const newSystemUpdateFormEnd = `</form>
            
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-lg font-bold text-brand-dark mb-4">Update Active Profit Rate</h3>
              <form onSubmit={handleUpdateProfitRate} className="flex items-end gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Profit Rate (%)</label>
                  <input type="number" step="0.01" value={profitRate} onChange={e => setProfitRate(e.target.value)} placeholder="e.g. 5.5" className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple" />
                </div>
                <button type="submit" disabled={updatingProfit} className="px-6 py-3 bg-brand-purple text-white font-bold rounded-xl text-sm hover:bg-purple-700 transition-colors disabled:opacity-50">
                  {updatingProfit ? 'Updating...' : 'Save Rate'}
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-2">This will dictate the percentage growth shown on the user's dashboard balance in real-time.</p>
            </div>
          </div>
        )}`;
content = content.replace(systemUpdateFormEndRegex, newSystemUpdateFormEnd);

// For Transactions table, we need it to show time.
// It is already using `.toLocaleDateString()`
// Let's replace it with `.toLocaleString()` to include time.
content = content.replace(
  /new Date\(tx\.created_at\)\.toLocaleDateString\(\)/g,
  "new Date(tx.created_at).toLocaleString()"
);

fs.writeFileSync('src/pages/admin/AdminUserDetail.tsx', content);
