import React from 'react';
import { User, Mail, Bell } from 'lucide-react';

export default function Settings() {
  return (
    <div className="animate-fade-in max-w-4xl">
      <header className="mb-10">
        <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Account Settings</h1>
        <p className="text-brand-text-gray">Manage your personal information and preferences.</p>
      </header>

      <div className="space-y-6">
        
        {/* Profile Information */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-dark">Profile Information</h2>
              <p className="text-brand-text-gray mt-1 text-sm">Update your personal details here.</p>
            </div>
          </div>
          
          <form className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border-4 border-white shadow-sm overflow-hidden">
                <User size={32} />
              </div>
              <button type="button" className="px-4 py-2 border border-gray-200 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors">
                Change Avatar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="firstName">First Name</label>
                <input 
                  id="firstName" 
                  type="text" 
                  defaultValue="Jane"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="lastName">Last Name</label>
                <input 
                  id="lastName" 
                  type="text" 
                  defaultValue="Doe"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-colors"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="email">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    id="email" 
                    type="email" 
                    defaultValue="jane@example.com"
                    readOnly
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl focus:outline-none cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Email address cannot be changed directly. Contact support for assistance.</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <button type="button" className="px-6 py-3 bg-brand-dark text-white font-bold rounded-xl hover:bg-black transition-colors">
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <Bell size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-dark">Notifications</h2>
              <p className="text-brand-text-gray mt-1 text-sm">Choose what updates you want to receive.</p>
            </div>
          </div>
          
          <div className="space-y-4 max-w-2xl">
            <label className="flex items-start justify-between cursor-pointer p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-bold text-brand-dark">Case Updates</p>
                <p className="text-sm text-gray-500 mt-1">Receive emails when your case status changes.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 mt-1 accent-brand-purple" />
            </label>
            <label className="flex items-start justify-between cursor-pointer p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-bold text-brand-dark">Security Alerts</p>
                <p className="text-sm text-gray-500 mt-1">Get notified about new logins and security events.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 mt-1 accent-brand-purple" />
            </label>
            <label className="flex items-start justify-between cursor-pointer p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-bold text-brand-dark">Marketing & News</p>
                <p className="text-sm text-gray-500 mt-1">Receive our monthly newsletter and product updates.</p>
              </div>
              <input type="checkbox" className="w-5 h-5 mt-1 accent-brand-purple" />
            </label>
          </div>
        </div>

      </div>
    </div>
  );
}
