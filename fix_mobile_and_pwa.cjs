const fs = require('fs');

// 1. FIX AGREEMENT.TSX (Signature Bug + Mobile Responsive)
let agreement = fs.readFileSync('src/pages/dashboard/Agreement.tsx', 'utf8');

// Fix the import_trim_canvas bug
agreement = agreement.replace('getTrimmedCanvas()', 'getCanvas()');

// Mobile typography fixes
agreement = agreement.replace(/text-3xl/g, 'text-2xl md:text-3xl');
agreement = agreement.replace('p-8 md:p-12', 'p-4 md:p-12');
agreement = agreement.replace('p-10 max-w-[800px]', 'p-6 md:p-10 max-w-[800px]');
agreement = agreement.replace('w-1/2 pr-8', 'w-full md:w-1/2 md:pr-8 mb-6 md:mb-0');
agreement = agreement.replace('w-1/2 pl-8', 'w-full md:w-1/2 md:pl-8');
agreement = agreement.replace('mt-20 flex justify-between items-end border-t', 'mt-12 md:mt-20 flex flex-col md:flex-row justify-between items-start md:items-end border-t gap-6');
agreement = agreement.replace('flex justify-between items-center">\n                <button onClick={clearSignature}', 'flex flex-col md:flex-row justify-between items-center gap-4">\n                <button onClick={clearSignature}');
agreement = agreement.replace('px-8 py-3 bg-brand-purple', 'w-full md:w-auto px-8 py-3 bg-brand-purple justify-center');
fs.writeFileSync('src/pages/dashboard/Agreement.tsx', agreement);

// 2. FIX PORTFOLIO.TSX (Mobile Layout & PWA Install Button)
let portfolio = fs.readFileSync('src/pages/dashboard/Portfolio.tsx', 'utf8');
portfolio = portfolio.replace('text-4xl md:text-5xl', 'text-3xl md:text-5xl');
portfolio = portfolio.replace('text-xl font-bold font-display', 'text-lg md:text-xl font-bold font-display');

// Add PWA State Hook
if (!portfolio.includes('deferredPrompt')) {
    portfolio = portfolio.replace(
        'const [loading, setLoading] = useState(true);',
        `const [loading, setLoading] = useState(true);\n  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);\n\n  useEffect(() => {\n    const handleBeforeInstallPrompt = (e: any) => {\n      e.preventDefault();\n      setDeferredPrompt(e);\n    };\n    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);\n    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);\n  }, []);\n\n  const handleInstallClick = async () => {\n    if (deferredPrompt) {\n      deferredPrompt.prompt();\n      const { outcome } = await deferredPrompt.userChoice;\n      if (outcome === "accepted") setDeferredPrompt(null);\n    } else {\n      alert("To install on iOS: Tap the Share button at the bottom, then select 'Add to Home Screen'. \\n\\nOn Android: Tap the 3 dots menu and select 'Install app' or 'Add to Home screen'.");\n    }\n  };`
    );

    // Bind to the Install App button
    portfolio = portfolio.replace(
        '<button className="px-4 py-2 bg-white text-brand-purple hover:bg-gray-50 rounded-xl font-bold text-sm transition-colors shadow-sm">\n            Install App\n          </button>',
        '<button onClick={handleInstallClick} className="px-4 py-2 bg-white text-brand-purple hover:bg-gray-50 rounded-xl font-bold text-sm transition-colors shadow-sm">\n            Install App\n          </button>'
    );
    fs.writeFileSync('src/pages/dashboard/Portfolio.tsx', portfolio);
}

// 3. REGISTER PWA SERVICE WORKER IN main.tsx
let main = fs.readFileSync('src/main.tsx', 'utf8');
if (!main.includes('serviceWorker')) {
    main = main.replace(
        'createRoot(',
        `if ('serviceWorker' in navigator) {\n  window.addEventListener('load', () => {\n    navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW registration failed: ', err));\n  });\n}\n\ncreateRoot(`
    );
    fs.writeFileSync('src/main.tsx', main);
}

// 4. FIX HTML VIEWPORT FOR NATIVE APP FEEL
let html = fs.readFileSync('index.html', 'utf8');
if (!html.includes('theme-color')) {
    html = html.replace(
        '</head>',
        '  <meta name="theme-color" content="#ffffff" />\n    <link rel="apple-touch-icon" href="/icon.svg" />\n  </head>'
    );
    fs.writeFileSync('index.html', html);
}
console.log('Mobile optimizations and PWA setup complete.');
