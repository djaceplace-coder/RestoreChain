const fs = require('fs');
let content = fs.readFileSync('src/pages/dashboard/Portfolio.tsx', 'utf8');

const regex = /<div className="grid grid-cols-2 gap-4 mb-8">[\s\S]*?<span className="font-bold text-sm">Withdraw<\/span>\s*<\/button>\s*<\/div>/;

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

content = content.replace(regex, replacement);
fs.writeFileSync('src/pages/dashboard/Portfolio.tsx', content);
