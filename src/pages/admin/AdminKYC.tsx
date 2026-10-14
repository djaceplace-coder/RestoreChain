import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Loader2, CheckCircle2, XCircle, FileText, Check, X, 
  Search, RefreshCw, Eye, ShieldCheck, Clock, 
  MapPin, DollarSign, ZoomIn, ExternalLink, Download, AlertCircle, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface KycDocument {
  id: string;
  user_id: string;
  document_type: string;
  document_url?: string | null;
  document_back_url?: string | null;
  selfie_url?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  is_profile_only?: boolean;
  profiles?: {
    email?: string;
    first_name?: string;
    last_name?: string;
    address?: string;
    preferred_currency?: string;
    preferred_language?: string;
    kyc_status?: string;
  };
}

interface NdaDocument {
  id: string;
  user_id: string;
  document_type: string;
  signature_data?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  profiles?: {
    email?: string;
    first_name?: string;
    last_name?: string;
    kyc_status?: string;
  };
}

export default function AdminKYC() {
  const [documents, setDocuments] = useState<NdaDocument[]>([]);
  const [kycDocs, setKycDocs] = useState<KycDocument[]>([]);
  const [activeTab, setActiveTab] = useState<'kyc' | 'nda' | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);
  const [selectedNdaModal, setSelectedNdaModal] = useState<NdaDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();

    // Subscribe to realtime changes on kyc_documents, user_documents, and profiles
    const channel = supabase.channel('admin_kyc_nda_changes-' + Date.now())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kyc_documents' }, () => {
        fetchDocuments(false);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_documents' }, () => {
        fetchDocuments(false);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchDocuments(false);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Clear toast after 4 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchDocuments = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setFetchError(null);
    try {
      // 1. Fetch profiles lookup map
      const { data: allProfiles, error: profileErr } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, address, preferred_currency, preferred_language, kyc_status');
      
      if (profileErr) {
        console.warn('Profiles fetch warning:', profileErr);
      }

      const profileMap: Record<string, any> = {};
      if (allProfiles) {
        allProfiles.forEach((p: any) => {
          profileMap[p.id] = p;
        });
      }

      // 2. Fetch KYC documents - Try elevated SECURITY DEFINER RPC first (never times out, bypasses RLS)
      let kycList: any[] = [];
      let hadKycFetchError = false;
      const { data: rpcKyc, error: rpcKycErr } = await supabase.rpc('admin_get_kyc_documents');

      if (rpcKyc && Array.isArray(rpcKyc) && !rpcKycErr) {
        kycList = rpcKyc.map((item: any) => ({
          ...item,
          profiles: {
            email: item.email || profileMap[item.user_id]?.email || 'No email attached',
            first_name: item.first_name || profileMap[item.user_id]?.first_name || '',
            last_name: item.last_name || profileMap[item.user_id]?.last_name || '',
            address: profileMap[item.user_id]?.address || '',
            preferred_currency: profileMap[item.user_id]?.preferred_currency || 'USD',
            preferred_language: profileMap[item.user_id]?.preferred_language || 'en',
            kyc_status: item.profile_kyc_status || item.status,
            account_status: item.account_status || 'active'
          }
        }));
      } else {
        // Direct query fallback
        const { data: kycDirect, error: kycDirectErr } = await supabase
          .from('kyc_documents')
          .select('*')
          .order('created_at', { ascending: false });

        if (kycDirect) {
          kycList = kycDirect;
        } else if (kycDirectErr) {
          console.warn('kycDirect error:', kycDirectErr);
          hadKycFetchError = true;
          if (!kycDirectErr.message?.includes('0 rows')) {
            setFetchError(`Database notice: ${kycDirectErr.message}`);
          }
        }
      }

      // Profile Bridging: only synthesize if there was NO database error
      // (prevents falsely showing "No photos stored" when the database query simply timed out)
      const userIdsWithKyc = new Set(kycList.map((d: any) => d.user_id));
      if (allProfiles && !hadKycFetchError) {
        allProfiles.forEach((p: any) => {
          if (p.kyc_status === 'pending' && !userIdsWithKyc.has(p.id)) {
            kycList.push({
              id: `profile-${p.id}`,
              user_id: p.id,
              document_type: 'Identity Verification (Profile)',
              document_url: null,
              document_back_url: null,
              selfie_url: null,
              status: 'pending',
              created_at: new Date().toISOString(),
              is_profile_only: true,
              profiles: p
            });
          }
        });
      }

      // Merge profile information gracefully
      const hydratedKyc: KycDocument[] = kycList.map((d: any) => {
        const p = d.profiles || profileMap[d.user_id] || {};
        return {
          id: d.id,
          user_id: d.user_id,
          document_type: d.document_type || 'ID Document',
          document_url: d.document_url || null,
          document_back_url: d.document_back_url || null,
          selfie_url: d.selfie_url || null,
          status: (d.status || 'pending').toLowerCase() as any,
          created_at: d.created_at || new Date().toISOString(),
          is_profile_only: d.is_profile_only || false,
          profiles: {
            email: p.email || 'No email attached',
            first_name: p.first_name || '',
            last_name: p.last_name || '',
            address: p.address || '',
            preferred_currency: p.preferred_currency || 'USD',
            preferred_language: p.preferred_language || 'en',
            kyc_status: p.kyc_status || d.status
          }
        };
      });
      setKycDocs(hydratedKyc);

      // 3. Resilient fetch for NDA (user_documents) - Try RPC first, fallback to direct
      let ndaList: any[] = [];
      const { data: rpcNda, error: rpcNdaErr } = await supabase.rpc('admin_get_nda_documents');

      if (rpcNda && Array.isArray(rpcNda) && !rpcNdaErr) {
        ndaList = rpcNda.map((item: any) => ({
          ...item,
          profiles: {
            email: item.email || profileMap[item.user_id]?.email || 'No email attached',
            first_name: item.first_name || profileMap[item.user_id]?.first_name || '',
            last_name: item.last_name || profileMap[item.user_id]?.last_name || '',
            kyc_status: item.profile_kyc_status || 'unverified'
          }
        }));
      } else {
        const { data: ndaDirect, error: ndaDirectErr } = await supabase
          .from('user_documents')
          .select('*')
          .order('created_at', { ascending: false });

        if (ndaDirect) {
          ndaList = ndaDirect;
        } else if (ndaDirectErr) {
          console.warn('ndaDirect error:', ndaDirectErr);
        }
      }

      const hydratedNda: NdaDocument[] = ndaList.map((d: any) => {
        const p = d.profiles || profileMap[d.user_id] || {};
        return {
          id: d.id,
          user_id: d.user_id,
          document_type: d.document_type || 'terms_agreement',
          signature_data: d.signature_data || null,
          status: (d.status || 'pending').toLowerCase() as any,
          created_at: d.created_at || new Date().toISOString(),
          profiles: {
            email: p.email || 'No email attached',
            first_name: p.first_name || '',
            last_name: p.last_name || '',
            kyc_status: p.kyc_status || 'unverified'
          }
        };
      });
      setDocuments(hydratedNda);

    } catch (err: any) {
      console.error('Error in fetchDocuments:', err);
      setFetchError(err.message || 'Error communicating with database');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleKycAction = async (docId: string, userId: string, action: 'approved' | 'rejected') => {
    setActionLoadingId(docId);
    try {
      const isProfileOnly = docId.startsWith('profile-');

      if (!isProfileOnly) {
        // 1. Try RPC execution first
        const { error: rpcErr } = await supabase.rpc('admin_update_kyc_status', {
          target_user_id: userId,
          doc_id: docId,
          source_table: 'kyc_documents',
          new_status: action
        });

        if (rpcErr) {
          console.warn('RPC failed, falling back to direct table updates:', rpcErr);
          await supabase.from('kyc_documents').update({ status: action }).eq('id', docId);
        }
      }

      // Always update profiles.kyc_status
      await supabase.from('profiles').update({ kyc_status: action }).eq('id', userId);

      // Send system notification to client
      try {
        await supabase.from('notifications').insert({
          user_id: userId,
          type: action === 'approved' ? 'system' : 'alert',
          title: action === 'approved' ? 'Identity Verification Approved' : 'Identity Verification Rejected',
          message: action === 'approved'
            ? 'Your identity documents have been verified and approved by compliance. You now have full access to all platform features.'
            : 'Your submitted identity documents were not approved by compliance. Please review requirements and submit clear, valid documents.'
        });
      } catch (e) {
        // non-fatal
      }

      setToast({
        type: 'success',
        message: `KYC verification marked as ${action.toUpperCase()} successfully.`
      });

      await fetchDocuments(false);
    } catch (err: any) {
      console.error('Error handling KYC action:', err);
      setToast({
        type: 'error',
        message: err.message || 'Failed to update KYC status.'
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRequestReupload = async (userId: string, email: string) => {
    setActionLoadingId(`reupload-${userId}`);
    try {
      // 1. Try atomic database RPC with elevated SECURITY DEFINER privileges
      const { error: rpcErr } = await supabase.rpc('admin_request_kyc_resubmission', {
        target_user_id: userId,
        reason: 'Compliance has requested fresh, clearer photographic credentials for your ID. Please open Identity Verification in your Settings or Portfolio to snap live photos.'
      });

      if (rpcErr) {
        console.warn('RPC admin_request_kyc_resubmission note, running direct updates:', rpcErr);

        // Fallback: Dispatch in-app notification to the user
        await supabase.from('notifications').insert({
          user_id: userId,
          type: 'alert',
          title: 'Action Required: Live ID Verification Requested',
          message: 'Compliance has requested fresh, clearer photographic credentials for your ID. Please open Identity Verification in your Settings or Portfolio to snap live photos.'
        });

        // Set profile kyc_status to unverified so user can immediately re-upload
        await supabase.from('profiles').update({ kyc_status: 'unverified' }).eq('id', userId);

        // Mark existing pending kyc_documents as rejected so they no longer inflate pending badges
        await supabase.from('kyc_documents')
          .update({ 
            status: 'rejected', 
            rejection_reason: 'Photo re-upload requested by compliance',
            updated_at: new Date().toISOString() 
          })
          .eq('user_id', userId)
          .eq('status', 'pending');
      }

      setToast({
        type: 'success',
        message: `Live photo request & in-app notification dispatched to ${email || 'user'}.`
      });
      await fetchDocuments(false);
    } catch (err: any) {
      setToast({
        type: 'error',
        message: 'Failed to dispatch re-upload request: ' + err.message
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleNdaAction = async (docId: string, userId: string, action: 'approved' | 'rejected') => {
    setActionLoadingId(docId);
    try {
      // 1. Try RPC execution
      const { error: rpcErr } = await supabase.rpc('admin_update_kyc_status', {
        target_user_id: userId,
        doc_id: docId,
        source_table: 'user_documents',
        new_status: action
      });

      if (rpcErr) {
        console.warn('RPC failed, falling back to direct table update:', rpcErr);
        await supabase.from('user_documents').update({ status: action }).eq('id', docId);
      }

      // Send notification to client
      try {
        await supabase.from('notifications').insert({
          user_id: userId,
          type: action === 'approved' ? 'system' : 'alert',
          title: action === 'approved' ? 'Master Services Agreement Executed' : 'Agreement Submission Rejected',
          message: action === 'approved'
            ? 'Your Master Services Agreement & Mutual NDA has been approved and countersigned by Tracefield Forensic Compliance.'
            : 'Your submitted Master Services Agreement was not approved. Please review terms and resubmit your verified electronic signature.'
        });
      } catch (e) {
        // non-fatal
      }

      setToast({
        type: 'success',
        message: `Master Services Agreement marked as ${action.toUpperCase()} successfully.`
      });

      if (selectedNdaModal && selectedNdaModal.id === docId) {
        setSelectedNdaModal({
          ...selectedNdaModal,
          status: action
        });
      }

      await fetchDocuments(false);
    } catch (err: any) {
      console.error('Error handling NDA action:', err);
      setToast({
        type: 'error',
        message: err.message || 'Failed to update agreement status.'
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filtered lists
  const pendingKycCount = kycDocs.filter(d => d.status === 'pending').length;
  const pendingNdaCount = documents.filter(d => d.status === 'pending').length;
  const totalPendingCount = pendingKycCount + pendingNdaCount;

  const filteredKycDocs = kycDocs.filter(d => {
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesStatus;
    const name = `${d.profiles?.first_name || ''} ${d.profiles?.last_name || ''}`.toLowerCase();
    const email = (d.profiles?.email || '').toLowerCase();
    const docType = (d.document_type || '').toLowerCase();
    return matchesStatus && (name.includes(q) || email.includes(q) || docType.includes(q) || d.id.includes(q));
  });

  const filteredNdaDocs = documents.filter(d => {
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesStatus;
    const name = `${d.profiles?.first_name || ''} ${d.profiles?.last_name || ''}`.toLowerCase();
    const email = (d.profiles?.email || '').toLowerCase();
    return matchesStatus && (name.includes(q) || email.includes(q) || d.id.includes(q));
  });

  const formatDocType = (type: string) => {
    if (!type) return 'Identity Document';
    const lower = type.toLowerCase();
    if (lower.includes('passport')) return 'International Passport';
    if (lower.includes('driver')) return "Driver's License";
    if (lower.includes('national')) return 'National Identity Card';
    if (lower.includes('ssn')) return 'Social Security Card (SSN)';
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleDownload = (dataUrl: string, filename: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="animate-fade-in pb-16">
      {/* Toast Banner */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm font-bold border transition-all animate-bounce-subtle ${
          toast.type === 'success' 
            ? 'bg-emerald-900 text-white border-emerald-700' 
            : 'bg-red-900 text-white border-red-700'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-400" /> : <XCircle size={18} className="text-red-400" />}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 opacity-70 hover:opacity-100">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-1">Compliance, KYC & NDAs</h1>
          <p className="text-gray-500 text-sm">
            Review identity verifications, verify photographic credentials, and validate signed Master Service Agreements.
          </p>
        </div>
        <button
          onClick={() => fetchDocuments(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-brand-dark text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm self-start md:self-auto cursor-pointer"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin text-brand-purple' : 'text-gray-500'} />
          Refresh Queue
        </button>
      </div>

      {fetchError && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-800">
          <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Database Connectivity Notice</p>
            <p>{fetchError}</p>
          </div>
          <button onClick={() => setFetchError(null)} className="text-amber-600 hover:text-amber-800">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Attention banner if pending agreements exist while viewing KYC tab */}
      {pendingKycCount === 0 && pendingNdaCount > 0 && activeTab === 'kyc' && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 font-bold text-sm">
              {pendingNdaCount}
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">Pending Master Agreement / NDA awaiting review</h4>
              <p className="text-xs text-amber-700">
                There are {pendingNdaCount} signed legal agreements pending compliance approval in the Master Agreements tab.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('nda')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Review Agreements ({pendingNdaCount})</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Primary Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 mb-6">
        <div className="flex gap-2 sm:gap-6">
          <button
            onClick={() => setActiveTab('kyc')}
            className={`pb-3 font-bold text-sm sm:text-base flex items-center gap-2 transition-colors relative cursor-pointer ${
              activeTab === 'kyc'
                ? 'border-b-2 border-brand-purple text-brand-purple'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <ShieldCheck size={18} />
            <span>KYC Verifications</span>
            {pendingKycCount > 0 ? (
              <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                {pendingKycCount} pending
              </span>
            ) : (
              <span className="px-2 py-0.5 text-[11px] font-bold bg-gray-100 text-gray-500 rounded-full">
                {kycDocs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('nda')}
            className={`pb-3 font-bold text-sm sm:text-base flex items-center gap-2 transition-colors relative cursor-pointer ${
              activeTab === 'nda'
                ? 'border-b-2 border-brand-purple text-brand-purple'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <FileText size={18} />
            <span>Master Agreements & NDAs</span>
            {pendingNdaCount > 0 ? (
              <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                {pendingNdaCount} pending
              </span>
            ) : (
              <span className="px-2 py-0.5 text-[11px] font-bold bg-gray-100 text-gray-500 rounded-full">
                {documents.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 font-bold text-sm sm:text-base flex items-center gap-2 transition-colors relative cursor-pointer ${
              activeTab === 'all'
                ? 'border-b-2 border-brand-purple text-brand-purple'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>All Submissions</span>
            {totalPendingCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-purple-100 text-brand-purple rounded-full border border-purple-200">
                {totalPendingCount} pending
              </span>
            )}
          </button>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-3 pb-3">
          <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold">
            {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-white text-brand-dark shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by user name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-gray-200">
          <Loader2 className="animate-spin text-brand-purple mb-4" size={36} />
          <p className="text-gray-500 font-bold text-sm">Loading compliance queue...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* TAB 1: KYC VERIFICATIONS */}
          {(activeTab === 'kyc' || activeTab === 'all') && (
            <>
              {activeTab === 'all' && (
                <div className="flex items-center gap-2 pt-2">
                  <ShieldCheck size={18} className="text-brand-purple" />
                  <h3 className="font-bold text-brand-dark text-base">Photographic Identity Verifications</h3>
                </div>
              )}

              {filteredKycDocs.map((d) => (
                <div key={d.id} className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                  {/* Top Bar: User details + Status badge + Actions */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/admin/users/${d.user_id}`}
                          className="font-bold text-brand-dark text-lg hover:text-brand-purple transition-colors flex items-center gap-1.5"
                        >
                          <span>{d.profiles?.first_name || 'Verified'} {d.profiles?.last_name || 'Client'}</span>
                          <ExternalLink size={14} className="text-gray-400 inline" />
                        </Link>
                        <span className="text-sm text-gray-500 font-mono">({d.profiles?.email})</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-brand-purple font-bold border border-purple-100">
                          {formatDocType(d.document_type)}
                        </span>
                        <span className="flex items-center gap-1 text-gray-400">
                          <Clock size={13} />
                          Submitted {new Date(d.created_at).toLocaleString()}
                        </span>
                        {d.profiles?.address && (
                          <span className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                            <MapPin size={12} className="text-gray-400" />
                            {d.profiles.address}
                          </span>
                        )}
                        {d.profiles?.preferred_currency && (
                          <span className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                            <DollarSign size={12} className="text-gray-400" />
                            {d.profiles.preferred_currency}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-start lg:self-auto">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                        d.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : d.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {d.status}
                      </span>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        {d.status !== 'rejected' && (
                          <button
                            disabled={actionLoadingId === d.id}
                            onClick={() => handleKycAction(d.id, d.user_id, 'rejected')}
                            className="px-3.5 py-2 border border-rose-200 text-rose-700 bg-rose-50 text-xs font-bold rounded-xl hover:bg-rose-100 transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                          >
                            <X size={14} />
                            <span>Reject</span>
                          </button>
                        )}
                        {d.status !== 'approved' && (
                          <button
                            disabled={actionLoadingId === d.id}
                            onClick={() => handleKycAction(d.id, d.user_id, 'approved')}
                            className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                          >
                            {actionLoadingId === d.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                            <span>Approve KYC</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Profile-only Notice */}
                  {d.is_profile_only && (
                    <div className="mt-4 p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 animate-fade-in">
                      <div className="flex items-start gap-3">
                        <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-sm text-amber-950">Identity Profile Captured (No Photos in Database)</p>
                          <p className="text-amber-800 mt-0.5">
                            This user submitted their address and profile details, but photographic documents were not stored (from a submission prior to image compression). You can request live camera photos or approve them directly.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRequestReupload(d.user_id, d.profiles?.email || '')}
                        className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shrink-0 transition-colors shadow-sm cursor-pointer"
                      >
                        Request Live Photo Snap
                      </button>
                    </div>
                  )}

                  {/* KYC Images Grid: ID Front, ID Back, and Biometric Selfie */}
                  <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Front ID */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                          <FileText size={14} className="text-gray-400" />
                          <span>1. Document Front</span>
                        </p>
                        {d.document_url && (
                          <button
                            onClick={() => handleDownload(d.document_url!, `${d.profiles?.last_name || 'user'}_id_front.jpg`)}
                            className="text-gray-400 hover:text-brand-purple p-1"
                            title="Download ID Front"
                          >
                            <Download size={13} />
                          </button>
                        )}
                      </div>

                      {d.document_url ? (
                        <div
                          onClick={() => setSelectedImage({ url: d.document_url!, title: `${formatDocType(d.document_type)} - Front (${d.profiles?.email})` })}
                          className="group relative bg-gray-50 border border-gray-200 rounded-xl p-2 cursor-pointer hover:border-brand-purple hover:shadow transition-all overflow-hidden h-48 flex items-center justify-center"
                        >
                          <img
                            src={d.document_url}
                            alt="Front Document"
                            className="max-h-full max-w-full object-contain rounded group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              // Handle broken base64 or failed image source gracefully
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1 rounded-xl">
                            <ZoomIn size={16} /> Click to Inspect
                          </div>
                        </div>
                      ) : (
                        <div className="h-48 bg-gray-50 border border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 text-xs p-4 text-center">
                          <FileText size={24} className="text-gray-300 mb-1" />
                          <span>Front photo not attached</span>
                          {d.is_profile_only && (
                            <button
                              onClick={() => handleRequestReupload(d.user_id, d.profiles?.email || '')}
                              className="mt-2 text-[11px] font-bold text-brand-purple hover:underline"
                            >
                              Request Upload
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Back ID */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                          <FileText size={14} className="text-gray-400" />
                          <span>2. Document Back</span>
                        </p>
                        {d.document_back_url && (
                          <button
                            onClick={() => handleDownload(d.document_back_url!, `${d.profiles?.last_name || 'user'}_id_back.jpg`)}
                            className="text-gray-400 hover:text-brand-purple p-1"
                            title="Download ID Back"
                          >
                            <Download size={13} />
                          </button>
                        )}
                      </div>

                      {d.document_back_url ? (
                        <div
                          onClick={() => setSelectedImage({ url: d.document_back_url!, title: `${formatDocType(d.document_type)} - Back (${d.profiles?.email})` })}
                          className="group relative bg-gray-50 border border-gray-200 rounded-xl p-2 cursor-pointer hover:border-brand-purple hover:shadow transition-all overflow-hidden h-48 flex items-center justify-center"
                        >
                          <img
                            src={d.document_back_url}
                            alt="Back Document"
                            className="max-h-full max-w-full object-contain rounded group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1 rounded-xl">
                            <ZoomIn size={16} /> Click to Inspect
                          </div>
                        </div>
                      ) : (
                        <div className="h-48 bg-gray-50 border border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-xs p-4 text-center">
                          <span>Back not required or unattached</span>
                        </div>
                      )}
                    </div>

                    {/* Selfie Verification */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 size={14} className="text-gray-400" />
                          <span>3. Biometric Selfie</span>
                        </p>
                        {d.selfie_url && (
                          <button
                            onClick={() => handleDownload(d.selfie_url!, `${d.profiles?.last_name || 'user'}_selfie.jpg`)}
                            className="text-gray-400 hover:text-brand-purple p-1"
                            title="Download Selfie"
                          >
                            <Download size={13} />
                          </button>
                        )}
                      </div>

                      {d.selfie_url ? (
                        <div
                          onClick={() => setSelectedImage({ url: d.selfie_url!, title: `Biometric Selfie - ${d.profiles?.email}` })}
                          className="group relative bg-gray-50 border border-gray-200 rounded-xl p-2 cursor-pointer hover:border-brand-purple hover:shadow transition-all overflow-hidden h-48 flex items-center justify-center"
                        >
                          <img
                            src={d.selfie_url}
                            alt="Identity Selfie"
                            className="max-h-full max-w-full object-contain rounded group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1 rounded-xl">
                            <ZoomIn size={16} /> Click to Inspect
                          </div>
                        </div>
                      ) : (
                        <div className="h-48 bg-gray-50 border border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-xs p-4 text-center">
                          <span>No selfie photo attached</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredKycDocs.length === 0 && activeTab === 'kyc' && (
                <div className="bg-white p-16 text-center rounded-2xl border border-gray-200">
                  <CheckCircle2 className="mx-auto text-emerald-500 mb-3" size={48} />
                  <p className="font-bold text-brand-dark text-lg">No KYC Documents in this view</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {statusFilter !== 'all' 
                      ? `There are no documents matching the status filter "${statusFilter}".` 
                      : 'All client identity verifications have been processed.'}
                  </p>
                </div>
              )}
            </>
          )}

          {/* TAB 2: MASTER AGREEMENTS & NDAs */}
          {(activeTab === 'nda' || activeTab === 'all') && (
            <>
              {activeTab === 'all' && (
                <div className="flex items-center gap-2 pt-6">
                  <FileText size={18} className="text-blue-600" />
                  <h3 className="font-bold text-brand-dark text-base">Master Services Agreements & Mutual NDAs</h3>
                </div>
              )}

              {filteredNdaDocs.map((d) => (
                <div key={d.id} className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/admin/users/${d.user_id}`}
                          className="font-bold text-brand-dark text-lg hover:text-brand-purple transition-colors flex items-center gap-1.5"
                        >
                          <span>{d.profiles?.first_name || 'Client'} {d.profiles?.last_name || 'Agreement'}</span>
                          <ExternalLink size={14} className="text-gray-400 inline" />
                        </Link>
                        <span className="text-sm text-gray-500 font-mono">({d.profiles?.email})</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-100">
                          Master Services Agreement & Mutual NDA
                        </span>
                        <span className="text-gray-400 font-mono">
                          Ref: TF-MSA-{d.id.slice(0, 8).toUpperCase()}
                        </span>
                        <span className="flex items-center gap-1 text-gray-400">
                          <Clock size={13} />
                          Signed & Submitted: {new Date(d.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-start lg:self-auto">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                        d.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : d.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {d.status}
                      </span>

                      {/* Modal preview trigger */}
                      <button
                        onClick={() => setSelectedNdaModal(d)}
                        className="px-3.5 py-2 bg-gray-100 text-brand-dark text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye size={14} />
                        <span>View Signed Agreement</span>
                      </button>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        {d.status !== 'rejected' && (
                          <button
                            disabled={actionLoadingId === d.id}
                            onClick={() => handleNdaAction(d.id, d.user_id, 'rejected')}
                            className="px-3.5 py-2 border border-rose-200 text-rose-700 bg-rose-50 text-xs font-bold rounded-xl hover:bg-rose-100 transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                          >
                            <X size={14} />
                            <span>Reject</span>
                          </button>
                        )}
                        {d.status !== 'approved' && (
                          <button
                            disabled={actionLoadingId === d.id}
                            onClick={() => handleNdaAction(d.id, d.user_id, 'approved')}
                            className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                          >
                            {actionLoadingId === d.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                            <span>Approve Agreement</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Document Signature Preview Bar */}
                  <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-brand-dark">Legally Binding Cryptographic E-Signature</p>
                        <p className="text-xs text-gray-500">Client verified terms and executed digital signature on submission.</p>
                      </div>
                    </div>

                    {d.signature_data ? (
                      <div 
                        onClick={() => setSelectedNdaModal(d)}
                        className="bg-white border border-gray-200 rounded-xl p-2 px-4 flex items-center gap-3 cursor-pointer hover:border-brand-purple transition-colors max-w-xs"
                      >
                        <span className="text-xs font-bold text-gray-400 uppercase">Signature:</span>
                        <img src={d.signature_data} alt="Client Signature" className="h-10 max-w-[140px] object-contain mix-blend-multiply" />
                        <Eye size={14} className="text-gray-400 ml-auto" />
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">No signature artifact recorded</span>
                    )}
                  </div>
                </div>
              ))}

              {filteredNdaDocs.length === 0 && activeTab === 'nda' && (
                <div className="bg-white p-16 text-center rounded-2xl border border-gray-200">
                  <CheckCircle2 className="mx-auto text-emerald-500 mb-3" size={48} />
                  <p className="font-bold text-brand-dark text-lg">No Master Agreements in this view</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {statusFilter !== 'all' 
                      ? `There are no agreements matching the status filter "${statusFilter}".` 
                      : 'All client agreements have been reviewed.'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* LIGHTBOX MODAL FOR ZOOMING KYC IMAGES */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-fade-in backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-full flex items-center justify-between text-white pb-3">
              <span className="font-bold text-sm truncate max-w-lg">{selectedImage.title}</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownload(selectedImage.url, 'document_credential.jpg')}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={14} />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="bg-black/60 rounded-2xl overflow-hidden border border-white/10 p-2 flex items-center justify-center max-h-[80vh] w-full shadow-2xl">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-w-full max-h-[75vh] object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* FULL SIGNED AGREEMENT MODAL FOR NDAS */}
      {selectedNdaModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 animate-fade-in backdrop-blur-sm"
          onClick={() => setSelectedNdaModal(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50 rounded-t-2xl sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-brand-purple flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-brand-dark text-base">
                    Master Services Agreement & Mutual NDA
                  </h3>
                  <p className="text-xs text-gray-500 font-mono">
                    Ref: TF-MSA-{selectedNdaModal.id.slice(0, 8).toUpperCase()} • Status: <span className="uppercase font-bold">{selectedNdaModal.status}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNdaModal(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Agreement Document Content */}
            <div className="p-8 md:p-12 text-sm text-gray-800 font-serif leading-relaxed bg-white space-y-6">
              <div className="text-center border-b-2 border-gray-900 pb-6 mb-6">
                <h1 className="text-2xl font-bold uppercase tracking-widest text-black mb-1 font-sans">
                  Tracefield Forensic Intelligence Ltd
                </h1>
                <p className="text-gray-600 font-sans text-xs uppercase tracking-wider">
                  MASTER SERVICES AGREEMENT & MUTUAL CONFIDENTIALITY TERMS
                </p>
                <p className="text-xs text-gray-400 font-sans mt-1">London, United Kingdom • compliance@tracefield.co.uk</p>
              </div>

              <div className="flex justify-between text-xs font-sans text-gray-500 border-b border-gray-100 pb-3">
                <span>Date: {new Date(selectedNdaModal.created_at).toLocaleDateString()}</span>
                <span>Account: <strong>{selectedNdaModal.profiles?.email}</strong></span>
              </div>

              <div className="space-y-4 text-justify">
                <p>
                  This Master Services Agreement and Mutual Non-Disclosure Terms (this "Agreement") is entered into between Tracefield Forensic Intelligence Ltd. ("Company") and the Client listed above, governing on-chain evidentiary asset tracing, cryptographic integrity auditing, and institutional portfolio management under UK compliance frameworks.
                </p>

                <h4 className="font-bold font-sans text-base text-gray-900 mt-4">1. Scope of Services & Forensic Deliverables</h4>
                <p>
                  Tracefield delivers mathematical ledger analysis, cryptographic tracking, and court-admissible forensic documentation for submission to legal counsel and law enforcement authorities. All platform engagements follow stringent anti-money laundering (AML) and know-your-customer (KYC) regulatory intake standards.
                </p>

                <h4 className="font-bold font-sans text-base text-gray-900 mt-4">2. Mutual Confidentiality & Non-Disclosure (NDA)</h4>
                <p>
                  Both parties covenant that all transaction hashes, private evidentiary reports, wallet forensics, and communication exchanged shall remain strictly confidential. Neither party shall disclose proprietary methodologies, confidential findings, or client identity without prior statutory or judicial mandate.
                </p>

                <h4 className="font-bold font-sans text-base text-gray-900 mt-4">3. Custodial Integrity & Statutory Clearances</h4>
                <p>
                  The Client acknowledges that assets tracked or managed under Tracefield infrastructure are governed by rigorous cryptographic verification. Disbursements and asset movements are safeguarded through cryptographic multi-signatory protocols and administrative compliance clearance.
                </p>
              </div>

              {/* Signatures Dual Block */}
              <div className="pt-8 border-t-2 border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
                {/* Company Authorized Signature */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase">Authorized Corporate Signature</p>
                  <div className="italic text-2xl text-blue-900 py-1" style={{ fontFamily: "'Brush Script MT', cursive" }}>
                    Mark Glenn
                  </div>
                  <div className="h-px bg-gray-900 w-full"></div>
                  <p className="font-bold text-xs text-gray-900">Mark Glenn</p>
                  <p className="text-xs text-gray-500">Head of Forensic Intelligence, Tracefield Ltd</p>
                </div>

                {/* Client Verified E-Signature */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase">Client Execution Signature</p>
                  {selectedNdaModal.signature_data ? (
                    <div className="h-10 flex items-center">
                      <img
                        src={selectedNdaModal.signature_data}
                        alt="Client Verified Signature"
                        className="max-h-10 mix-blend-multiply"
                      />
                    </div>
                  ) : (
                    <div className="h-10 text-xs italic text-gray-400 flex items-center">
                      Pending electronic signature
                    </div>
                  )}
                  <div className="h-px bg-gray-900 w-full"></div>
                  <p className="font-bold text-xs text-gray-900">
                    {selectedNdaModal.profiles?.first_name} {selectedNdaModal.profiles?.last_name || selectedNdaModal.profiles?.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    Timestamp: {new Date(selectedNdaModal.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex items-center justify-between sticky bottom-0 z-10">
              <button
                onClick={() => setSelectedNdaModal(null)}
                className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-3">
                {selectedNdaModal.status !== 'rejected' && (
                  <button
                    disabled={actionLoadingId === selectedNdaModal.id}
                    onClick={() => handleNdaAction(selectedNdaModal.id, selectedNdaModal.user_id, 'rejected')}
                    className="px-4 py-2 border border-rose-200 text-rose-700 bg-rose-50 text-xs font-bold rounded-xl hover:bg-rose-100 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Reject Agreement
                  </button>
                )}
                {selectedNdaModal.status !== 'approved' && (
                  <button
                    disabled={actionLoadingId === selectedNdaModal.id}
                    onClick={() => handleNdaAction(selectedNdaModal.id, selectedNdaModal.user_id, 'approved')}
                    className="px-5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    {actionLoadingId === selectedNdaModal.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    <span>Approve & Countersign</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
