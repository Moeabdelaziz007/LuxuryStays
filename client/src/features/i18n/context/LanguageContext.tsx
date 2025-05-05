import { createContext, useState, useEffect, ReactNode } from "react";
import i18n from "../i18n";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: "en" | "ar") => void;
  isRTL: boolean;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  isRTL: false
});

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider = ({ children }: I18nProviderProps) => {
  const [language, setLanguageState] = useState<"en" | "ar">(
    (localStorage.getItem("language") as "en" | "ar") || "en"
  );
  
  const isRTL = language === "ar";
  
  const setLanguage = (lang: "en" | "ar") => {
    localStorage.setItem("language", lang);
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", lang);
  };
  
  useEffect(() => {
    // Initialize language from localStorage or default to English
    const savedLanguage = localStorage.getItem("language") as "en" | "ar" || "en";
    setLanguage(savedLanguage);
  }, []);
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};
