import React, { useState, useEffect } from 'react';
import { List, Search, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

export default function AdminAuditLog() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const fetchLogs = async () => {
    const { data } = await supabase
      .from('audit_logs')
      .select('*, profiles:admin_id(email), target:target_user_id(email)')
      .order('created_at', { ascending: false });
    
    if (data) setLogs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
    const channel = supabase.channel('audit_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'audit_logs' }, fetchLogs)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (log.profiles && log.profiles.email && log.profiles.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (log.target && log.target.email && log.target.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="animate-fade-in">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Audit Log</h1>
          <p className="text-gray-500">Track all administrative actions across the platform.</p>
        </div>
      </header>
      
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by action, email, or detail..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500"
            />
          </div>
        </div>
        
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="animate-spin text-red-600" size={32} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Timestamp</th>
                  <th className="px-6 py-4 font-medium">Admin</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                  <th className="px-6 py-4 font-medium">Target User</th>
                  <th className="px-6 py-4 font-medium">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-gray-500">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-brand-dark">{log.profiles?.email || 'System'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {log.target_user_id ? (
                        <Link to={`/admin/users/${log.target_user_id}`} className="text-sm text-red-600 hover:underline flex items-center gap-1 font-medium">
                          {log.target?.email || 'User'} <ArrowRight size={14} />
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {log.details || '-'}
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No audit logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
