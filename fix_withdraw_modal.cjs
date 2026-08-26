const fs = require('fs');

let portfolio = fs.readFileSync('src/pages/dashboard/Portfolio.tsx', 'utf8');

portfolio = portfolio.replace(
  `const [method, setMethod] = useState<'bank'|'intl'|'crypto'>('bank');`,
  `const [method, setMethod] = useState<'crypto'>('crypto');`
);

const wStart = `<div className="flex p-1 bg-gray-100 rounded-xl mb-6">`;
const wEnd = `</>\n              )}\n               \n              <div>`;

const wStartIdx = portfolio.lastIndexOf(wStart);
const wEndIdx = portfolio.lastIndexOf(wEnd) + wEnd.length;

if (wStartIdx !== -1 && wEndIdx !== -1) {
  const wReplacement = `
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
              <div>`;
  portfolio = portfolio.substring(0, wStartIdx) + wReplacement + portfolio.substring(wEndIdx - 11);
  console.log("Withdraw Modal Fixed");
} else {
  console.log("Could not find Withdraw bounds");
}

fs.writeFileSync('src/pages/dashboard/Portfolio.tsx', portfolio);
