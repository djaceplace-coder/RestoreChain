const fs = require('fs');
const file = 'src/pages/admin/AdminUserDetail.tsx';
let code = fs.readFileSync(file, 'utf8');

// Inject txDate state
code = code.replace(
  'const [messageBody, setMessageBody] = useState(\'\');',
  `const [messageBody, setMessageBody] = useState('');\n  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);`
);

// Update handleSystemUpdate rpc call
code = code.replace(
  'message_body: messageBody',
  'message_body: messageBody,\n      tx_date: txDate'
);

// Inject Date Input into Form
code = code.replace(
  '<label className="block text-sm font-bold text-gray-700 mb-1">Asset Name</label>',
  `</div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                  <input type="date" required value={txDate} onChange={e => setTxDate(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Asset Name</label>`
);

fs.writeFileSync(file, code);
