import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Language, Translations, getTranslations, availableLanguages } from './translations';

// ============================================================================
// TYPES
// ============================================================================

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  availableLanguages: typeof availableLanguages;
}

// ============================================================================
// CONTEXT
// ============================================================================

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'artconnect-language';

// Get initial language (extracted for reuse)
const getInitialLanguage = (defaultLanguage: Language): Language => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'id' || stored === 'en') {
      return stored;
    }
    
    // Try to detect from browser
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'en') {
      return 'en';
    }
  } catch (e) {
    // localStorage may not be available
  }
  
  return defaultLanguage;
};

// ============================================================================
// PROVIDER
// ============================================================================

interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLanguage?: Language;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  defaultLanguage = 'id',
}) => {
  const [language, setLanguageInternal] = useState<Language>(() => 
    getInitialLanguage(defaultLanguage)
  );
  
  // Force update counter to trigger re-renders
  const [, forceUpdate] = useState(0);

  // Set language and persist to localStorage
  const setLanguage = useCallback((lang: Language) => {
    console.log('[i18n] Setting language to:', lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.error('[i18n] Failed to save language to localStorage:', e);
    }
    setLanguageInternal(lang);
    // Force re-render of all consumers
    forceUpdate(prev => prev + 1);
  }, []);

  // Get translations directly based on current language state
  const t = useMemo(() => {
    console.log('[i18n] Getting translations for:', language);
    return getTranslations(language);
  }, [language]);

  const value: LanguageContextType = useMemo(() => ({
    language,
    setLanguage,
    t,
    availableLanguages,
  }), [language, setLanguage, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// ============================================================================
// HOOK
// ============================================================================

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Re-export types and utilities
export { type Language, type Translations, availableLanguages } from './translations';
