const fs = require('fs');
let content = fs.readFileSync('src/pages/Landing.tsx', 'utf8');

const oldInstall = /const handleInstallClick = async \(\) => \{[\s\S]*?alert\("App is already installed or your browser doesn't support installation."\);\s*\}\s*\};/;
const newInstall = `const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIOS) {
        alert("To install the app on iOS: Tap the Share button at the bottom of your browser and select 'Add to Home Screen'.");
      } else {
        alert("App is already installed or your browser doesn't support automatic installation.");
      }
    }
  };`;

content = content.replace(oldInstall, newInstall);

// Let's make sure deferredPrompt is shown on iOS, otherwise they never see the banner.
// On iOS, beforeinstallprompt never fires. 
// We can explicitly show the banner if it's iOS and not running standalone.
const hookRegex = /useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);/;
const newHook = `const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    
    setIsIOS(isIOSDevice);
    setIsStandalone(isStandaloneMode);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);`;

content = content.replace(hookRegex, newHook);

// Also modify the render condition for the install banner
const bannerRegex = /\{deferredPrompt && \(/;
content = content.replace(bannerRegex, '{(deferredPrompt || (isIOS && !isStandalone)) && (');

fs.writeFileSync('src/pages/Landing.tsx', content);
