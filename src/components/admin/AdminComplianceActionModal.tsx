import React, { useState } from 'react';
import { ShieldAlert, Camera, FileText, X, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AdminComplianceActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    account_status?: string;
    kyc_status?: string;
  } | null;
  actionType: 'kyc' | 'nda';
  onSuccess?: () => void;
}

export default function AdminComplianceActionModal({
  isOpen,
  onClose,
  user,
  actionType,
  onSuccess
}: AdminComplianceActionModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const defaultKycReason =
    'Your account has been temporarily placed on compliance hold pending photographic identity re-verification. Please submit fresh live camera photos of your ID and biometric selfie to restore full account access.';

  const defaultNdaReason =
    'Your account has been temporarily placed on compliance hold pending execution of your updated Master Services Agreement & Mutual NDA. Please review and sign the agreement to restore full access.';

  const [customReason, setCustomReason] = useState(
    actionType === 'kyc' ? defaultKycReason : defaultNdaReason
  );

  // Keep reason in sync if actionType toggles
  React.useEffect(() => {
    setCustomReason(actionType === 'kyc' ? defaultKycReason : defaultNdaReason);
    setErrorMsg('');
    setSuccessMsg('');
  }, [actionType, user?.id]);

  if (!isOpen || !user) return null;

  const isKyc = actionType === 'kyc';
  const userName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'User';

  const handleConfirm = async () => {
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const targetUserId = user.id;
      const reasonText = customReason.trim();

      if (isKyc) {
        // 1. Try elevated RPC first
        const { error: rpcError } = await supabase.rpc('admin_suspend_and_request_kyc', {
          target_user_id: targetUserId,
          reason: reasonText
        });

        if (rpcError) {
          console.warn('RPC admin_suspend_and_request_kyc fallback:', rpcError.message);
          // 2. Direct resilient database update fallback
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              account_status: 'suspended',
              kyc_status: 'unverified',
              updated_at: new Date().toISOString()
            })
            .eq('id', targetUserId);

          if (profileError) throw profileError;

          // Clear previous kyc_documents so fresh live photos can be snapped cleanly
          await supabase.from('kyc_documents').delete().eq('user_id', targetUserId);

          // Insert high priority notification
          await supabase.from('notifications').insert({
            user_id: targetUserId,
            type: 'alert',
            title: 'Compliance Hold: Identity Re-Verification Required',
            message: reasonText || defaultKycReason,
            is_read: false
          });
        }
      } else {
        // NDA action
        const { error: rpcError } = await supabase.rpc('admin_suspend_and_request_nda', {
          target_user_id: targetUserId,
          reason: reasonText
        });

        if (rpcError) {
          console.warn('RPC admin_suspend_and_request_nda fallback:', rpcError.message);
          // Direct fallback
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              account_status: 'suspended',
              updated_at: new Date().toISOString()
            })
            .eq('id', targetUserId);

          if (profileError) throw profileError;

          // Mark previous NDA agreements as rejected so user is prompted to sign again
          await supabase
            .from('user_documents')
            .update({
              status: 'rejected',
              updated_at: new Date().toISOString()
            })
            .eq('user_id', targetUserId)
            .eq('document_type', 'terms_agreement');

          // Insert notification
          await supabase.from('notifications').insert({
            user_id: targetUserId,
            type: 'alert',
            title: 'Compliance Hold: Master Agreement / NDA Signing Required',
            message: reasonText || defaultNdaReason,
            is_read: false
          });
        }
      }

      // Dispatch real-time sync event to any active session of this user
      try {
        const syncChannel = supabase.channel(`sync-${targetUserId}`);
        syncChannel.subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            syncChannel.send({
              type: 'broadcast',
              event: isKyc ? 'admin_kyc_reverification_requested' : 'admin_nda_request',
              payload: {
                target_user_id: targetUserId,
                action: isKyc ? 'kyc_reverification' : 'nda_signature',
                timestamp: Date.now()
              }
            }).then(() => {
              supabase.removeChannel(syncChannel);
            });
          }
        });
      } catch (broadcastErr) {
        console.warn('Broadcast notice (non-fatal):', broadcastErr);
      }

      setSuccessMsg(
        isKyc
          ? `Account for ${userName} has been suspended and KYC re-verification requested.`
          : `Account for ${userName} has been suspended and NDA signing requested.`
      );

      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);

    } catch (err: any) {
      console.error('Failed to execute compliance suspension action:', err);
      setErrorMsg(err.message || 'An unexpected error occurred while updating the account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative animate-scale-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={submitting}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isKyc ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-brand-purple'
            }`}
          >
            {isKyc ? <Camera size={24} /> : <FileText size={24} />}
          </div>
          <div>
            <h3 className="text-xl font-bold font-display text-brand-dark">
              {isKyc ? 'Suspend & Request KYC Re-Verification' : 'Suspend & Request NDA Verification'}
            </h3>
            <p className="text-xs text-gray-500">
              Compliance Enforcement & Mandatory Resubmission
            </p>
          </div>
        </div>

        {/* Target User Details Card */}
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 mb-5 flex items-center justify-between">
          <div>
            <p className="font-bold text-sm text-brand-dark">{userName}</p>
            <p className="text-xs text-gray-500 font-mono">{user.email}</p>
          </div>
          <div className="text-right">
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                user.account_status === 'suspended'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              Status: {user.account_status || 'active'}
            </span>
            <span className="block text-[10px] text-gray-400 mt-1 uppercase font-bold">
              KYC: {user.kyc_status || 'unverified'}
            </span>
          </div>
        </div>

        {/* Impact Warning Notice */}
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl mb-5 flex items-start gap-3">
          <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={18} />
          <div className="text-xs text-red-800 space-y-1">
            <p className="font-bold text-red-950">Immediate Account Impact:</p>
            <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
              <li>Account will be <strong>Suspended</strong> immediately.</li>
              {isKyc ? (
                <>
                  <li>KYC status will be reset to <strong>Unverified</strong>.</li>
                  <li>Old photos are archived so user can snap live camera photos upon login.</li>
                </>
              ) : (
                <>
                  <li>Agreement status will be reset to <strong>Pending Signature</strong>.</li>
                  <li>User must sign the Master Services Agreement & Mutual NDA to unlock access.</li>
                </>
              )}
              <li>An urgent compliance notification is dispatched to their portal.</li>
            </ul>
          </div>
        </div>

        {/* Custom Reason Field */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Notification Message to User
          </label>
          <textarea
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            rows={3}
            disabled={submitting}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-brand-dark focus:bg-white transition-all font-sans"
            placeholder="Enter reason for suspension and required compliance step..."
          />
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 text-xs rounded-xl flex items-center gap-2">
            <AlertTriangle size={16} className="shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0 text-green-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs text-white flex items-center gap-2 shadow-md transition-all ${
              isKyc
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-brand-purple hover:bg-purple-700'
            }`}
          >
            {submitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <ShieldAlert size={14} />
                {isKyc ? 'Suspend & Request KYC' : 'Suspend & Request NDA'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
