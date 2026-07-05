import { createContext, useContext, useEffect, useState } from 'react';
import { strings } from './strings';

const LanguageContext = createContext(null);

function detectBrowserLang() {
  const browserLang = navigator.language || navigator.languages?.[0] || '';
  return browserLang.toLowerCase().startsWith('ko') ? 'ko' : 'en';
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || detectBrowserLang());

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: strings[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
