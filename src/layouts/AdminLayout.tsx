import React, { useState, useEffect, useRef } from 'react';
import { Loader2, 
  ShieldAlert, Users, List, MessageSquare, CreditCard, Shield, LayoutDashboard, Search, LogOut, Menu, X
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import LanguageSwitcher from "../components/LanguageSwitcher";

// Placeholder imports for Admin views
import AdminOverview from '../pages/admin/AdminOverview';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminUserDetail from '../pages/admin/AdminUserDetail';
import AdminSupport from '../pages/admin/AdminSupport';
import AdminSubscriptions from '../pages/admin/AdminSubscriptions';
import AdminKYC from '../pages/admin/AdminKYC';
import AdminAuditLog from '../pages/admin/AdminAuditLog';

export default function AdminLayout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [supportQueueCount, setSupportQueueCount] = useState(0);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const { data } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
      setIsAdmin(data?.is_admin === true);
    };
    checkAdmin();
    
    // Fetch unique users in support
    const fetchSupportCount = async () => {
      const { count } = await supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', 'open');
      setSupportQueueCount(count || 0);
    };
    fetchSupportCount();
    
    const channel = supabase.channel('layout_support')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, fetchSupportCount)
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [location.pathname]);

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-red-600" size={32} />
      </div>
    );
  }

  if (isAdmin === false) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // NOTE: In a real app, you would check `profiles.role === 'admin'` here
  // and redirect non-admins using <Navigate to="/dashboard" />.
  // For the UI shell demo, we assume the user has access.

  const isActive = (path: string, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const navLinkClass = (path: string, exact = false) => `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors text-sm ${
    isActive(path, exact)
      ? 'bg-red-50 text-red-600'
      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
  }`;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-brand-dark">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-brand-dark/20 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Admin Sidebar (Dark theme to differentiate from user dashboard) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 flex flex-col h-screen transform transition-transform duration-300 lg:translate-x-0 lg:static ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity" onClick={closeMobileMenu}>
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
              <Shield size={18} />
            </div>
            <img src="https://mfreznxsaybjvbhw.public.blob.vercel-storage.com/Tracefieldlogo.png" alt="Tracefield Admin Logo" className="h-8 w-auto brightness-0 invert" />
            <span className="font-display font-bold text-xl tracking-tight text-white">Tracefield Admin</span>
          </Link>
          <button 
            onClick={closeMobileMenu}
            className="lg:hidden p-2 text-gray-400 hover:bg-gray-800 rounded-lg mb-6"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <Link to="/admin" onClick={closeMobileMenu} className={navLinkClass('/admin', true)}>
            <LayoutDashboard size={18} /> Overview
          </Link>
          <Link to="/admin/users" onClick={closeMobileMenu} className={navLinkClass('/admin/users')}>
            <Users size={18} /> Users
          </Link>
          <Link to="/admin/kyc" onClick={closeMobileMenu} className={navLinkClass('/admin/kyc')}>
            <ShieldAlert size={18} /> KYC Approvals
          </Link>
          <Link to="/admin/support" onClick={closeMobileMenu} className={navLinkClass('/admin/support')}>
            <MessageSquare size={18} /> Support Queue
            {supportQueueCount > 0 && <span className="ml-auto bg-red-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">{supportQueueCount}</span>}
          </Link>
          <Link to="/admin/subscriptions" onClick={closeMobileMenu} className={navLinkClass('/admin/subscriptions')}>
            <CreditCard size={18} /> Subscriptions
          </Link>
          <Link to="/admin/audit-log" onClick={closeMobileMenu} className={navLinkClass('/admin/audit-log')}>
            <List size={18} /> Audit Log
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Link to="/dashboard" onClick={closeMobileMenu} className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors font-bold text-sm">
            <LogOut size={18} /> Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main ref={mainRef} className="flex-1 overflow-y-auto scroll-smooth">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="flex-1 max-w-xl hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search users, tickets, or audit logs..." 
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 ml-4 shrink-0">
             <LanguageSwitcher isDark={false} />
             <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold border-2 border-red-200">
               A
             </div>
          </div>
        </header>

        <div className="p-4 md:p-6 lg:p-10 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/kyc" element={<AdminKYC />} />
            <Route path="/users/:id/*" element={<AdminUserDetail />} />
            <Route path="/support" element={<AdminSupport />} />
            <Route path="/subscriptions" element={<AdminSubscriptions />} />
            <Route path="/audit-log" element={<AdminAuditLog />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
