import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AdminCreateUserModalProps {
  onClose: () => void;
  onUserCreated: (user: any) => void;
}

export default function AdminCreateUserModal({ onClose, onUserCreated }: AdminCreateUserModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [initialBalance, setInitialBalance] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call Supabase Admin API to create the user,
    // and then insert a "System Update" transaction for the initial balance.
    const newUser = {
      id: `usr_${Date.now()}`,
      name: `${firstName} ${lastName}`,
      email,
      plan: 'Free',
      status: 'Active',
      reconScore: 100,
      joined: new Date().toISOString().split('T')[0],
      balance: Number(initialBalance) || 0
    };
    onUserCreated(newUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-gray-100">
          <h2 className="font-bold text-brand-dark">Create New User</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">First Name</label>
              <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" placeholder="John" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Last Name</label>
              <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" placeholder="Doe" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Initial Balance (USD)</label>
            <input type="number" step="0.01" value={initialBalance} onChange={e => setInitialBalance(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" placeholder="0.00" />
            <p className="text-[10px] text-gray-400 mt-1">This will create a 'System Update' transaction for the user.</p>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-bold bg-red-600 text-white hover:bg-red-700 rounded-xl">Create Account</button>
          </div>
        </form>
      </div>
    </div>
  );
}
