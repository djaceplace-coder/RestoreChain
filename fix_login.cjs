const fs = require('fs');
let content = fs.readFileSync('src/pages/Login.tsx', 'utf8');
content = content.replace("  const [rememberMe, setRememberMe] = useState(false);\n  const [rememberMe, setRememberMe] = useState(true);", "  const [rememberMe, setRememberMe] = useState(false);");
fs.writeFileSync('src/pages/Login.tsx', content);
