const fs = require('fs');

let p = fs.readFileSync('src/pages/dashboard/Portfolio.tsx', 'utf8');

// I'll grab from the beginning of FundModal to the end of WithdrawModal and overwrite it cleanly.
// First, find the beginning of FundModal.
const fundStart = p.indexOf("function FundModal(");

// Then find export default function Portfolio
const portStart = p.indexOf("export default function Portfolio(");

if (fundStart !== -1 && portStart !== -1) {
  const replacement = `function FundModal({ onClose, user }: { onClose: () => void, user: any }) {
  const [method, setMethod] = useState<'crypto'>('crypto');
  const [submitted, setSubmitted] = useState(false);
  const [amount, setAmount] = useState('');

  const submitFundRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(onClose, 3000);
  };

  return (
    <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-in">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold font-display text-brand-dark">Add Funds</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><Plus className="rotate-45" /></button>
        </div>
        
        {submitted ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} />
            </div>
            <h3 className="text-xl font-bold text-brand-dark mb-2">Request Submitted</h3>
            <p className="text-gray-500">Your deposit instruction has been recorded. Admin will credit your account once funds clear.</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-4">
                 <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Select Asset</label>
                  <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple">
                    <option>Bitcoin (BTC)</option>
                    <option>Ethereum (ETH)</option>
                    <option>USDC (ERC-20)</option>
                    <option>USDT (TRC-20)</option>
                  </select>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-center">
                   <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=0x1234567890abcdef1234567890abcdef12345678" alt="QR" className="mx-auto mb-4 rounded-lg mix-blend-multiply" />
                   <p className="text-xs font-bold text-gray-500 uppercase mb-1">Deposit Address</p>
                   <div className="flex items-center justify-center gap-2">
                     <code className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded">0x123...5678</code>
                     <button className="p-1.5 text-gray-400 hover:text-brand-purple bg-white border border-gray-200 rounded"><Copy size={16}/></button>
                   </div>
                </div>
                <button onClick={submitFundRequest} className="w-full py-3 bg-brand-purple text-white font-bold rounded-xl hover:bg-purple-700 transition-colors mt-2">I have sent the crypto</button>
              </div>
          </div>
        )}
      </div>
    </div>
  );
}

function WithdrawModal({ onClose, user }: { onClose: () => void, user: any }) {
  const [method, setMethod] = useState<'crypto'>('crypto');
  const [submitted, setSubmitted] = useState(false);

  const submitWithdrawRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(onClose, 3000);
  };

  return (
    <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-in">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold font-display text-brand-dark">Withdraw Funds</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><Plus className="rotate-45" /></button>
        </div>
          
        {submitted ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} />
            </div>
            <h3 className="text-xl font-bold text-brand-dark mb-2">Withdrawal Pending</h3>
            <p className="text-gray-500">Your withdrawal request is under review. Our administration team will process it shortly.</p>
          </div>
        ) : (
          <div className="p-6">
            <form onSubmit={submitWithdrawRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Asset</label>
                <select required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple">
                  <option>USDC</option>
                  <option>USDT</option>
                  <option>BTC</option>
                  <option>ETH</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Destination Address</label>
                <input type="text" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple" placeholder="0x..." />
              </div>
               
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Amount to Withdraw</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                  <input type="number" required className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple" placeholder="0.00" />
                </div>
              </div>
               
              <button type="submit" className="w-full py-3 bg-brand-dark text-white font-bold rounded-xl hover:bg-black transition-colors mt-2">Submit Request</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

`;
  p = p.substring(0, fundStart) + replacement + p.substring(portStart);
  fs.writeFileSync('src/pages/dashboard/Portfolio.tsx', p);
  console.log("Fixed modals completely.");
} else {
  console.log("Could not find bounds.");
}
