const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/AdminCreateUserModal.tsx', 'utf8');

// Add new state variables
content = content.replace(
  `const [initialBalance, setInitialBalance] = useState('');`,
  `const [initialBalance, setInitialBalance] = useState('');
  const [preferredCurrency, setPreferredCurrency] = useState('USD');
  const [tier, setTier] = useState('free');`
);

// Update profile insertion
content = content.replace(
  `first_name: firstName,
        last_name: lastName,
        total_balance: Number(initialBalance) || 0`,
  `first_name: firstName,
        last_name: lastName,
        total_balance: Number(initialBalance) || 0,
        fiat_balance: Number(initialBalance) || 0,
        preferred_currency: preferredCurrency,
        tier: tier`
);

// Add fields to the form
const formHtml = `<div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Initial Balance (USD)</label>
            <input type="number" step="0.01" value={initialBalance} onChange={e => setInitialBalance(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" placeholder="0.00" />
            <p className="text-[10px] text-gray-400 mt-1">This will create a 'System Update' transaction for the user.</p>
          </div>`;

const newFormHtml = `<div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Initial Balance (USD)</label>
            <input type="number" step="0.01" value={initialBalance} onChange={e => setInitialBalance(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" placeholder="0.00" />
            <p className="text-[10px] text-gray-400 mt-1">This will create a 'System Update' transaction for the user.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tier</label>
              <select value={tier} onChange={e => setTier(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500">
                <option value="free">Free</option>
                <option value="premium">Premium</option>
                <option value="vip">VIP</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Currency</label>
              <select value={preferredCurrency} onChange={e => setPreferredCurrency(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>`;

content = content.replace(formHtml, newFormHtml);

fs.writeFileSync('src/pages/admin/AdminCreateUserModal.tsx', content);
console.log("AdminCreateUserModal fields updated.");
