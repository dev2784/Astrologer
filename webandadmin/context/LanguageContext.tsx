"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "../locals/en.json";
import hi from "../locals/hi.json";

type Language = "en" | "hi";

const translations = { en, hi };

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (keyPath: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // 1. Set default state to "hi" instead of "en"
  const [language, setLanguageState] = useState<Language>("hi");

  useEffect(() => {
    const savedLang = localStorage.getItem("app_lang") as Language;
    
    // 2. If a user already explicitly selected a language before, respect it;
    // otherwise, default to "hi"
    if (savedLang && (savedLang === "en" || savedLang === "hi")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguageState(savedLang);
    } else {
      setLanguageState("hi");
      localStorage.setItem("app_lang", "hi");
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app_lang", lang);
  };

  const toggleLanguage = () => {
    const newLang = language === "en" ? "hi" : "en";
    setLanguage(newLang);
  };

  const t = (keyPath: string): string => {
    const keys = keyPath.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = translations[language];

    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        return keyPath;
      }
    }

    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}