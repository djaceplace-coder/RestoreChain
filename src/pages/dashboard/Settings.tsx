import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

import { User, Receipt, CreditCard, Bell, Shield, Info, ShieldAlert, CheckCircle2 } from 'lucide-react';
import KYCModal from '../../components/KYCModal';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('account');
  const [profile, setProfile] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (data) setProfile(data);
      }
    };
    fetchUser();
  }, []);


  return (
    <div className="animate-fade-in max-w-5xl">
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Settings</h1>
        <p className="text-brand-text-gray">Manage your account preferences, tax logic, and billing.</p>
      </header>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-8 border-b border-gray-200 pb-px">
        {[
          { id: 'account', label: 'Account', icon: User },
          { id: 'tax-elections', label: 'Tax Elections', icon: Receipt },
          { id: 'subscription', label: 'Subscription', icon: CreditCard },
          { id: 'notifications', label: 'Notifications', icon: Bell },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-bold text-sm whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === tab.id 
                ? 'border-brand-purple text-brand-purple' 
                : 'border-transparent text-gray-500 hover:text-brand-dark hover:border-gray-300'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
        
        {activeTab === 'account' && (
          <div className="animate-fade-in space-y-6 max-w-2xl">
            <h2 className="text-xl font-bold text-brand-dark mb-4">Account Profile</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">First Name</label>
                <input type="text" defaultValue="Jane" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
                <input type="text" defaultValue="Doe" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
              <input type="email" defaultValue="jane@example.com" disabled className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed" />
              <p className="text-xs text-gray-500 mt-1">Contact support to change your email address.</p>
            </div>
            <button className="px-6 py-3 bg-brand-dark text-white font-bold rounded-xl hover:bg-black transition-colors">
              Save Changes
            </button>

            <div className="pt-8 border-t border-gray-100">
              <h2 className="text-xl font-bold text-brand-dark mb-4">Identity Verification (KYC)</h2>
              <div className={`p-5 rounded-2xl border ${profile?.kyc_status === 'approved' ? 'bg-green-50 border-green-100' : profile?.kyc_status === 'pending' ? 'bg-yellow-50 border-yellow-100' : profile?.kyc_status === 'rejected' ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100'} flex items-center justify-between`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${profile?.kyc_status === 'approved' ? 'bg-green-100 text-green-600' : profile?.kyc_status === 'pending' ? 'bg-yellow-100 text-yellow-600' : profile?.kyc_status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                    {profile?.kyc_status === 'approved' ? <CheckCircle2 size={24} /> : <ShieldAlert size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 capitalize">{profile?.kyc_status || 'unverified'}</h3>
                    <p className="text-sm text-gray-600">
                      {profile?.kyc_status === 'approved' ? 'Your identity has been verified. You have full access.' : 
                       profile?.kyc_status === 'pending' ? 'Your documents are under review by admin.' : 
                       profile?.kyc_status === 'rejected' ? 'Your verification was rejected. Please try again.' :
                       'Complete KYC to access all platform features.'}
                    </p>
                  </div>
                </div>
                {profile?.kyc_status !== 'approved' && profile?.kyc_status !== 'pending' && (
                  <button onClick={() => setIsKYCModalOpen(true)} className="px-4 py-2 bg-brand-purple text-white font-bold rounded-xl text-sm hover:bg-purple-700 transition-colors">
                    Start Verification
                  </button>
                )}
              </div>
            </div>
            
            <KYCModal 
              isOpen={isKYCModalOpen} 
              onClose={() => setIsKYCModalOpen(false)} 
              user={currentUser} 
              onSuccess={() => setProfile({...profile, kyc_status: 'pending'})} 
            />

          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="animate-fade-in max-w-2xl">
            <h2 className="text-xl font-bold text-brand-dark mb-4">Current Plan</h2>
            <div className="bg-gradient-to-r from-brand-purple to-blue-600 rounded-2xl p-6 text-white mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-2xl font-display">Pro Plan</h3>
                  <p className="text-purple-100 text-sm">Up to 10,000 transactions/year</p>
                </div>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-sm border border-white/20">Active</span>
              </div>
              <p className="text-3xl font-bold mb-1">$299<span className="text-lg font-normal opacity-80">/year</span></p>
            </div>
            <button className="px-6 py-3 bg-white border border-gray-200 text-brand-dark font-bold rounded-xl hover:bg-gray-50 transition-colors">
              Manage Billing (Stripe)
            </button>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="animate-fade-in max-w-2xl space-y-6">
            <h2 className="text-xl font-bold text-brand-dark mb-4">Notification Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <h4 className="font-bold text-brand-dark">Email Alerts</h4>
                  <p className="text-sm text-gray-500">Receive tax deadline and sync error alerts.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-brand-purple" />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <h4 className="font-bold text-brand-dark">Push Notifications</h4>
                  <p className="text-sm text-gray-500">Get notified when support replies to your ticket.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-brand-purple" />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <h4 className="font-bold text-brand-dark">Transaction Activity</h4>
                  <p className="text-sm text-gray-500">Alerts for large deposits or withdrawals.</p>
                </div>
                <input type="checkbox" className="w-5 h-5 accent-brand-purple" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tax-elections' && (
          <div className="animate-fade-in space-y-8">
            <div>
              <h2 className="text-xl font-bold text-brand-dark mb-2">Tax Elections & Logic</h2>
              <p className="text-sm text-brand-text-gray mb-6">Configure how specific types of crypto transactions are treated for your tax calculations. These settings affect your capital gains and income reports.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="font-bold text-brand-dark text-sm uppercase tracking-wider text-gray-500">DeFi & Staking</h3>
                  
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <label className="font-bold text-brand-dark flex items-center gap-2">
                        Liquid Staking
                        <Info size={14} className="text-gray-400 cursor-help" />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Treat liquid staking (e.g., ETH to stETH) as non-taxable.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-brand-purple mt-1" />
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <label className="font-bold text-brand-dark flex items-center gap-2">
                        Wrapping Crypto
                        <Info size={14} className="text-gray-400 cursor-help" />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Treat wrapping (e.g., ETH to WETH) as non-taxable.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-brand-purple mt-1" />
                  </div>
                  
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <label className="font-bold text-brand-dark flex items-center gap-2">
                        Liquid Lending
                        <Info size={14} className="text-gray-400 cursor-help" />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Treat depositing collateral for liquid lending as non-taxable.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-brand-purple mt-1" />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="font-bold text-brand-dark text-sm uppercase tracking-wider text-gray-500">Income & Pools</h3>
                  
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <label className="font-bold text-brand-dark flex items-center gap-2">
                        Liquidity Pools
                        <Info size={14} className="text-gray-400 cursor-help" />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Treat entering/exiting LPs as non-taxable events.</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5 accent-brand-purple mt-1" />
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <label className="font-bold text-brand-dark flex items-center gap-2">
                        Staking Rewards
                        <Info size={14} className="text-gray-400 cursor-help" />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Treat staking rewards as taxable income upon receipt.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-brand-purple mt-1" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <Shield className="text-gray-400 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-gray-600">
                  <strong>Disclaimer:</strong> Changing these settings will immediately trigger a recalculation of your entire tax history. Tracefield provides software, not legal or tax advice. Consult a tax professional if you are unsure about your local jurisdiction's rules.
                </p>
              </div>
            </div>
            
            <button className="px-6 py-3 bg-brand-dark text-white font-bold rounded-xl hover:bg-black transition-colors shadow-md">
              Save Tax Elections
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
