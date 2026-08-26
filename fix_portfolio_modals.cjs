const fs = require('fs');

let portfolio = fs.readFileSync('src/pages/dashboard/Portfolio.tsx', 'utf8');

// FUND MODAL
portfolio = portfolio.replace(
  `const [method, setMethod] = useState<'fiat'|'crypto'>('fiat');`,
  `const [method, setMethod] = useState<'crypto'>('crypto');`
);

const fundStart = `<div className="flex p-1 bg-gray-100 rounded-xl mb-6">`;
const fundEnd = `</div>\n            )}\n          </div>`;
const fStartIdx = portfolio.indexOf(fundStart);
const fEndIdx = portfolio.indexOf(fundEnd) + fundEnd.length;

if (fStartIdx !== -1 && portfolio.indexOf(fundEnd) !== -1) {
  const fundReplacement = `<div className="space-y-4">
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
              </div>
          </div>`;
  portfolio = portfolio.substring(0, fStartIdx) + fundReplacement + portfolio.substring(fEndIdx);
  console.log("Fund Modal Fixed");
} else {
  console.log("Could not find Fund Modal slice bounds.");
}

fs.writeFileSync('src/pages/dashboard/Portfolio.tsx', portfolio);
