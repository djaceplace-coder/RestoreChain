import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Activity, Wallet, History, Coins, Image, 
  TrendingUp, BarChart3, Receipt, FileText, Download, Users, 
  Bell, HelpCircle, HeartPulse, Settings, LogOut, Search, User, Shield,
  Menu, X
} from 'lucide-react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Placeholder imports for routes
import Portfolio from '../pages/dashboard/Portfolio';
import Reconciliation from '../pages/dashboard/Reconciliation';
import Wallets from '../pages/dashboard/Wallets';
import Transactions from '../pages/dashboard/Transactions';
import DeFi from '../pages/dashboard/DeFi';
import NFTs from '../pages/dashboard/NFTs';
import Performance from '../pages/dashboard/Performance';
import Prices from '../pages/dashboard/Prices';
import Taxes from '../pages/dashboard/Taxes';
import TaxLossHarvesting from '../pages/dashboard/TaxLossHarvesting';
import Exports from '../pages/dashboard/Exports';
import Team from '../pages/dashboard/Team';
import Notifications from '../pages/dashboard/Notifications';
import Support from '../pages/dashboard/Support';
import AccountHealth from '../pages/dashboard/AccountHealth';
import SettingsPage from '../pages/dashboard/Settings';

export default function DashboardLayout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [reconCount, setReconCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let reconChannel: any;

    const checkAdminAndRecon = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
        
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (data?.role === 'admin') {
          setIsAdmin(true);
        }

        // Fetch recon count
        const fetchRecon = async () => {
          const { count } = await supabase
            .from('reconciliation_issues')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('status', 'open');
          setReconCount(count || 0);
        };
        fetchRecon();
        
        reconChannel = supabase.channel('recon_badge_changes-' + Date.now())
          .on('postgres_changes', { event: '*', schema: 'public', table: 'reconciliation_issues', filter: `user_id=eq.${user.id}` }, fetchRecon)
          .subscribe();
      }
    };
    
    checkAdminAndRecon();

    return () => { 
      if (reconChannel) supabase.removeChannel(reconChannel); 
    };
  }, []);


  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinkClass = (path: string) => `flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-colors text-sm ${
    isActive(path)
      ? 'bg-brand-purple/10 text-brand-purple font-bold'
      : 'text-brand-text-gray hover:bg-gray-50 hover:text-brand-dark'
  }`;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-brand-dark">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-brand-dark/20 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col h-screen transform transition-transform duration-300 lg:translate-x-0 lg:static ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 pb-2 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity" onClick={closeMobileMenu}>
            <div className="w-8 h-8 rounded-lg bg-brand-purple flex items-center justify-center text-white font-bold text-xl shadow-md">
              R
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-brand-dark">RestoreChain</span>
          </Link>
          <button 
            onClick={closeMobileMenu}
            className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg mb-6"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 overflow-y-auto pb-6 space-y-1 custom-scrollbar">
          <Link to="/dashboard" onClick={closeMobileMenu} className={navLinkClass('/dashboard')}>
            <LayoutDashboard size={18} /> Portfolio
          </Link>
          <Link to="/dashboard/reconciliation" onClick={closeMobileMenu} className={navLinkClass('/dashboard/reconciliation')}>
            <Activity size={18} /> Reconciliation
            {reconCount > 0 && <span className="ml-auto bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-bold">{reconCount}</span>}
          </Link>
          <Link to="/dashboard/wallets" onClick={closeMobileMenu} className={navLinkClass('/dashboard/wallets')}>
            <Wallet size={18} /> Wallets
          </Link>
          <Link to="/dashboard/transactions" onClick={closeMobileMenu} className={navLinkClass('/dashboard/transactions')}>
            <History size={18} /> Transactions
          </Link>

          <div className="my-2 border-t border-gray-100"></div>

          <Link to="/dashboard/defi" onClick={closeMobileMenu} className={navLinkClass('/dashboard/defi')}>
            <Coins size={18} /> DeFi Positions
          </Link>
          <Link to="/dashboard/nfts" onClick={closeMobileMenu} className={navLinkClass('/dashboard/nfts')}>
            <Image size={18} /> NFTs
          </Link>

          <div className="my-2 border-t border-gray-100"></div>

          <Link to="/dashboard/performance" onClick={closeMobileMenu} className={navLinkClass('/dashboard/performance')}>
            <TrendingUp size={18} /> Performance
          </Link>
          <Link to="/dashboard/prices" onClick={closeMobileMenu} className={navLinkClass('/dashboard/prices')}>
            <BarChart3 size={18} /> Prices
          </Link>

          <div className="my-2 border-t border-gray-100"></div>
          
          <Link to="/dashboard/taxes" onClick={closeMobileMenu} className={navLinkClass('/dashboard/taxes')}>
            <Receipt size={18} /> Taxes
          </Link>
          <Link to="/dashboard/tax-loss-harvesting" onClick={closeMobileMenu} className={navLinkClass('/dashboard/tax-loss-harvesting')}>
            <FileText size={18} /> Tax Loss Harvesting
          </Link>
          
          <div className="my-2 border-t border-gray-100"></div>

          <Link to="/dashboard/exports" onClick={closeMobileMenu} className={navLinkClass('/dashboard/exports')}>
            <Download size={18} /> Exports
          </Link>
          <Link to="/dashboard/team" onClick={closeMobileMenu} className={navLinkClass('/dashboard/team')}>
            <Users size={18} /> Team & Pros
          </Link>
        </nav>

        <div className="p-3 border-t border-gray-100 bg-gray-50/50">
          <Link to="/dashboard/account-health" onClick={closeMobileMenu} className={navLinkClass('/dashboard/account-health')}>
            <HeartPulse size={18} className="text-green-500" /> Account Health
          </Link>
          <Link to="/dashboard/notifications" onClick={closeMobileMenu} className={navLinkClass('/dashboard/notifications')}>
            <Bell size={18} /> Notifications
          </Link>
          <Link to="/dashboard/support" onClick={closeMobileMenu} className={navLinkClass('/dashboard/support')}>
            <HelpCircle size={18} /> Support
          </Link>
                    {isAdmin && (
            <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-colors text-sm text-red-600 hover:bg-red-50 hover:text-red-700 mt-2">
              <Shield size={18} /> Admin Panel
            </Link>
          )}
          <Link to="/dashboard/settings" onClick={closeMobileMenu} className={navLinkClass('/dashboard/settings')}>
            <Settings size={18} /> Settings
          </Link>
          
          <div className="mt-2 pt-2 border-t border-gray-200">
            <Link to="/login" className="flex items-center gap-3 px-4 py-2 hover:bg-white rounded-xl transition-colors group">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                <User size={16} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-brand-dark truncate group-hover:text-brand-purple transition-colors">{currentUser?.email || 'User'}</p>
                <p className="text-[11px] font-bold text-brand-purple bg-brand-purple/10 px-1.5 py-0.5 rounded inline-block">Pro Plan</p>
              </div>
              <LogOut size={16} className="text-gray-400 group-hover:text-red-500 transition-colors" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Topbar for mobile + search */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search transactions, wallets..." 
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 ml-4 shrink-0">
             <Link to="/dashboard/notifications" className="p-2 text-gray-400 hover:text-brand-dark transition-colors relative">
               <Bell size={20} />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
             </Link>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/reconciliation" element={<Reconciliation />} />
            <Route path="/wallets" element={<Wallets />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/defi" element={<DeFi />} />
            <Route path="/nfts" element={<NFTs />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/prices" element={<Prices />} />
            <Route path="/taxes" element={<Taxes />} />
            <Route path="/tax-loss-harvesting" element={<TaxLossHarvesting />} />
            <Route path="/exports" element={<Exports />} />
            <Route path="/team" element={<Team />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/support" element={<Support />} />
            <Route path="/account-health" element={<AccountHealth />} />
            <Route path="/settings/*" element={<SettingsPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
