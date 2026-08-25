import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Wallet, History, Activity, Receipt, CreditCard, MessageSquare, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function AdminUserDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('reconciliation');

  return (
    <div className="animate-fade-in">
      <Link to="/admin/users" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-600 transition-colors mb-6">
        <ArrowLeft size={16} /> Back to Users
      </Link>

      <header className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-display font-bold text-brand-dark">Jane Doe</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-brand-purple/10 text-brand-purple">
              Ultra Plan
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
              Active
            </span>
          </div>
          <p className="text-gray-500 text-sm">jane@example.com • ID: {id} • Joined: Oct 12, 2025</p>
        </div>
        
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
            Impersonate
          </button>
          <button className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors flex items-center gap-2">
            <ShieldAlert size={16} /> Suspend User
          </button>
        </div>
      </header>

      {/* Admin Module Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-8 border-b border-gray-200 pb-px">
        {[
          { id: 'wallets', label: 'Wallets', icon: Wallet },
          { id: 'transactions', label: 'Transactions', icon: History },
          { id: 'reconciliation', label: 'Reconciliation', icon: Activity, alert: true },
          { id: 'taxes', label: 'Taxes', icon: Receipt },
          { id: 'subscription', label: 'Subscription', icon: CreditCard },
          { id: 'notifications', label: 'Push Notifications', icon: MessageSquare },
          { id: 'support', label: 'Support', icon: MessageSquare },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-bold text-sm whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === tab.id 
                ? 'border-red-600 text-red-600' 
                : 'border-transparent text-gray-500 hover:text-brand-dark hover:border-gray-300'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {tab.alert && <span className="w-2 h-2 rounded-full bg-red-500 ml-1"></span>}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 min-h-[400px]">
        {activeTab === 'reconciliation' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-brand-dark">Reconciliation Queue (Admin View)</h2>
              <span className="text-sm font-bold text-gray-500">Score: 92%</span>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl mb-6">
              <p className="text-sm text-orange-800 font-bold flex items-center gap-2">
                <AlertTriangle size={16} /> Note: Any actions taken here will be logged in the Audit Trail under your Admin ID.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded">Missing Cost Basis</span>
                    <span className="text-xs text-gray-400">RC-1049</span>
                  </div>
                  <p className="font-bold text-brand-dark text-sm">Sent 2.5 ETH to external wallet (0xabc...def).</p>
                </div>
                <div className="flex gap-2">
                   <button className="px-3 py-1.5 text-xs font-bold border border-gray-200 rounded-lg hover:bg-gray-50">Transfer to Self</button>
                   <button className="px-3 py-1.5 text-xs font-bold border border-gray-200 rounded-lg hover:bg-gray-50">Mark as Gift</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="animate-fade-in max-w-2xl">
            <h2 className="text-xl font-bold text-brand-dark mb-6">Manage User Notifications</h2>
            
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-brand-dark mb-4">Push Custom Alert</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                  <input type="text" placeholder="e.g. Account Review Required" className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                  <textarea rows={3} placeholder="Notification body..." className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-500"></textarea>
                </div>
                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg text-sm hover:bg-red-700 transition-colors">
                    Send Notification
                  </button>
                </div>
              </div>
            </div>

            <h3 className="font-bold text-brand-dark mb-4">Active Notifications</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div>
                  <p className="font-bold text-sm text-brand-dark">API Key Expiring</p>
                  <p className="text-xs text-gray-500">Sent: 2 hours ago (Unread)</p>
                </div>
                <button className="text-xs font-bold text-red-500 hover:text-red-700">Delete</button>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'reconciliation' && activeTab !== 'notifications' && (
          <div className="py-12 text-center animate-fade-in text-gray-500">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} management panel for this user.
          </div>
        )}
      </div>
    </div>
  );
}
