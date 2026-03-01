// src/locales/useTranslation.ts

import heTranslations from './he.json';
import enTranslations from './en.json';

type TranslationKey = string;

// Read language from environment variable (default: 'he')
const LANGUAGE = (process.env.REACT_APP_LANGUAGE || 'he') as 'he' | 'en';

const translations: Record<'he' | 'en', Record<string, any>> = {
  he: heTranslations,
  en: enTranslations,
};

/**
 * Custom hook for translations
 * Usage: const { t } = useTranslation();
 *        <h1>{t('exam.upload.title')}</h1>
 */
export function useTranslation() {
  const t = (key: TranslationKey, defaultValue?: string): string => {
    const keys = key.split('.');
    let value: any = translations[LANGUAGE];

    // Navigate through nested keys
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        break;
      }
    }

    // Return translation, default value, or key name as fallback
    if (typeof value === 'string') {
      return value;
    }

    if (defaultValue !== undefined) {
      return defaultValue;
    }

    // Fallback: return key name (helps identify missing translations)
    console.warn(`[i18n] Missing translation: ${key}`);
    return key;
  };

  return { t };
}

/**
 * Get current language
 */
export function getCurrentLanguage(): 'he' | 'en' {
  return LANGUAGE;
}
