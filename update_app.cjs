const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  `import Signup from './pages/Signup';`,
  `import Signup from './pages/Signup';\nimport ForgotPassword from './pages/ForgotPassword';\nimport ResetPassword from './pages/ResetPassword';`
);

content = content.replace(
  `const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';`,
  `const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password' || location.pathname === '/reset-password';`
);

content = content.replace(
  `<Route path="/signup" element={<Signup />} />`,
  `<Route path="/signup" element={<Signup />} />\n          <Route path="/forgot-password" element={<ForgotPassword />} />\n          <Route path="/reset-password" element={<ResetPassword />} />`
);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx updated');
