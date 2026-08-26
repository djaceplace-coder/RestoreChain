const fs = require('fs');
let content = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

// I will add a bottom navigation bar just before the closing </div> of the main layout.

const bottomNav = `
      {/* Mobile Bottom Navigation (Native App Style) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
        <div className="flex items-center justify-around px-2 py-2">
          <Link to="/dashboard" className={\`flex flex-col items-center gap-1 p-2 min-w-[64px] \${location.pathname === '/dashboard' ? 'text-brand-purple' : 'text-gray-400 hover:text-gray-600'}\`}>
            <LayoutDashboard size={20} />
            <span className="text-[10px] font-bold">Home</span>
          </Link>
          <Link to="/dashboard/wallets" className={\`flex flex-col items-center gap-1 p-2 min-w-[64px] \${location.pathname === '/dashboard/wallets' ? 'text-brand-purple' : 'text-gray-400 hover:text-gray-600'}\`}>
            <Wallet size={20} />
            <span className="text-[10px] font-bold">Wallets</span>
          </Link>
          <Link to="/dashboard/transactions" className={\`flex flex-col items-center gap-1 p-2 min-w-[64px] \${location.pathname === '/dashboard/transactions' ? 'text-brand-purple' : 'text-gray-400 hover:text-gray-600'}\`}>
            <History size={20} />
            <span className="text-[10px] font-bold">History</span>
          </Link>
          <Link to="/dashboard/settings" className={\`flex flex-col items-center gap-1 p-2 min-w-[64px] \${location.pathname === '/dashboard/settings' ? 'text-brand-purple' : 'text-gray-400 hover:text-gray-600'}\`}>
            <Settings size={20} />
            <span className="text-[10px] font-bold">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
`;

content = content.replace(/<\/div>\s*<\/main>\s*<\/div>\s*\);\s*\}/, `        </div>
      </main>
      ${bottomNav}`);

// I need to add some padding to the main element to account for the bottom nav on mobile.
content = content.replace(/<main ref=\{mainRef\} className="flex-1 overflow-y-auto scroll-smooth">/, '<main ref={mainRef} className="flex-1 overflow-y-auto scroll-smooth pb-20 lg:pb-0">');

fs.writeFileSync('src/layouts/DashboardLayout.tsx', content);
