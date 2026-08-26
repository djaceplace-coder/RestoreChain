import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, CheckCircle, FileText, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminKYC() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    // We want to fetch pending documents first, and we need the user's email/name from profiles
    // We can join the profiles table since user_documents has a foreign key to profiles(id)
    const { data, error } = await supabase
      .from('user_documents')
      .select('*, profiles(email, first_name, last_name)')
      .order('created_at', { ascending: false });

    if (data) {
      setDocuments(data);
    }
    setLoading(false);
  };

  const approveDocument = async (docId: string, userId: string) => {
    await supabase.from('user_documents').update({ status: 'approved' }).eq('id', docId);
    await supabase.from('profiles').update({ kyc_status: 'approved' }).eq('id', userId);
    
    // Refresh the list
    fetchDocuments();
  };

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">KYC / NDA Approvals</h1>
        <p className="text-gray-500">Review and approve Master Service Agreements.</p>
      </header>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-red-500" size={32} />
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map(d => (
            <div key={d.id} className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Link to={`/admin/users/${d.user_id}`} className="font-bold text-brand-dark text-lg hover:text-red-600 transition-colors">
                    {d.profiles?.first_name} {d.profiles?.last_name} ({d.profiles?.email})
                  </Link>
                  <p className="font-bold text-gray-500 uppercase mt-1 text-sm">{d.document_type.replace('_', ' ')}</p>
                  <p className="text-xs text-gray-400 mt-1">Submitted: {new Date(d.created_at).toLocaleString()}</p>
                </div>
                <div className="flex flex-col sm:items-end gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${d.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {d.status.toUpperCase()}
                  </span>
                  {d.status === 'pending' && (
                    <button 
                      onClick={() => approveDocument(d.id, d.user_id)} 
                      className="px-6 py-2.5 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                    >
                      Approve Document
                    </button>
                  )}
                </div>
              </div>
              {d.signature_data && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <p className="text-xs font-bold text-gray-400 mb-2 uppercase flex items-center gap-2">
                    <FileText size={14} /> User E-Signature
                  </p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 inline-block">
                    <img src={d.signature_data} alt="Signature" className="max-h-24 mix-blend-multiply" />
                  </div>
                </div>
              )}
            </div>
          ))}
          {documents.length === 0 && (
            <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
              <CheckCircle className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="font-bold text-brand-dark">No KYC Documents</p>
              <p className="text-gray-500 text-sm mt-1">The approval queue is currently empty.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
