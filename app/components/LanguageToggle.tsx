import {useLanguage} from "../contexts/LanguageContext";

export function LanguageToggle() {
  const {language, setLanguage} = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "pt" ? "en" : "pt")}
      className=" bg-green-100 hover:bg-green-200 text-green-800 font-semibold py-2 px-4 rounded-full transition-colors duration-200 whitespace-nowrap"
    >
      {language === "pt" ? "EN 🇬🇧" : "PT 🇵🇹"}
    </button>
  );
}
