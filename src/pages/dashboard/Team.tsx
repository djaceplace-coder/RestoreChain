import React from 'react';
import { Users, Mail, UserPlus, ShieldCheck } from 'lucide-react';

export default function Team() {
  return (
    <div className="animate-fade-in max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Team & Professionals</h1>
        <p className="text-brand-text-gray">Grant read-only access to your CPA or tax professional.</p>
      </header>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm mb-8">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-12 h-12 bg-brand-purple/10 text-brand-purple rounded-full flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-brand-dark">Invite your Accountant</h2>
            <p className="text-sm text-gray-500">They will receive a secure link to view your tax reports.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="email" 
              placeholder="accountant@firm.com" 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple"
            />
          </div>
          <button className="px-6 py-3 bg-brand-dark text-white font-bold rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
            <UserPlus size={18} /> Send Invite
          </button>
        </div>
      </div>

      <h2 className="text-xl font-bold text-brand-dark mb-4">Assigned Tracefield Pros</h2>
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
             {/* Avatar Placeholder */}
             <div className="w-full h-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl">S</div>
          </div>
          <div>
            <h3 className="font-bold text-brand-dark flex items-center gap-2">
              Sarah Jenkins <ShieldCheck size={16} className="text-green-500" />
            </h3>
            <p className="text-sm text-gray-500">Reconciliation Specialist</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-gray-100 text-brand-dark font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm">
          Message
        </button>
      </div>
    </div>
  );
}
