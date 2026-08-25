const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

if (!code.includes('manifest.json')) {
  code = code.replace(
    '</head>',
    `  <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#6366f1" />
    <link rel="apple-touch-icon" href="/icon-192.png" />
  </head>`
  );
  
  // also add simple SW registration
  code = code.replace(
    '</body>',
    `  <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('SW registration failed: ', err);
          });
        });
      }
    </script>
  </body>`
  );
  fs.writeFileSync('index.html', code);
}
