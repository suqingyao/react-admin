import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './langs/en.json';
import zh from './langs/zh.json';

const resources = {
  en: { translation: en },
  zh: { translation: zh },
};

const detectLanguage = (): 'en' | 'zh' => {
  if (typeof navigator !== 'undefined') {
    const lang = navigator.language.toLowerCase();
    if (lang.startsWith('zh')) return 'zh';
  }
  return 'en';
};

void i18n.use(initReactI18next).init({
  resources,
  lng: detectLanguage(),
  fallbackLng: 'en',
  ns: ['translation'],
  defaultNS: 'translation',
  interpolation: {
    escapeValue: false,
  },
  initImmediate: false,
});

const $t = (key: string, options?: Record<string, any>): string => {
  const translation = i18n.t(key, { defaultValue: '', ...options });
  if (translation) return translation;
  const segments = key.split('.');
  return segments[segments.length - 1] || key;
};

const changeLanguage = (lang: 'en' | 'zh') => {
  return i18n.changeLanguage(lang);
};

export { $t, changeLanguage, i18n };
