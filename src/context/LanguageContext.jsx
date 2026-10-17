import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

export const LANGUAGES = [
  { code: 'en', label: 'EN', flag: '🇬🇧', name: 'English' },
  { code: 'vi', label: 'VN', flag: '🇻🇳', name: 'Tiếng Việt' },
  { code: 'ja', label: 'JP', flag: '🇯🇵', name: '日本語' }
];

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('sakura_lang') || 'en';
  });

  const changeLanguage = (newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
      localStorage.setItem('sakura_lang', newLang);
    }
  };

  const t = (key, params = {}) => {
    const currentDict = translations[lang] || translations.en;
    let text = currentDict[key] || translations.en[key] || key;

    // Interpolate {param}
    Object.keys(params).forEach((paramKey) => {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), params[paramKey]);
    });

    return text;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
