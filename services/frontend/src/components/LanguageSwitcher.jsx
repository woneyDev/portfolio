import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="lang-switcher" ref={ref}>
      <button
        type="button"
        className="lang-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        🌐 {lang === 'ko' ? '한국어' : 'English'}
        <span className="lang-caret">▾</span>
      </button>
      {open && (
        <ul className="lang-menu" role="listbox">
          <li>
            <button
              type="button"
              className={lang === 'ko' ? 'active' : ''}
              onClick={() => { setLang('ko'); setOpen(false); }}
            >
              한국어
            </button>
          </li>
          <li>
            <button
              type="button"
              className={lang === 'en' ? 'active' : ''}
              onClick={() => { setLang('en'); setOpen(false); }}
            >
              English
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
