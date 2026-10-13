import React, { useState } from 'react';
import { Camera, Upload, Shield, CheckCircle2, ChevronRight, FileText, RefreshCcw, Loader2, AlertCircle } from 'lucide-react';
import Modal from './ui/Modal';
import { supabase } from '../lib/supabase';

interface KYCModalProps {
  isOpen: boolean;
  onClose: (skipped: boolean) => void;
  user: any;
  onSuccess: () => void;
}

// Client-side image compression to ensure camera photos (< 120KB) fit easily into PostgreSQL text columns
// without triggering 413 Payload Too Large or API gateway timeouts.
const compressImage = (file: File, maxDim = 1200, quality = 0.82): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const resultStr = event.target?.result as string;
      if (!resultStr) {
        resolve('');
        return;
      }
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(resultStr);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => {
        resolve(resultStr);
      };
      img.src = resultStr;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

export default function KYCModal({ isOpen, onClose, user, onSuccess }: KYCModalProps) {
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState('passport');
  const [docFile, setDocFile] = useState<string | null>(null);
  const [docBackFile, setDocBackFile] = useState<string | null>(null);
  const [selfieFile, setSelfieFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const [address, setAddress] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');

  const needsBack = docType === "driver's license" || docType === "national id";

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      try {
        const compressed = await compressImage(file, 1200, 0.82);
        setter(compressed);
      } catch (err) {
        console.warn('Compression fallback to raw reader:', err);
        const reader = new FileReader();
        reader.onloadend = () => {
          setter(reader.result as string);
        };
        reader.readAsDataURL(file);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // 1. Insert photographic credentials record into kyc_documents
      const { data: insertedKyc, error: kycError } = await supabase.from('kyc_documents').insert({
        user_id: user.id,
        document_type: docType || 'passport',
        document_url: docFile,
        document_back_url: docBackFile,
        selfie_url: selfieFile,
        status: 'pending'
      }).select().single();
      
      if (kycError) {
        console.error('kyc_documents insert error:', kycError);
        // If the table or RLS prevents insertion, log but don't silently swallow
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
          message: 'Your photographic identity credentials have been submitted securely and are under review by our compliance team.'
        });
      } catch (e) {
        // notification insert non-fatal
      }
      
      setStep(7); // Verification Pending confirmation step
    } catch (err: any) {
      console.error('Error in KYC submission:', err);
      setSubmitError(err.message || 'Failed to submit KYC verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-brand-purple/5 p-6 rounded-2xl border border-brand-purple/10">
              <Shield className="w-12 h-12 text-brand-purple mb-4" />
              <h3 className="text-xl font-bold text-brand-dark mb-2">Identity Verification Required</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                To comply with international financial regulations and secure your digital assets, we require identity verification. This process takes less than 2 minutes.
              </p>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm font-bold text-gray-700">What you'll need:</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> A valid government-issued photographic ID</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> A device with a camera (for biometric verification)</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Proof of residential address</li>
              </ul>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button onClick={() => onClose(true)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                Skip for Now
              </button>
              <button onClick={() => setStep(2)} className="flex-1 px-4 py-3 bg-brand-purple text-white font-bold rounded-xl hover:bg-purple-700 transition-colors">
                Start Verification
              </button>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-brand-dark mb-1">Select ID Type</h3>
              <p className="text-sm text-gray-500">Choose the type of government document you wish to upload.</p>
            </div>
            
            <div className="space-y-3">
              {['Passport', "Driver's License", 'SSN Card', 'National ID'].map(type => (
                <button 
                  key={type}
                  onClick={() => { setDocType(type.toLowerCase()); setStep(3); }}
                  className={`w-full flex items-center justify-between p-4 border rounded-xl transition-all text-left group ${
                    docType === type.toLowerCase()
                      ? 'border-brand-purple bg-brand-purple/5'
                      : 'border-gray-200 hover:border-brand-purple hover:bg-brand-purple/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="text-gray-400 group-hover:text-brand-purple" />
                    <span className="font-bold text-brand-dark">{type}</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-400 group-hover:text-brand-purple" />
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="text-sm font-bold text-gray-500 hover:text-brand-dark">Back</button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-brand-dark mb-1">Upload Front of Document</h3>
              <p className="text-sm text-gray-500 capitalize">Upload a clear photo of the front of your {docType}.</p>
            </div>
            
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center relative hover:border-brand-purple hover:bg-brand-purple/5 transition-colors">
              {isCompressing ? (
                <div className="flex flex-col items-center justify-center py-6 text-brand-purple">
                  <Loader2 size={32} className="animate-spin mb-2" />
                  <p className="text-xs font-bold">Optimizing image resolution...</p>
                </div>
              ) : docFile ? (
                <div className="space-y-2">
                  <img src={docFile} alt="Document Front" className="max-h-44 mx-auto rounded-lg object-contain shadow-sm border border-gray-100" />
                  <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-sm">
                    <CheckCircle2 size={18} /> Front Document Attached
                  </div>
                  <p className="text-xs text-gray-400">Click anywhere to replace photo</p>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-sm font-bold text-brand-dark">Upload Front Photo</p>
                  <p className="text-xs text-gray-500 mt-1">Tap to select photo or capture with camera</p>
                </>
              )}
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setDocFile)} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={() => setStep(2)} className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button 
                disabled={!docFile || isCompressing}
                onClick={() => setStep(needsBack ? 4 : 5)} 
                className="flex-1 px-4 py-3 bg-brand-purple text-white font-bold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-brand-dark mb-1">Upload Back of Document</h3>
              <p className="text-sm text-gray-500 capitalize">Upload a clear photo of the back of your {docType}.</p>
            </div>
            
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center relative hover:border-brand-purple hover:bg-brand-purple/5 transition-colors">
              {isCompressing ? (
                <div className="flex flex-col items-center justify-center py-6 text-brand-purple">
                  <Loader2 size={32} className="animate-spin mb-2" />
                  <p className="text-xs font-bold">Optimizing image resolution...</p>
                </div>
              ) : docBackFile ? (
                <div className="space-y-2">
                  <img src={docBackFile} alt="Document Back" className="max-h-44 mx-auto rounded-lg object-contain shadow-sm border border-gray-100" />
                  <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-sm">
                    <CheckCircle2 size={18} /> Back Document Attached
                  </div>
                  <p className="text-xs text-gray-400">Click anywhere to replace photo</p>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-sm font-bold text-brand-dark">Upload Back Photo</p>
                  <p className="text-xs text-gray-500 mt-1">Tap to select photo or capture with camera</p>
                </>
              )}
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setDocBackFile)} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={() => setStep(3)} className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button 
                disabled={!docBackFile || isCompressing}
                onClick={() => setStep(5)} 
                className="flex-1 px-4 py-3 bg-brand-purple text-white font-bold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-brand-dark mb-1">Take a Biometric Selfie</h3>
              <p className="text-sm text-gray-500">Ensure your face is clearly visible, well-lit, and unshaded.</p>
            </div>
            
            <div className="border border-gray-200 rounded-2xl overflow-hidden bg-black text-center relative">
              {selfieFile ? (
                <div className="relative">
                  <img src={selfieFile} alt="Selfie" className="w-full h-auto max-h-64 object-contain" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white px-4 py-2 rounded-xl text-green-600 font-bold flex items-center gap-2 shadow-lg">
                      <CheckCircle2 size={20} /> Biometric Photo Ready
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelfieFile(null)}
                    className="absolute top-4 right-4 bg-white/20 p-2 rounded-full text-white hover:bg-white/40 transition-colors"
                    title="Retake photo"
                  >
                    <RefreshCcw size={20} />
                  </button>
                </div>
              ) : isCompressing ? (
                <div className="py-16 flex flex-col items-center justify-center text-white">
                  <Loader2 size={36} className="animate-spin mb-2" />
                  <p className="text-xs">Processing photo...</p>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-700 rounded-2xl p-8 text-center relative hover:border-brand-purple transition-colors cursor-pointer group">
                  <Camera className="mx-auto text-gray-400 group-hover:text-brand-purple mb-3 transition-colors" size={40} />
                  <p className="text-sm font-bold text-white mb-1">Capture Selfie</p>
                  <p className="text-xs text-gray-400">Tap to open front camera or select photo</p>
                  <input type="file" accept="image/*" capture="user" onChange={(e) => handleFileUpload(e, setSelfieFile)} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={() => setStep(needsBack ? 4 : 3)} className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button 
                disabled={!selfieFile || isCompressing}
                onClick={() => setStep(6)} 
                className="flex-1 px-4 py-3 bg-brand-purple text-white font-bold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                Next
              </button>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-brand-dark mb-1">Address & Currency</h3>
              <p className="text-sm text-gray-500">Provide your verified residential address and account settings.</p>
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
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Residential Address</label>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Street Name, City, Postcode, Country" 
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Preferred Currency</label>
                  <select 
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple text-sm"
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
                  <label className="block text-sm font-bold text-gray-700 mb-1">Language</label>
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple text-sm"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={() => setStep(5)} className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button 
                disabled={!address.trim() || isSubmitting}
                onClick={handleSubmit} 
                className="flex-1 px-4 py-3 bg-brand-purple text-white font-bold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  'Submit Verification'
                )}
              </button>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-brand-dark">Verification Documents Submitted</h3>
            <p className="text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
              Your photographic identity documents have been submitted securely and are currently under review by our compliance desk. You may now explore your portfolio and platform tools.
            </p>
            <div className="pt-6">
              <button onClick={() => { onSuccess(); onClose(false); }} className="w-full px-4 py-3 bg-brand-purple text-white font-bold rounded-xl hover:bg-purple-700 transition-colors">
                Explore Platform
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(true)} title="Identity Verification" maxWidth="max-w-md">
      {renderStep()}
    </Modal>
  );
}
