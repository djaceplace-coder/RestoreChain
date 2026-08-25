const fs = require('fs');

let obCode = fs.readFileSync('src/layouts/OnboardingLayout.tsx', 'utf8');

obCode = obCode.replace("import React from 'react';", "import React, { useEffect, useRef } from 'react';");
obCode = obCode.replace("const location = useLocation();", "const location = useLocation();\n  const mainRef = useRef<HTMLElement>(null);\n\n  useEffect(() => {\n    mainRef.current?.scrollTo(0, 0);\n  }, [location.pathname]);\n");
obCode = obCode.replace('<main className="flex-1 flex flex-col items-center justify-center p-6 py-12">', '<main ref={mainRef} className="flex-1 flex flex-col items-center justify-center p-6 py-12 scroll-smooth overflow-y-auto">');

fs.writeFileSync('src/layouts/OnboardingLayout.tsx', obCode);
