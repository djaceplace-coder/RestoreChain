
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, ShieldAlert, CheckCircle, Clock, Search, ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminOverview() {
  const [stats, setStats] = useState({ users: 0, balance: 0, transactions: 0, recon: 0, subs: 0, tickets: 0, pending_kyc: 0, pending_nda: 0 });
  const [recentTx, setRecentTx] = useState<any[]>([]);
  
  useEffect(() => {
    const loadStats = async () => {
      const { count: users } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { data: profiles } = await supabase.from('profiles').select('total_balance');
      const { count: txs } = await supabase.from('transactions').select('*', { count: 'exact', head: true });
      const { count: recon } = await supabase.from('reconciliation_issues').select('*', { count: 'exact', head: true }).eq('status', 'open');
      const { count: subs } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).neq('tier', 'free');
      const { count: supportCount } = await supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', 'open');
      const { count: pendingKyc } = await supabase.from('kyc_documents').select('*', { count: 'exact', head: true }).eq('status', 'pending');
      const { count: pendingNda } = await supabase.from('user_documents').select('*', { count: 'exact', head: true }).eq('status', 'pending');
      const uniqueTickets = supportCount || 0;
      
      const balance = profiles?.reduce((sum, p) => sum + Number(p.total_balance || 0), 0) || 0;
      setStats({ users: users || 0, balance, transactions: txs || 0, recon: recon || 0, subs: subs || 0, tickets: uniqueTickets, pending_kyc: pendingKyc || 0, pending_nda: pendingNda || 0 });
    };
    loadStats();
    
    const fetchTx = async () => {
      const { data } = await supabase.from('transactions').select('*, profiles(email)').order('created_at', { ascending: false }).limit(5);
      if (data) setRecentTx(data);
    };
    fetchTx();
    
    const channel = supabase.channel('overview_changes-' + Date.now())
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        loadStats();
        fetchTx();
      })
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, []);

  const dynamicStats = [
    { label: 'Total Users', value: stats.users.toLocaleString(), change: 'Registered', icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: 'Pending KYC', value: stats.pending_kyc.toLocaleString(), change: 'Awaiting approval', icon: ShieldAlert, color: 'text-yellow-600', bg: 'bg-yellow-100', link: '/admin/kyc' },
    { label: 'Pending NDA', value: stats.pending_nda.toLocaleString(), change: 'Awaiting review', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100', link: '/admin/kyc' },
    { label: 'Pending Recon', value: stats.recon.toLocaleString(), change: 'Require review', icon: ShieldAlert, color: 'text-orange-500', bg: 'bg-orange-100', link: '/admin/users' },
    { label: 'Open Tickets', value: stats.tickets.toLocaleString(), change: 'Active threads', icon: Clock, color: 'text-red-500', bg: 'bg-red-100', link: '/admin/support' },
  ];

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Admin Overview</h1>
        <p className="text-gray-500">System metrics and recent activity.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dynamicStats.map((stat, i) => (
          <Link to={stat.link || '#'} key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-brand-purple transition-colors block">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon size={20} />
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-3xl font-display font-bold text-brand-dark mb-2">{stat.value}</p>
            <p className="text-xs font-bold text-gray-400">{stat.change}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-brand-dark">Recent Activity</h2>
            <Link to="/admin/users" className="text-sm font-bold text-red-600 hover:text-red-700">View All</Link>
          </div>
          <div className="space-y-4">
            {recentTx.length === 0 ? <p className="text-sm text-gray-500">No recent activity.</p> : recentTx.map((log, i) => (
              <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                <div>
                  <p className="text-brand-dark">
                    <span className="font-bold">System</span> processed {log.type} of {log.amount} {log.asset} for <span className="font-bold">{log.profiles?.email || 'User'}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(log.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-brand-dark mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Jump to user by email or ID..." 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>
            
            <Link to="/admin/support" className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-red-500 hover:bg-red-50 transition-colors group">
              <div className="font-bold text-brand-dark group-hover:text-red-700">Review Open Tickets</div>
              <ArrowRight className="text-gray-400 group-hover:text-red-500" size={20} />
            </Link>
            <Link to="/admin/subscriptions" className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-red-500 hover:bg-red-50 transition-colors group">
              <div className="font-bold text-brand-dark group-hover:text-red-700">Manage Subscriptions</div>
              <ArrowRight className="text-gray-400 group-hover:text-red-500" size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
