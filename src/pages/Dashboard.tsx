import React from 'react';
import { LayoutDashboard, FileText, Settings, LogOut, Plus, ShieldCheck, User } from 'lucide-react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';

import Overview from './dashboard/Overview';
import Cases from './dashboard/Cases';
import Security from './dashboard/Security';
import SettingsPage from './dashboard/Settings';
import NewCase from './dashboard/NewCase';

export default function Dashboard() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinkClass = (path: string) => `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${
    isActive(path)
      ? 'bg-brand-purple/10 text-brand-purple'
      : 'text-brand-text-gray hover:bg-gray-50 hover:text-brand-dark'
  }`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-brand-dark">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 hidden md:flex">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-brand-purple flex items-center justify-center text-white font-bold text-xl shadow-md">
              R
            </div>
            <img src="https://mfreznxsaybjvbhw.public.blob.vercel-storage.com/Tracefieldlogo.png" alt="Tracefield Logo" className="h-8 w-auto" />
            <span className="font-display font-bold text-xl tracking-tight text-brand-dark">Tracefield</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link to="/dashboard" className={navLinkClass('/dashboard')}>
            <LayoutDashboard size={20} />
            Overview
          </Link>
          <Link to="/dashboard/cases" className={navLinkClass('/dashboard/cases')}>
            <FileText size={20} />
            My Cases
          </Link>
          <Link to="/dashboard/security" className={navLinkClass('/dashboard/security')}>
            <ShieldCheck size={20} />
            Security
          </Link>
          <Link to="/dashboard/settings" className={navLinkClass('/dashboard/settings')}>
            <Settings size={20} />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <User size={20} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-brand-dark truncate">Jane Doe</p>
              <p className="text-xs text-brand-text-gray truncate">jane@example.com</p>
            </div>
          </div>
          <Link to="/" className="flex items-center gap-3 px-4 py-3 mt-2 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors">
            <LogOut size={20} />
            Sign out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/security" element={<Security />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/new-case" element={<NewCase />} />
        </Routes>
      </main>
    </div>
  );
}
