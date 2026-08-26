const fs = require('fs');
let content = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

const oldBottomNavRegex = /\{\/\* Mobile Bottom Navigation \(Native App Style\) \*\/\}([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*\)\;\s*\}/;

const newBottomNav = `{/* Mobile Bottom Navigation (Native App Style) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around px-2 py-1.5">
          <Link to="/dashboard" className={\`flex flex-col items-center gap-1 p-2 min-w-[64px] \${location.pathname === '/dashboard' ? 'text-brand-purple' : 'text-gray-400 hover:text-gray-600'}\`}>
            <LayoutDashboard size={22} className={location.pathname === '/dashboard' ? 'fill-brand-purple/20' : ''} />
            <span className="text-[10px] font-bold">Portfolio</span>
          </Link>
          <Link to="/dashboard/wallets" className={\`flex flex-col items-center gap-1 p-2 min-w-[64px] \${location.pathname.includes('/wallets') ? 'text-brand-purple' : 'text-gray-400 hover:text-gray-600'}\`}>
            <Wallet size={22} className={location.pathname.includes('/wallets') ? 'fill-brand-purple/20' : ''} />
            <span className="text-[10px] font-bold">Wallets</span>
          </Link>
          <Link to="/dashboard/transactions" className={\`flex flex-col items-center gap-1 p-2 min-w-[64px] \${location.pathname.includes('/transactions') ? 'text-brand-purple' : 'text-gray-400 hover:text-gray-600'}\`}>
            <History size={22} className={location.pathname.includes('/transactions') ? 'fill-brand-purple/20' : ''} />
            <span className="text-[10px] font-bold">History</span>
          </Link>
          <Link to="/dashboard/settings" className={\`flex flex-col items-center gap-1 p-2 min-w-[64px] \${location.pathname.includes('/settings') ? 'text-brand-purple' : 'text-gray-400 hover:text-gray-600'}\`}>
            <Settings size={22} className={location.pathname.includes('/settings') ? 'fill-brand-purple/20' : ''} />
            <span className="text-[10px] font-bold">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}`;

content = content.replace(oldBottomNavRegex, newBottomNav);
fs.writeFileSync('src/layouts/DashboardLayout.tsx', content);
