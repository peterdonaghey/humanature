import {createContext, useContext, useState, ReactNode} from "react";

type LanguageContextType = {
  language: "pt" | "en";
  setLanguage: (lang: "pt" | "en") => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({children}: {children: ReactNode}) {
  const [language, setLanguageState] = useState<"pt" | "en">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("language") as "pt" | "en") || "pt";
    }
    return "pt";
  });

  const setLanguage = (lang: "pt" | "en") => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }
  };

  return (
    <LanguageContext.Provider value={{language, setLanguage}}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
