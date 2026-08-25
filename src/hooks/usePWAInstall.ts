import { useState, useEffect } from 'react';

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Custom event to trigger from anywhere
    const handleCustomRequest = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult: any) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          setDeferredPrompt(null);
          setIsInstallable(false);
        });
      } else {
        alert("To install the app, please use your browser's 'Add to Home Screen' or 'Install' feature.");
      }
    };

    window.addEventListener('pwa-install-request', handleCustomRequest);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('pwa-install-request', handleCustomRequest);
    };
  }, [deferredPrompt]);

  const installPWA = () => {
    window.dispatchEvent(new CustomEvent('pwa-install-request'));
  };

  return { isInstallable, installPWA };
}
