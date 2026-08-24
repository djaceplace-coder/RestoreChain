import React from 'react';
import { ShieldCheck, Key, Smartphone, AlertTriangle } from 'lucide-react';

export default function Security() {
  return (
    <div className="animate-fade-in max-w-4xl">
      <header className="mb-10">
        <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Security Settings</h1>
        <p className="text-brand-text-gray">Manage your account security and authentication methods.</p>
      </header>

      <div className="space-y-6">
        {/* 2FA Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <Smartphone size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-brand-dark">Two-Factor Authentication (2FA)</h2>
                <p className="text-brand-text-gray mt-1 text-sm">Add an extra layer of security to your account.</p>
              </div>
            </div>
            <button className="px-6 py-2.5 bg-brand-dark text-white font-bold rounded-xl hover:bg-black transition-colors whitespace-nowrap">
              Enable 2FA
            </button>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-3 text-orange-800 text-sm">
            <AlertTriangle size={20} className="shrink-0 text-orange-500" />
            <p><strong>Recommended:</strong> Enabling 2FA is highly recommended for all users handling sensitive recovery operations.</p>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Key size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-dark">Password</h2>
              <p className="text-brand-text-gray mt-1 text-sm">Update your password to keep your account secure.</p>
            </div>
          </div>
          
          <form className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="currentPassword">Current Password</label>
              <input 
                id="currentPassword" 
                type="password" 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="newPassword">New Password</label>
              <input 
                id="newPassword" 
                type="password" 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="confirmPassword">Confirm New Password</label>
              <input 
                id="confirmPassword" 
                type="password" 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-colors"
              />
            </div>
            <div className="pt-2">
              <button type="button" className="px-6 py-3 bg-gray-100 text-brand-dark font-bold rounded-xl hover:bg-gray-200 transition-colors">
                Update Password
              </button>
            </div>
          </form>
        </div>
        
        {/* Sessions Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-brand-purple flex items-center justify-center shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-dark">Active Sessions</h2>
              <p className="text-brand-text-gray mt-1 text-sm">Manage devices that are logged into your account.</p>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
            <div className="p-4 flex items-center justify-between bg-gray-50/50">
              <div>
                <p className="font-bold text-brand-dark text-sm">Mac OS • Safari</p>
                <p className="text-xs text-gray-500 mt-0.5">London, UK • Active Now</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Current</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
