const fs = require('fs');

const taxesCode = `
import React, { useState, useEffect } from 'react';
import { FileText, Download, Clock, CheckCircle, AlertCircle, Loader2, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { generateTaxReportPDF } from '../../lib/pdfExport';

export default function Taxes() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  // Form
  const [isLodging, setIsLodging] = useState(false);
  const [taxYear, setTaxYear] = useState(new Date().getFullYear().toString());
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
      if (data?.user) {
        const { data: txs } = await supabase.from('transactions').select('*').eq('user_id', data.user.id);
        if (txs) setTransactions(txs);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchReports = async () => {
      const { data } = await supabase
        .from('tax_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (data) setReports(data);
      setLoading(false);
    };

    fetchReports();

    const channel = supabase.channel('user_taxes_changes-' + Date.now())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tax_reports' }, fetchReports)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const lodgeReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg('Lodging report...');
    
    const { error } = await supabase.from('tax_reports').insert({
      user_id: user.id,
      tax_year: taxYear,
      status: 'pending'
    });
    
    if (error) {
      setStatusMsg(\`Error: \${error.message}\`);
    } else {
      setStatusMsg('Tax report successfully lodged for admin review.');
      setTimeout(() => setIsLodging(false), 3000);
    }
  };

  const downloadReport = (report: any) => {
    generateTaxReportPDF(report, transactions, user);
  };

  return (
    <div className="animate-fade-in">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Tax Reports</h1>
          <p className="text-brand-text-gray">Lodge and download your official RestoreChain tax documentation.</p>
        </div>
        <button 
          onClick={() => setIsLodging(!isLodging)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-dark text-white font-bold rounded-xl hover:bg-black transition-colors shadow-lg"
        >
          <Plus size={20} /> Lodge New Report
        </button>
      </header>

      {isLodging && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8 animate-fade-in">
          <h2 className="text-lg font-bold text-brand-dark mb-4">Lodge Tax Report</h2>
          <form onSubmit={lodgeReport} className="space-y-4 max-w-sm">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Tax Year</label>
              <select value={taxYear} onChange={e => setTaxYear(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple">
                <option>2026</option>
                <option>2025</option>
                <option>2024</option>
                <option>2023</option>
              </select>
            </div>
            
            {statusMsg && (
              <div className={\`p-3 text-sm font-bold rounded-xl \${statusMsg.includes('success') ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}\`}>
                {statusMsg}
              </div>
            )}
            
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setIsLodging(false)} className="px-5 py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors text-sm">Cancel</button>
              <button type="submit" className="px-5 py-2.5 bg-brand-purple text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-md text-sm">Submit</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-brand-purple" size={32} /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Document</th>
                <th className="px-6 py-4 font-medium">Year</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map(report => (
                <tr key={report.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={\`p-2 rounded-lg \${report.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}\`}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-brand-dark">Form 8949 - Crypto Assets</p>
                        <p className="text-xs text-gray-500">{new Date(report.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-brand-dark">{report.tax_year}</td>
                  <td className="px-6 py-4">
                    {report.status === 'pending' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                        <Clock size={14} /> Pending Admin
                      </span>
                    )}
                    {report.status === 'completed' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        <CheckCircle size={14} /> Ready
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => downloadReport(report)}
                      disabled={report.status !== 'completed'}
                      className={\`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors \${report.status === 'completed' ? 'bg-brand-dark text-white hover:bg-black' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}\`}
                    >
                      <Download size={16} /> Download PDF
                    </button>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <p className="text-gray-500 font-medium">No tax reports lodged.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync('src/pages/dashboard/Taxes.tsx', taxesCode);
