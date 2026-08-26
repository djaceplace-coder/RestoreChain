import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ShieldAlert, FileText, Check, Download, Upload, Loader2 } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function Agreement() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [kycStatus, setKycStatus] = useState('unverified');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const sigCanvas = useRef<any>(null);
  const docRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        const { data: p } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
        if (p) {
          setProfile(p);
          if (p.kyc_status) setKycStatus(p.kyc_status);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  const handleDownloadPDF = async () => {
    if (!docRef.current) return;
    const canvas = await html2canvas(docRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('Tracefield_Agreement.pdf');
  };

  const handleSubmit = async () => {
    setErrorMsg('');
    if (sigCanvas.current?.isEmpty()) {
      setErrorMsg("Please provide your signature before submitting.");
      return;
    }
    
    setSubmitting(true);
    try {
      const signatureData = sigCanvas.current.getCanvas().toDataURL('image/png');
      
      // Create document record
      const { error: docError } = await supabase.from('user_documents').insert({
        user_id: user.id,
        document_type: 'terms_agreement',
        signature_data: signatureData,
        status: 'pending'
      });

      if (docError) {
        console.error("Doc Error:", docError);
        setErrorMsg("Database Error (user_documents): " + docError.message + ". Did you run the SQL script in Supabase?");
        setSubmitting(false);
        return;
      }

      // Update profile KYC status
      const { error: profileError } = await supabase.from('profiles').update({ kyc_status: 'pending' }).eq('id', user.id);
      
      if (profileError) {
        console.error("Profile Error:", profileError);
        setErrorMsg("Database Error (profiles): " + profileError.message + ". Did you run the SQL script in Supabase?");
        setSubmitting(false);
        return;
      }

      setKycStatus('pending');
    } catch (err: any) {
      console.error("Exception:", err);
      setErrorMsg("Unexpected Error: " + err.message);
    }
    setSubmitting(false);
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-brand-purple" size={32} /></div>;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-dark mb-2">Service Agreement</h1>
        <p className="text-gray-500">Please review, sign, and submit the Terms and Conditions to activate your account.</p>
      </header>

      {kycStatus === 'pending' ? (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-500">
            <Loader2 className="animate-spin" size={32} />
          </div>
          <h2 className="text-xl font-bold text-brand-dark mb-2">Agreement Under Review</h2>
          <p className="text-gray-600">Your signed agreement has been submitted and is currently pending administrator approval.</p>
        </div>
      ) : kycStatus === 'approved' ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
            <Check size={32} />
          </div>
          <h2 className="text-xl font-bold text-brand-dark mb-2">Agreement Approved</h2>
          <p className="text-gray-600">Your account is fully active.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {/* Document Preview */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-brand-dark flex items-center gap-2">
                <FileText size={18} /> Official Agreement Document
              </h3>
              <button onClick={handleDownloadPDF} className="flex items-center gap-2 text-sm font-bold text-brand-purple hover:opacity-80 transition-opacity">
                <Download size={16} /> Download PDF
              </button>
            </div>
            
            <div className="p-4 md:p-12 overflow-x-auto bg-gray-50">
              {/* Document Container */}
              <div ref={docRef} className="bg-white mx-auto shadow-md p-6 md:p-10 max-w-[800px] text-sm text-gray-800 font-serif leading-relaxed" style={{ minHeight: '1000px' }}>
                <div className="text-center mb-10 border-b-2 border-gray-900 pb-6">
                  <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-widest text-black mb-2">Tracefield</h1>
                  <p className="text-gray-500">MASTER SERVICES AGREEMENT & TERMS OF USE</p>
                </div>
                
                <p className="mb-4 text-right">Date: {new Date().toLocaleDateString()}</p>
                <p className="mb-8 font-bold">Client Account: {profile?.email}</p>

                <div className="space-y-6 text-justify">
                  <p>This Master Services Agreement (this "Agreement") is entered into by and between Tracefield Inc. ("Company") and the Client listed above, governing the usage of the Tracefield platform, cryptographic asset recovery services, and secure portfolio management.</p>
                  
                  <h4 className="font-bold text-lg mt-6 mb-2">1. Scope of Services & Opportunities</h4>
                  <p>Tracefield provides advanced cryptographic tracking, asset recovery, and institutional-grade portfolio management. Clients have the opportunity to access decentralized finance (DeFi) tools, high-yield staking options, and tax-loss harvesting utilities under our secure custodial infrastructure.</p>
                  
                  <h4 className="font-bold text-lg mt-6 mb-2">2. Client Acknowledgements</h4>
                  <p>The Client agrees that all deposits, withdrawals, and trades are subject to rigorous AML/KYC checks. The Client understands the inherent risks associated with digital assets and holds Tracefield harmless from losses due to extreme market volatility.</p>

                  <h4 className="font-bold text-lg mt-6 mb-2">3. Custodial Agreement</h4>
                  <p>By signing this document, you authorize Tracefield to act as a secure custodian for the assets deposited within the platform. Withdrawals require administrative clearance to prevent unauthorized extraction.</p>
                </div>

                <div className="mt-12 md:mt-20 flex flex-col md:flex-row justify-between items-start md:items-end border-t gap-6 border-gray-200 pt-10">
                  <div className="w-full md:w-1/2 md:pr-8 mb-6 md:mb-0">
                    <p className="mb-2 font-bold text-gray-500 text-xs uppercase">Authorized Signature (Company)</p>
                    <div className="mb-2 italic text-2xl text-blue-900" style={{ fontFamily: "'Brush Script MT', cursive" }}>Mark Glenn</div>
                    <div className="h-px w-full bg-black mb-2"></div>
                    <p className="font-bold">Mark Glenn</p>
                    <p className="text-xs text-gray-500">Head of Services, Tracefield</p>
                  </div>
                  <div className="w-full md:w-1/2 md:pl-8">
                    <p className="mb-2 font-bold text-gray-500 text-xs uppercase">Client Signature</p>
                    <div className="h-24 w-full bg-gray-50 mb-2 border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                      {/* Will be replaced by E-signature later if downloaded, or visually signed */}
                      [ Client E-Signature Applied Here ]
                    </div>
                    <div className="h-px w-full bg-black mb-2"></div>
                    <p className="font-bold">{profile?.first_name || ''} {profile?.last_name || 'Client'}</p>
                    <p className="text-xs text-gray-500">{profile?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* E-Sign Panel */}
          <div className="bg-white rounded-2xl border border-brand-purple/30 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-brand-purple/5">
              <h3 className="font-bold text-brand-dark text-lg">Electronic Signature Verification</h3>
              <p className="text-sm text-gray-500 mt-1">Please sign within the box below to authorize the agreement.</p>
            </div>
            <div className="p-6">
              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-bold rounded-lg">
                  {errorMsg}
                </div>
              )}
              <div className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 mb-4 relative" style={{ height: '200px' }}>
                <SignatureCanvas 
                  ref={sigCanvas} 
                  canvasProps={{className: 'w-full h-full cursor-crosshair rounded-xl'}}
                  penColor="blue"
                />
              </div>
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <button onClick={clearSignature} className="text-sm font-bold text-gray-500 hover:text-red-500 transition-colors">
                  Clear Signature
                </button>
                <button 
                  onClick={handleSubmit} 
                  disabled={submitting}
                  className="flex items-center gap-2 w-full md:w-auto px-8 py-3 bg-brand-purple justify-center text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-md disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                  Sign & Submit Agreement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
