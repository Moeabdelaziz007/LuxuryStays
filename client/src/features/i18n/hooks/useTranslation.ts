import { useContext } from "react";
import { useTranslation as useReactI18nTranslation } from "react-i18next";
import { LanguageContext } from "../context/LanguageContext";

export const useTranslation = () => {
  const { t } = useReactI18nTranslation();
  const { language, setLanguage, isRTL } = useContext(LanguageContext);
  
  return {
    t,
    language,
    setLanguage,
    isRTL
  };
};
