import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (hi: string, en?: string, hg?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // English is the primary default language
    const saved = localStorage.getItem('gurukul_lang_v3') || localStorage.getItem('gurukul_lang');
    if (saved === 'hi' || saved === 'hg' || saved === 'en') {
      if (localStorage.getItem('gurukul_lang_v3')) {
        return saved as Language;
      }
    }
    localStorage.setItem('gurukul_lang_v3', 'en');
    localStorage.setItem('gurukul_lang', 'en');
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('gurukul_lang_v3', lang);
    localStorage.setItem('gurukul_lang', lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (hi: string, en?: string, hg?: string): string => {
    if (language === 'en') return en || hi;
    if (language === 'hg') return hg || en || hi;
    return hi;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
