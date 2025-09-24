import {createContext, useContext, useState, useEffect, ReactNode} from "react";

type LanguageContextType = {
  language: "pt" | "en";
  setLanguage: (lang: "pt" | "en") => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({children}: {children: ReactNode}) {
  // Always start with the same default state on both server and client
  const [language, setLanguageState] = useState<"pt" | "en">("pt");

  // Read from localStorage after hydration to prevent server/client mismatch
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") as "pt" | "en";
    if (storedLanguage) {
      setLanguageState(storedLanguage);
    }
  }, []);

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
