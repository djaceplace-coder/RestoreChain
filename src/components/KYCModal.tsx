import React, { useState } from 'react';
import { Shield, CheckCircle2, ChevronRight, FileText, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import Modal from './ui/Modal';
import LiveCamera from './LiveCamera';
import { supabase } from '../lib/supabase';

interface KYCModalProps {
  isOpen: boolean;
  onClose: (skipped: boolean) => void;
  user: any;
  onSuccess: () => void;
}

export default function KYCModal({ isOpen, onClose, user, onSuccess }: KYCModalProps) {
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState<'passport' | "driver's license" | 'national id' | 'residence permit'>('passport');
  
  // Live snapped photos
  const [docFile, setDocFile] = useState<string | null>(null);
  const [docBackFile, setDocBackFile] = useState<string | null>(null);
  const [selfieFile, setSelfieFile] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const [address, setAddress] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');

  const needsBack = docType !== 'passport';

  // Reset helper
  const handleModalClose = (skipped = true) => {
    setStep(1);
    setDocFile(null);
    setDocBackFile(null);
    setSelfieFile(null);
    setSubmitError(null);
    onClose(skipped);
  };

  // Dual storage strategy: attempt Supabase Storage bucket 'kyc', fallback to direct compressed data URL
  const uploadOrEncodePhoto = async (dataUrl: string | null, label: string): Promise<string | null> => {
    if (!dataUrl || !user?.id) return null;

    try {
      if (supabase) {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const filename = `${user.id}/${Date.now()}_${label}.jpg`;

        const { data, error } = await supabase.storage.from('kyc').upload(filename, blob, {
          contentType: 'image/jpeg',
          upsert: true
        });

        if (!error && data?.path) {
          const { data: publicData } = supabase.storage.from('kyc').getPublicUrl(data.path);
          if (publicData?.publicUrl) {
            return publicData.publicUrl;
          }
        }
      }
    } catch (err) {
      console.warn('Storage bucket upload failed, preserving compressed dataUrl in database:', err);
    }

    // Direct dataUrl fallback (fits into PostgreSQL text column)
    return dataUrl;
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (!docFile || !selfieFile || (needsBack && !docBackFile)) {
        throw new Error('Please snap all required live photos before submitting.');
      }

      // Funnel images (Storage URL or optimized data URL)
      const finalDocUrl = await uploadOrEncodePhoto(docFile, 'front');
      const finalBackUrl = needsBack ? await uploadOrEncodePhoto(docBackFile, 'back') : null;
      const finalSelfieUrl = await uploadOrEncodePhoto(selfieFile, 'selfie');

      if (!supabase) {
        // Demo mode fallback
        setStep(7);
        return;
      }

      // 1. Insert photographic credentials record into kyc_documents
      const { error: kycError } = await supabase.from('kyc_documents').insert({
        user_id: user.id,
        document_type: docType,
        document_url: finalDocUrl,
        document_back_url: finalBackUrl,
        selfie_url: finalSelfieUrl,
        status: 'pending'
      });

      if (kycError) {
        console.error('kyc_documents insert error:', kycError);
        throw new Error(kycError.message || 'Failed to save identity documents to database.');
      }

      // 2. Update user profile to mark KYC as pending with residential address & preferences
      const { error: profileError } = await supabase.from('profiles').update({
        kyc_status: 'pending',
        address: address,
        preferred_currency: currency,
        preferred_language: language
      }).eq('id', user.id);

      if (profileError) {
        console.warn('Profile update warning:', profileError);
      }

      // 3. Create client system notification for transparency
      try {
        await supabase.from('notifications').insert({
          user_id: user.id,
          type: 'system',
          title: 'Identity Verification Submitted',
          message: 'Your live photographic identity credentials have been submitted securely and are under review by our compliance team.'
        });
      } catch (e) {
        // non-fatal
      }

      setStep(7); // Verification Pending confirmation step
    } catch (err: any) {
      console.error('Error in KYC submission:', err);
      setSubmitError(err.message || 'Failed to submit KYC verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDocTypeName = (t: string) => {
    if (t === 'passport') return 'International Passport';
    if (t === "driver's license") return "Driver's License";
    if (t === 'national id') return 'National ID Card';
    return 'Residence Permit';
  };

  const renderStep = () => {
    switch (step) {
      // ----------------------------------------------------
      // STEP 1: Overview & Notice (NO camera hardware touched)
      // ----------------------------------------------------
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-brand-purple/5 p-6 rounded-2xl border border-brand-purple/10">
              <Shield className="w-12 h-12 text-brand-purple mb-4" />
              <h3 className="text-xl font-bold text-brand-dark mb-2">Institutional Identity Verification</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                To comply with international financial regulations and protect against unauthorized asset access, we require live photographic verification. This process takes less than 2 minutes.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-bold text-gray-700">Verification Process Requirements:</p>
              <ul className="space-y-2.5 text-sm text-gray-600">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>Valid government photo ID (Passport, Driver's License, or National ID)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>Live camera photo of front & back of ID (no static file uploads permitted)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>Live biometric selfie with camera flip access</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => handleModalClose(true)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer text-sm"
              >
                Skip for Now
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 px-4 py-3 bg-brand-purple text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-md shadow-brand-purple/20 cursor-pointer text-sm"
              >
                Start Verification
              </button>
            </div>
          </div>
        );

      // ----------------------------------------------------
      // STEP 2: Document Selection (NO camera hardware touched)
      // ----------------------------------------------------
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-brand-dark mb-1">Select ID Document Type</h3>
              <p className="text-sm text-gray-500">Choose the government document you will snap live with your camera.</p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'passport', name: 'International Passport', sides: '1 Live Photo (Photo Page)' },
                { id: "driver's license", name: "Driver's License", sides: '2 Live Photos (Front & Back)' },
                { id: 'national id', name: 'National ID Card', sides: '2 Live Photos (Front & Back)' },
                { id: 'residence permit', name: 'Residence Permit', sides: '2 Live Photos (Front & Back)' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setDocType(item.id as any);
                    setStep(3);
                  }}
                  className={`w-full flex items-center justify-between p-4 border rounded-2xl transition-all text-left cursor-pointer ${
                    docType === item.id
                      ? 'border-brand-purple bg-brand-purple/5 ring-2 ring-brand-purple/20'
                      : 'border-gray-200 hover:border-brand-purple/50 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-brand-purple flex items-center justify-center font-bold">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-brand-dark text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.sides}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm font-bold text-gray-500 hover:text-brand-dark transition-colors cursor-pointer"
              >
                Back to Overview
              </button>
            </div>
          </div>
        );

      // ----------------------------------------------------
      // STEP 3: Live Camera - Snap Front of Document
      // ----------------------------------------------------
      case 3:
        return (
          <LiveCamera
            label={`Snap Front of ${formatDocTypeName(docType)}`}
            sublabel="Position the front of your document in the frame and tap Snap Photo. Use the Flip button if needed."
            guideType="card"
            initialFacingMode="environment"
            photo={docFile}
            onPhotoCaptured={(url) => setDocFile(url)}
            onRetake={() => setDocFile(null)}
            onConfirm={() => setStep(needsBack ? 4 : 5)}
            onBack={() => setStep(2)}
            confirmLabel={needsBack ? 'Next: Snap Back' : 'Next: Biometric Selfie'}
          />
        );

      // ----------------------------------------------------
      // STEP 4: Live Camera - Snap Back of Document (if 2-sided)
      // ----------------------------------------------------
      case 4:
        return (
          <LiveCamera
            label={`Snap Back of ${formatDocTypeName(docType)}`}
            sublabel="Turn over your document, align the back in the frame, and tap Snap Photo."
            guideType="card"
            initialFacingMode="environment"
            photo={docBackFile}
            onPhotoCaptured={(url) => setDocBackFile(url)}
            onRetake={() => setDocBackFile(null)}
            onConfirm={() => setStep(5)}
            onBack={() => setStep(3)}
            confirmLabel="Next: Biometric Selfie"
          />
        );

      // ----------------------------------------------------
      // STEP 5: Live Camera - Biometric Selfie
      // ----------------------------------------------------
      case 5:
        return (
          <LiveCamera
            label="Live Biometric Selfie"
            sublabel="Look directly at the front camera inside good lighting. You can flip to the rear camera if needed."
            guideType="face"
            initialFacingMode="user"
            photo={selfieFile}
            onPhotoCaptured={(url) => setSelfieFile(url)}
            onRetake={() => setSelfieFile(null)}
            onConfirm={() => setStep(6)}
            onBack={() => setStep(needsBack ? 4 : 3)}
            confirmLabel="Next: Address & Finish"
          />
        );

      // ----------------------------------------------------
      // STEP 6: Address & Confirmation
      // ----------------------------------------------------
      case 6:
        return (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-brand-dark mb-1">Residential Address & Settings</h3>
              <p className="text-xs text-gray-500">Provide your verified address and review your live snapped photos.</p>
            </div>

            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
                <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Submission Error</p>
                  <p>{submitError}</p>
                </div>
              </div>
            )}

            {/* Live Snapped Photos Summary */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Live Verification Photos Captured
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {/* Front Thumbnail */}
                <div className="border border-gray-200 rounded-xl p-1.5 bg-gray-50 text-center">
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-black flex items-center justify-center mb-1">
                    {docFile && <img src={docFile} alt="Front" className="w-full h-full object-cover" />}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-center gap-0.5">
                    <CheckCircle2 size={10} /> Front
                  </span>
                </div>

                {/* Back Thumbnail (if 2-sided) */}
                {needsBack && (
                  <div className="border border-gray-200 rounded-xl p-1.5 bg-gray-50 text-center">
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-black flex items-center justify-center mb-1">
                      {docBackFile && <img src={docBackFile} alt="Back" className="w-full h-full object-cover" />}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-center gap-0.5">
                      <CheckCircle2 size={10} /> Back
                    </span>
                  </div>
                )}

                {/* Selfie Thumbnail */}
                <div className="border border-gray-200 rounded-xl p-1.5 bg-gray-50 text-center">
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-black flex items-center justify-center mb-1">
                    {selfieFile && <img src={selfieFile} alt="Selfie" className="w-full h-full object-cover" />}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-center gap-0.5">
                    <CheckCircle2 size={10} /> Selfie
                  </span>
                </div>
              </div>
            </div>

            {/* Address Input */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Residential Address *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address, City, Postcode, Country"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple text-xs"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="AUD">AUD ($)</option>
                    <option value="NGN">NGN (₦)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple text-xs"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setStep(5)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!address.trim() || isSubmitting}
                onClick={handleSubmit}
                className="flex-1 px-4 py-3 bg-brand-purple text-white font-bold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm shadow-md shadow-brand-purple/20 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Transmitting Credentials...</span>
                  </>
                ) : (
                  'Submit Verification'
                )}
              </button>
            </div>
          </div>
        );

      // ----------------------------------------------------
      // STEP 7: Completed Screen
      // ----------------------------------------------------
      case 7:
        return (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 text-emerald-600 shadow-inner">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-xl font-bold text-brand-dark">Live Photos Submitted Successfully</h3>
            <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
              Your live photographic credentials and biometric selfie have been transmitted securely to the Tracefield compliance queue. Our forensic review desk will verify your account shortly.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={() => {
                  onSuccess();
                  handleModalClose(false);
                }}
                className="w-full px-4 py-3 bg-brand-purple text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-md shadow-brand-purple/20 text-sm cursor-pointer"
              >
                Continue to Platform
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => handleModalClose(true)} title="Institutional Identity Verification" maxWidth="max-w-md">
      {renderStep()}
    </Modal>
  );
}
