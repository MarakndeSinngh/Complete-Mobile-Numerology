import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, LanguageInfo, TranslationDictionary } from './types';
import { hi } from './hi';
import { en } from './en';
import { mr } from './mr';
import { bn } from './bn';
import { gu } from './gu';
import { Globe, ChevronDown, Check } from 'lucide-react';

const DICTIONARIES: Record<SupportedLanguage, TranslationDictionary> = {
  hi,
  en,
  mr,
  bn,
  gu,
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  languages: LanguageInfo[];
  currentLanguageInfo: LanguageInfo;
  t: (path: string, params?: Record<string, string | number>) => string;
  dict: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'leo_selected_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
        if (stored && ['hi', 'en', 'mr', 'bn', 'gu'].includes(stored)) {
          return stored;
        }
      }
    } catch (e) {
      console.warn("Could not retrieve language from storage", e);
    }
    return 'hi';
  });

  // Always sync document.documentElement.lang with active language
  useEffect(() => {
    try {
      if (typeof document !== 'undefined') {
        document.documentElement.lang = language;
      }
    } catch (e) {
      // ignore
    }
  }, [language]);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY, lang);
      }
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
      }
    } catch (e) {
      console.warn("Could not save language to storage", e);
    }
  };

  const currentLanguageInfo = useMemo(() => {
    return SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  }, [language]);

  // Nested property lookup with fallback hierarchy: selected -> en (last resort) -> hi
  const t = useMemo(() => {
    return (path: string, params?: Record<string, string | number>): string => {
      const getVal = (dictObj: any, keyPath: string): string | undefined => {
        if (!dictObj || typeof dictObj !== 'object') return undefined;
        const parts = keyPath.split('.');
        let curr = dictObj;
        for (const p of parts) {
          if (curr && typeof curr === 'object' && p in curr) {
            curr = curr[p];
          } else {
            return undefined;
          }
        }
        return typeof curr === 'string' ? curr : undefined;
      };

      const selectedDict = DICTIONARIES[language] || DICTIONARIES.hi;
      let text = getVal(selectedDict, path);

      // Last resort fallback to English dictionary
      if (!text && language !== 'en') {
        text = getVal(DICTIONARIES.en, path);
      }

      // If still missing and language was English, check canonical Hindi
      if (!text && language === 'en') {
        text = getVal(DICTIONARIES.hi, path);
      }

      // If completely missing across dictionaries, log warning in dev
      if (!text) {
        if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
          console.warn(`[i18n] Missing translation key: "${path}" for language: "${language}"`);
        }
        // Return clean human readable key fragment rather than crashing or showing ugly raw code
        const fallbackText = path.split('.').pop() || path;
        return fallbackText;
      }

      // Parameter interpolation for templates like {number}, {name}, etc.
      if (params) {
        Object.entries(params).forEach(([key, val]) => {
          text = text!.replace(new RegExp(`\\{${key}\\}`, 'g'), String(val));
        });
      }

      return text;
    };
  }, [language]);

  const value = {
    language,
    setLanguage,
    languages: SUPPORTED_LANGUAGES,
    currentLanguageInfo,
    t,
    dict: DICTIONARIES[language] || DICTIONARIES.hi,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

/**
 * Global Language Selector Component
 */
export const LanguageSelector: React.FC<{
  variant?: 'header' | 'compact' | 'dropdown' | 'pills';
  className?: string;
}> = ({ variant = 'header', className = '' }) => {
  const { language, setLanguage, languages, currentLanguageInfo } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.leo-language-selector-root')) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('click', handleOutsideClick);
    }
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [isOpen]);

  if (variant === 'pills') {
    return (
      <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
        {languages.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLanguage(l.code)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1 border ${
              language === l.code
                ? 'bg-[#D97706] text-white border-[#D97706] shadow-xs'
                : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-200'
            }`}
          >
            <span>{l.nativeName}</span>
            {language === l.code && <Check className="w-3 h-3 ml-0.5" />}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative leo-language-selector-root ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/90 hover:bg-white text-[#1F2937] px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 hover:border-[#D97706]/40 shadow-2xs transition cursor-pointer"
        aria-label="Select Language"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-[#D97706]" />
        <span className="font-bold">{currentLanguageInfo.nativeName}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-gray-200/80 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-gray-400 border-b border-gray-100 mb-1">
            🌐 भाषा / Language
          </div>
          {languages.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setLanguage(l.code);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between transition cursor-pointer hover:bg-amber-50/60 ${
                language === l.code
                  ? 'text-[#D97706] font-bold bg-amber-50/80'
                  : 'text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{l.nativeName}</span>
                <span className="text-[10px] text-gray-400">({l.label})</span>
              </div>
              {language === l.code && <Check className="w-3.5 h-3.5 text-[#D97706]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export * from './types';
export { hi, en, mr, bn, gu };
