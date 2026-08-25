const fs = require('fs');

let dbCode = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

if (!dbCode.includes('useRef')) {
  dbCode = dbCode.replace("import React, { useState, useEffect }", "import React, { useState, useEffect, useRef }");
}

if (!dbCode.includes('mainRef = useRef')) {
  dbCode = dbCode.replace("const [user, setUser] = useState<any>(null);", "const [user, setUser] = useState<any>(null);\n  const mainRef = useRef<HTMLElement>(null);");
}

if (!dbCode.includes('mainRef.current?.scrollTo(0, 0)')) {
  dbCode = dbCode.replace("  const isActive = (path: string, exact = false) => {", "  useEffect(() => {\n    mainRef.current?.scrollTo(0, 0);\n  }, [location.pathname]);\n\n  const isActive = (path: string, exact = false) => {");
}

dbCode = dbCode.replace('<main className="flex-1 overflow-y-auto">', '<main ref={mainRef} className="flex-1 overflow-y-auto scroll-smooth">');

fs.writeFileSync('src/layouts/DashboardLayout.tsx', dbCode);


let obCode = fs.readFileSync('src/layouts/OnboardingLayout.tsx', 'utf8');

if (!obCode.includes('useRef')) {
  obCode = obCode.replace("import React, { useEffect, useState }", "import React, { useEffect, useState, useRef }");
}

if (!obCode.includes('mainRef = useRef')) {
  obCode = obCode.replace("const [user, setUser] = useState<any>(null);", "const [user, setUser] = useState<any>(null);\n  const mainRef = useRef<HTMLElement>(null);");
}

if (!obCode.includes('mainRef.current?.scrollTo(0, 0)')) {
  obCode = obCode.replace("  if (loading) {", "  useEffect(() => {\n    mainRef.current?.scrollTo(0, 0);\n  }, [location.pathname]);\n\n  if (loading) {");
}

obCode = obCode.replace('<main className="flex-1 overflow-y-auto bg-gray-50 flex flex-col relative">', '<main ref={mainRef} className="flex-1 overflow-y-auto bg-gray-50 flex flex-col relative scroll-smooth">');

fs.writeFileSync('src/layouts/OnboardingLayout.tsx', obCode);

