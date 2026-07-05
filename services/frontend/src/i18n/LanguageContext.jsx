import { createContext, useContext, useEffect, useState } from 'react';
import { strings } from './strings';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'ko');

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
