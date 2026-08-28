import React from 'react';
import { ShieldAlert } from 'lucide-react';
import Modal from './ui/Modal';

interface KYCRestrictedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenKYC: () => void;
}

export default function KYCRestrictedModal({ isOpen, onClose, onOpenKYC }: KYCRestrictedModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Action Restricted" maxWidth="max-w-md">
      <div className="text-center py-4 space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert size={32} className="text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-brand-dark">KYC Verification Required</h3>
        <p className="text-sm text-gray-600">
          You must complete the Identity Verification (KYC) process and receive admin approval before you can connect wallets, transfer funds, or perform external transactions.
        </p>
        
        <div className="pt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button onClick={() => { onClose(); onOpenKYC(); }} className="flex-1 px-4 py-3 bg-brand-purple text-white font-bold rounded-xl hover:bg-purple-700 transition-colors">
            Start KYC Now
          </button>
        </div>
      </div>
    </Modal>
  );
}
