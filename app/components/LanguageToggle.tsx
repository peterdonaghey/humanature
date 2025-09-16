import {useLanguage} from "../contexts/LanguageContext";

export function LanguageToggle() {
  const {language, setLanguage} = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "pt" ? "en" : "pt")}
      className="bg-transparent hover:bg-green-100/80 text-green-800 hover:text-green-900 font-semibold py-2 px-4 rounded-full transition-all duration-300 whitespace-nowrap border border-green-200/50 hover:border-green-300 backdrop-blur-sm"
    >
      {language === "pt" ? "EN 🇬🇧" : "PT 🇵🇹"}
    </button>
  );
}
