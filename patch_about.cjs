const fs = require('fs');
let content = fs.readFileSync('src/pages/About.tsx', 'utf8');
content = content.replace(
  '        </ul>\n      </div>\n    </div>',
  '        </ul>\n\n        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm mt-12">\n          <h3 className="text-2xl font-bold mb-4 font-display">Our Headquarters</h3>\n          <p className="text-brand-text-gray leading-relaxed mb-2">\n            Tracefield Ltd. is headquartered in the financial center of Europe.\n          </p>\n          <p className="text-brand-text-gray font-medium mb-1"><strong>Location:</strong> London, United Kingdom</p>\n          <p className="text-brand-text-gray font-medium"><strong>Email:</strong> <a href="mailto:info@tracefield.co.uk" className="text-brand-purple hover:underline">info@tracefield.co.uk</a></p>\n        </div>\n      </div>\n    </div>'
);
fs.writeFileSync('src/pages/About.tsx', content);
