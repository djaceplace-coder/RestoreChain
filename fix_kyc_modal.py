import os
import re

path = 'src/components/KYCModal.tsx'
with open(path, 'r') as f:
    content = f.read()

new_content = """import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Shield, CheckCircle2, ChevronRight, FileText, User } from 'lucide-react';
import Modal from './ui/Modal';
import { supabase } from '../lib/supabase';

interface KYCModalProps {
  isOpen: boolean;
  onClose: (skipped: boolean) => void;
  user: any;
  onSuccess: () => void;
}

export default function KYCModal({ isOpen, onClose, user, onSuccess }: KYCModalProps) {
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState('');
  const [docFile, setDocFile] = useState<string | null>(null);
  const [docBackFile, setDocBackFile] = useState<string | null>(null);
  const [selfieFile, setSelfieFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const needsBack = docType === "driver's license" || docType === "national id";

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    
    try {
      await supabase.from('kyc_documents').insert({
        user_id: user.id,
        document_type: docType,
        document_url: docFile,
        document_back_url: docBackFile,
        selfie_url: selfieFile,
        status: 'pending'
      });
      
      await supabase.from('profiles').update({ kyc_status: 'pending' }).eq('id', user.id);
      
      setStep(6); // Success step
    } catch (err) {
      console.error(err);
      alert("Failed to submit KYC. Please try again.");
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
                To comply with financial regulations and secure your account, we need to verify your identity. This process takes less than 2 minutes.
              </p>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm font-bold text-gray-700">What you'll need:</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> A valid government-issued ID</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> A device with a camera (for a selfie)</li>
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
              <p className="text-sm text-gray-500">Choose the type of document you wish to upload.</p>
            </div>
            
            <div className="space-y-3">
              {['Passport', "Driver's License", 'SSN Card', 'National ID'].map(type => (
                <button 
                  key={type}
                  onClick={() => { setDocType(type.toLowerCase()); setStep(3); }}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-brand-purple hover:bg-brand-purple/5 transition-all text-left group"
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
              {docFile ? (
                <div className="flex items-center justify-center gap-2 text-green-600 font-bold">
                  <CheckCircle2 size={24} /> Document Front Attached
                </div>
              ) : (
                <>
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-sm font-bold text-brand-dark">Upload Front</p>
                  <p className="text-xs text-gray-500 mt-1">Tap to select file or take a photo</p>
                </>
              )}
              <input type="file" accept="image/*" capture="environment" onChange={(e) => handleFileUpload(e, setDocFile)} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={() => setStep(2)} className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button 
                disabled={!docFile}
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
              {docBackFile ? (
                <div className="flex items-center justify-center gap-2 text-green-600 font-bold">
                  <CheckCircle2 size={24} /> Document Back Attached
                </div>
              ) : (
                <>
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-sm font-bold text-brand-dark">Upload Back</p>
                  <p className="text-xs text-gray-500 mt-1">Tap to select file or take a photo</p>
                </>
              )}
              <input type="file" accept="image/*" capture="environment" onChange={(e) => handleFileUpload(e, setDocBackFile)} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={() => setStep(3)} className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button 
                disabled={!docBackFile}
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
              <h3 className="text-lg font-bold text-brand-dark mb-1">Take a Selfie</h3>
              <p className="text-sm text-gray-500">Ensure your face is clearly visible.</p>
            </div>
            
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center relative hover:border-brand-purple hover:bg-brand-purple/5 transition-colors">
              {selfieFile ? (
                <div className="flex items-center justify-center gap-2 text-green-600 font-bold">
                  <CheckCircle2 size={24} /> Selfie Attached
                </div>
              ) : (
                <>
                  <Camera className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-sm font-bold text-brand-dark">Take a Selfie</p>
                  <p className="text-xs text-gray-500 mt-1">Tap to use camera</p>
                </>
              )}
              <input type="file" accept="image/*" capture="user" onChange={(e) => handleFileUpload(e, setSelfieFile)} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={() => setStep(needsBack ? 4 : 3)} className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button 
                disabled={!selfieFile || isSubmitting}
                onClick={handleSubmit} 
                className="flex-1 px-4 py-3 bg-brand-purple text-white font-bold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Verification'}
              </button>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-brand-dark">Verification Pending</h3>
            <p className="text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
              Your identity documents have been submitted securely and are under review. You can check out Swaps and explore other available platform features while your account is being approved.
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
"""

with open(path, 'w') as f:
    f.write(new_content)
