
import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, ArrowRight, Activity, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

export default function Reconciliation() {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data } = await supabase
        .from('reconciliation_issues')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (data) setIssues(data);
      setLoading(false);
    };

    fetchIssues();

    const channel = supabase.channel('user_recon_changes-' + Date.now())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reconciliation_issues' }, fetchIssues)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const openIssues = issues.filter(i => i.status === 'open');

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Reconciliation</h1>
        <p className="text-gray-500">Resolve discrepancies in your transaction history.</p>
      </header>

      {loading ? (
        <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-brand-purple" size={32} /></div>
      ) : issues.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h2 className="text-xl font-bold text-brand-dark mb-2">System Analysis Complete</h2>
          <p className="text-gray-500 max-w-md mx-auto">No reconciliation issues found. Your account is fully balanced and compliant.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex items-start gap-3">
            <ShieldAlert className="text-orange-500 mt-0.5 shrink-0" size={20} />
            <div>
              <h3 className="font-bold text-orange-900">Action Required: {openIssues.length} Unresolved Issues</h3>
              <p className="text-sm text-orange-800 mt-1">Please review the discrepancies identified by our system during the latest ledger analysis. Admin support has been notified.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-brand-dark">Reconciliation Queue</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {issues.map(issue => (
                <div key={issue.id} className={`p-6 hover:bg-gray-50 transition-colors ${issue.status === 'resolved' ? 'opacity-50' : ''}`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${issue.status === 'open' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {issue.type}
                        </span>
                        {issue.status === 'resolved' && (
                           <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">Resolved</span>
                        )}
                      </div>
                      <p className="font-bold text-brand-dark">{issue.issue_desc}</p>
                      <p className="text-sm text-gray-500 mt-1">Asset: {issue.asset} | Value: {issue.amount}</p>
                    </div>
                    {issue.status === 'open' && (
                      <Link to="/dashboard/support" className="px-4 py-2 bg-brand-dark text-white text-sm font-bold rounded-lg hover:bg-black transition-colors shrink-0">
                        Contact Support
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
