import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { createClient } from '@supabase/supabase-js';

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
      const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';
      
      // Create a temporary client that DOES NOT persist session so we don't log the admin out
      const tempSupabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      });

      const { data, error: signUpError } = await tempSupabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error("Failed to create user");

      const userId = data.user.id;
      
      // Now use the main admin client to update their profile
      await supabase.from('profiles').update({
        first_name: firstName,
        last_name: lastName,
        total_balance: Number(initialBalance) || 0
      }).eq('id', userId);

      // Add a system transaction if balance provided
      if (Number(initialBalance) > 0) {
        await supabase.from('transactions').insert({
          user_id: userId,
          type: 'deposit',
          amount: `+${Number(initialBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          value_usd: Number(initialBalance),
          asset: 'USD',
          status: 'completed',
        });
      }

      onUserCreated({ id: userId, email });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
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
            {error && <p className="text-red-500 text-xs absolute left-6 bottom-8">{error}</p>}
            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-red-600 text-white hover:bg-red-700 rounded-xl disabled:opacity-50">
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
