import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { translations, type Locale } from "@/i18n/translations";

type AnyTranslation = (typeof translations)[Locale];

type LanguageContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: AnyTranslation;
  dir: "rtl" | "ltr";
};

const LanguageContext = createContext<LanguageContextType>({
  locale: "ar",
  setLocale: () => {},
  t: translations.ar,
  dir: "rtl",
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    return saved && ["ar", "en", "zh"].includes(saved) ? saved : "ar";
  });

  const t = translations[locale];
  const dir = t.dir;

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("locale", l);
  };

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = t.lang;
  }, [dir, t.lang]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
