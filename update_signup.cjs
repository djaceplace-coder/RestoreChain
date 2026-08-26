const fs = require('fs');

let content = fs.readFileSync('src/pages/Signup.tsx', 'utf8');

// We need to add Eye and EyeOff from lucide-react if not there.
if (!content.includes('EyeOff')) {
  content = content.replace(/import {([^}]+)} from 'lucide-react';/, (match, group) => {
    return `import { \${group}, Eye, EyeOff } from 'lucide-react';`;
  });
}

// Add state for confirm password and visibility
const stateRegex = /const \[password, setPassword\] = useState\(''\);/;
const newState = `const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);`;
content = content.replace(stateRegex, newState);

// Update handleSubmit to check confirm password
const handleRegex = /const handleSubmit = async \(e: React.FormEvent\) => \{\n    e\.preventDefault\(\);\n    setError\(''\);\n    setLoading\(true\);/;
const newHandle = `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);`;
content = content.replace(handleRegex, newHandle);

// Replace password field with password and confirm password fields, with toggle buttons
const passwordFieldRegex = /<div>\s*<label className="block text-sm font-bold text-gray-700 mb-2">Password<\/label>\s*<input\s*type="password"\s*value=\{password\}\s*onChange=\{\(e\) => setPassword\(e\.target\.value\)\}\s*required\s*className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"\s*\/>\s*<\/div>/;

const newPasswordFields = `<div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>`;

content = content.replace(passwordFieldRegex, newPasswordFields);

fs.writeFileSync('src/pages/Signup.tsx', content);
console.log('Signup.tsx updated');
