const fs = require('fs');
let content = fs.readFileSync('src/components/KYCModal.tsx', 'utf8');

// Remove Webcam import
content = content.replace(/import Webcam from 'react-webcam';\n/, '');

// Remove facingMode and webcamRef from state
content = content.replace(/  const \[facingMode, setFacingMode\] = useState<"user" | "environment">.*\n/, '');
content = content.replace(/  const webcamRef = useRef<Webcam>\(null\);\n/, '');

// Remove captureSelfie function
content = content.replace(/  const captureSelfie = React\.useCallback\(\(\) => \{[\s\S]*?\}, \[webcamRef\]\);\n/, '');

// Replace the Webcam rendering in step 5
const webcamBlock = /<Webcam[\s\S]*?<\/div>\s*<\/div>/;
const newCameraBlock = `<div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center relative hover:border-brand-purple hover:bg-brand-purple/5 transition-colors cursor-pointer group">
                  <Camera className="mx-auto text-gray-400 group-hover:text-brand-purple mb-3 transition-colors" size={40} />
                  <p className="text-sm font-bold text-brand-dark mb-1">Take Selfie</p>
                  <p className="text-xs text-gray-500">Tap to open your camera</p>
                  <input type="file" accept="image/*" capture="user" onChange={(e) => handleFileUpload(e, setSelfieFile)} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>`;
                
content = content.replace(webcamBlock, newCameraBlock);

fs.writeFileSync('src/components/KYCModal.tsx', content);
console.log("Patched KYCModal to remove react-webcam completely.");
