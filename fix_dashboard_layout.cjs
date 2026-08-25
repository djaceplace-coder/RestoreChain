const fs = require('fs');

let dbCode = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

dbCode = dbCode.replace("const isActive = (path: string, exact = false) => {", "useEffect(() => {\n    mainRef.current?.scrollTo(0, 0);\n  }, [location.pathname]);\n\n  const isActive = (path: string, exact = false) => {");

fs.writeFileSync('src/layouts/DashboardLayout.tsx', dbCode);
