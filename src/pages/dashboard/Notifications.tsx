import React, { useState } from 'react';
import { Bell, Check, ShieldAlert, FileText, ArrowRightLeft } from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', title: 'API Key Expiring', message: 'Your Kraken read-only API key expires in 2 days.', time: '2 hours ago', read: false, icon: ShieldAlert, color: 'text-orange-500 bg-orange-100' },
    { id: 2, type: 'system', title: 'Tax Report Ready', message: 'Your 2025 Capital Gains report has been generated successfully.', time: 'Yesterday', read: false, icon: FileText, color: 'text-brand-purple bg-brand-purple/10' },
    { id: 3, type: 'transaction', title: 'Large Deposit Detected', message: '10,000 USDC was deposited to your connected MetaMask wallet.', time: 'Oct 19', read: true, icon: ArrowRightLeft, color: 'text-blue-500 bg-blue-100' },
  ]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="animate-fade-in max-w-4xl">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Notifications</h1>
          <p className="text-brand-text-gray">System alerts, updates, and messages.</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="text-sm font-bold text-brand-purple hover:opacity-80 transition-opacity flex items-center gap-1"
        >
          <Check size={16} /> Mark all read
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {notifications.map(notif => (
            <div 
              key={notif.id} 
              onClick={() => markAsRead(notif.id)}
              className={`p-6 flex gap-4 transition-colors cursor-pointer hover:bg-gray-50 ${notif.read ? 'bg-white' : 'bg-brand-purple/5'}`}
            >
              <div className={`p-3 rounded-xl shrink-0 h-fit ${notif.color}`}>
                <notif.icon size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-bold ${notif.read ? 'text-gray-700' : 'text-brand-dark'}`}>{notif.title}</h3>
                  <span className="text-xs font-bold text-gray-400">{notif.time}</span>
                </div>
                <p className="text-sm text-gray-600">{notif.message}</p>
              </div>
              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-brand-purple mt-2 shrink-0"></div>
              )}
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Bell className="mx-auto mb-4 opacity-50" size={32} />
              <p>You have no notifications.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
