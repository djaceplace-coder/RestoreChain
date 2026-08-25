const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

if (!appCode.includes('ErrorBoundary')) {
  appCode = appCode.replace("import ScrollToTop from './components/ScrollToTop';", "import ScrollToTop from './components/ScrollToTop';\nimport ErrorBoundary from './components/ErrorBoundary';");
  appCode = appCode.replace("<Router>\n      <AppContent />\n    </Router>", "<Router>\n      <ErrorBoundary>\n        <AppContent />\n      </ErrorBoundary>\n    </Router>");
  fs.writeFileSync('src/App.tsx', appCode);
}
