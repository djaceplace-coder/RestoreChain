const fs = require('fs');
let code = fs.readFileSync('src/components/ErrorBoundary.tsx', 'utf8');
code = code.replace("return this.props.children;", "return (this as any).props.children;");
fs.writeFileSync('src/components/ErrorBoundary.tsx', code);
