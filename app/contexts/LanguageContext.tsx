import {createContext, useContext, useState, ReactNode} from "react";

type LanguageContextType = {
  language: "pt" | "en";
  setLanguage: (lang: "pt" | "en") => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({children}: {children: ReactNode}) {
  const [language, setLanguage] = useState<"pt" | "en">("pt");

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
