import React, { useState, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'zh-CN', label: '中文 (Simplified)' },
  { code: 'ar', label: 'العربية' },
  { code: 'ru', label: 'Русский' },
  { code: 'ja', label: '日本語' }
];

export default function LanguageSwitcher({ isDark = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    // 1. Check local storage / cookie
    const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
    let lang = 'en';
    if (match && match[1]) {
      lang = match[1];
    }
    
    // 2. If logged in, check supabase profile and sync
    const syncUserLang = async () => {
      if (!supabase) { setCurrentLang(lang); return; }
      if (!supabase) return;
       const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('preferred_language').eq('id', session.user.id).single();
        if (data?.preferred_language && data.preferred_language !== lang) {
           lang = data.preferred_language;
           applyLanguage(lang, false); // apply without db update to avoid loop
        }
      }
      setCurrentLang(lang);
    };
    
    syncUserLang();
  }, []);

  const applyLanguage = async (langCode: string, updateDb = true) => {
    setCurrentLang(langCode);
    setIsOpen(false);
    
        if (langCode === 'en') {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/;`;
    } else {
      document.cookie = `googtrans=/en/${langCode}; path=/; SameSite=None; Secure`;
      document.cookie = `googtrans=/en/${langCode}; domain=${window.location.hostname}; path=/; SameSite=None; Secure`;
    }

    if (updateDb) {

      if (!supabase) return;
       const { data: { session } } = await supabase.auth.getSession();
       if (session?.user) {
          await supabase.from('profiles').update({ preferred_language: langCode }).eq('id', session.user.id);
       }
    }

    window.location.reload();
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
      >
        <Globe size={18} />
        <span className="text-sm font-medium hidden sm:block">
          {LANGUAGES.find(l => l.code === currentLang)?.label || 'Language'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
          <div className="py-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => applyLanguage(lang.code)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
              >
                {lang.label}
                {currentLang === lang.code && <Check size={16} className="text-brand-purple" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
