const fs = require('fs');
let content = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

// Hide sidebar on mobile completely, instead of just pushing it off screen.
// We'll change the aside classes to be hidden on mobile, block on lg.
const asideRegex = /<aside className=\{\`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col h-screen transform transition-transform duration-300 lg:translate-x-0 lg:static \$\{[\s\S]*?\}\`\}>/;
content = content.replace(asideRegex, '<aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">');

// Update header to remove hamburger menu on mobile, or just make it native-looking
const headerRegex = /<header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">[\s\S]*?<\/header>/;
const newHeader = `<header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6 lg:py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3 flex-1">
            <div className="lg:hidden w-8 h-8 rounded-lg bg-brand-purple flex items-center justify-center text-white font-bold text-lg">
              R
            </div>
            <div className="flex-1 max-w-xl hidden lg:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search transactions, wallets..." 
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                />
              </div>
            </div>
            <h1 className="lg:hidden text-lg font-display font-bold text-brand-dark">RestoreChain</h1>
          </div>
          <div className="flex items-center gap-4 ml-4 shrink-0">
             <Link to="/dashboard/notifications" className="p-2 text-gray-400 hover:text-brand-dark transition-colors relative">
               <Bell size={20} />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
             </Link>
             <Link to="/dashboard/settings" className="lg:hidden w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
               <User size={16} className="text-gray-500" />
             </Link>
          </div>
        </header>`;
content = content.replace(headerRegex, newHeader);

// Adjust mobile menu overlay removal since it's no longer used
content = content.replace(/\{isMobileMenuOpen && \([\s\S]*?<\/div>\s*\)\}/, '');

fs.writeFileSync('src/layouts/DashboardLayout.tsx', content);
