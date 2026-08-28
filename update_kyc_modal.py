import os
import re

path = 'src/components/KYCModal.tsx'
with open(path, 'r') as f:
    content = f.read()

# Add states for address, currency, language
states = """  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [address, setAddress] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');"""
content = re.sub(r'const \[isSubmitting, setIsSubmitting\] = useState\(false\);', states, content)

# Update submit handler to include these in profiles update
submit_handler = """      await supabase.from('kyc_documents').insert({
        user_id: user.id,
        document_type: docType,
        document_url: docFile,
        document_back_url: docBackFile,
        selfie_url: selfieFile,
        status: 'pending'
      });
      
      await supabase.from('profiles').update({ 
        kyc_status: 'pending',
        address: address,
        preferred_currency: currency,
        preferred_language: language
      }).eq('id', user.id);
      
      setStep(7); // Success step"""
content = re.sub(r"await supabase\.from\('kyc_documents'\)\.insert\(\{[\s\S]*?setStep\(6\); // Success step", submit_handler, content)

# Update step 5 Next button
step5_button = """              <button 
                disabled={!selfieFile}
                onClick={() => setStep(6)} 
                className="flex-1 px-4 py-3 bg-brand-purple text-white font-bold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                Next
              </button>"""
content = re.sub(r'<button\s*disabled=\{!selfieFile \|\| isSubmitting\}[\s\S]*?\{isSubmitting \? \'Submitting\.\.\.\' : \'Submit Verification\'\}[\s\S]*?</button>', step5_button, content)

# Add Step 6 (Address & Preferences)
step6 = """      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-brand-dark mb-1">Address & Preferences</h3>
              <p className="text-sm text-gray-500">Provide your residential address and app preferences.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Residential Address</label>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St, City, Country" 
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Currency</label>
                  <select 
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple"
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
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple"
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
                disabled={!address || isSubmitting}
                onClick={handleSubmit} 
                className="flex-1 px-4 py-3 bg-brand-purple text-white font-bold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Verification'}
              </button>
            </div>
          </div>
        );

      case 7:"""
content = content.replace("case 6:", step6)

with open(path, 'w') as f:
    f.write(content)
