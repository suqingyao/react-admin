import { createContext, type PropsWithChildren, useContext, useState } from 'react';
import { setLng } from '@/locales';

export type LangContextType = {
  locale: App.I18n.LangType;
  localeOptions: App.I18n.LangOption[];
  setLocale: (locale: App.I18n.LangType) => void;
};

export const LangContext = createContext<LangContextType>({
  locale: 'zh-CN',
  localeOptions: [
    {
      key: 'zh-CN',
      label: '中文',
    },
    {
      key: 'en-US',
      label: 'English',
    },
  ],
  setLocale: (locale: App.I18n.LangType) => {},
});

export function useLang() {
  const context = useContext(LangContext);

  if (!context) {
    throw new Error('useLang must be used within a LangProvider');
  }

  return context;
}

export const LangProvider = ({ children }: PropsWithChildren) => {
  const [locale, setLocale] = useState<App.I18n.LangType>('zh-CN');

  function changeLang(lang: App.I18n.LangType) {
    setLng(locale);
    setLocale(lang);
  }

  return (
    <LangContext
      value={{
        locale,
        localeOptions: [
          {
            key: 'zh-CN',
            label: '中文',
          },
          {
            key: 'en-US',
            label: 'English',
          },
        ],
        setLocale: changeLang,
      }}>
      {children}
    </LangContext>
  );
};
