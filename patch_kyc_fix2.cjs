const fs = require('fs');
let content = fs.readFileSync('src/components/KYCModal.tsx', 'utf8');

const regex = /\) : \(\s*<div className="relative">\s*<div className="border-2 border-dashed.*?<\/div>\s*\)\}/s;
const newStr = `) : (
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center relative hover:border-brand-purple hover:bg-brand-purple/5 transition-colors cursor-pointer group">
                  <Camera className="mx-auto text-gray-400 group-hover:text-brand-purple mb-3 transition-colors" size={40} />
                  <p className="text-sm font-bold text-brand-dark mb-1">Take Selfie</p>
                  <p className="text-xs text-gray-500">Tap to open your camera</p>
                  <input type="file" accept="image/*" capture="user" onChange={(e) => handleFileUpload(e, setSelfieFile)} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              )}`;

content = content.replace(regex, newStr);
fs.writeFileSync('src/components/KYCModal.tsx', content);
