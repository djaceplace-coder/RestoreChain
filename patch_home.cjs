const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');
content = content.replace(
  'Start a Free Case Review\n          </Link>\n        </div>\n      </section>',
  'Start a Free Case Review\n          </Link>\n          <div className="mt-12 text-brand-purple-light text-sm flex flex-col items-center gap-2">\n            <p><strong>Email:</strong> info@tracefield.co.uk</p>\n            <p><strong>Location:</strong> London, United Kingdom</p>\n          </div>\n        </div>\n      </section>'
);
fs.writeFileSync('src/pages/Home.tsx', content);
