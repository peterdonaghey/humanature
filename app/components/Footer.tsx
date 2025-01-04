import {Link} from "@remix-run/react";
import {useLanguage} from "../contexts/LanguageContext";

export const Footer = () => {
  const {language} = useLanguage();

  const socialLinks = [
    {
      name: "YouTube - Quinta do Amanhã",
      icon: "🎥",
      url: "https://www.youtube.com/@quintadoamanha",
    },
    // {
    //   name: "Instagram",
    //   icon: "📸",
    //   url: "https://instagram.com/humanature",
    // },
    {
      name: "Facebook - HumaNature",
      icon: "👥",
      url: "https://www.facebook.com/HumaNatureOfficial",
    },
  ];

  const navigationOptionGroups = [
    {
      to: "/compost-service-fundao",
      ptText: "compostagem",
      enText: "compost",
      children: [
        {
          to: "/why-compost",
          ptText: "Porquê compostar?",
          enText: "Why compost?",
        },
        {
          to: "/compost-service-fundao",
          ptText: "Serviço de compostagem fundão",
          enText: "Compost service fundão",
        },
      ],
    },
    {
      to: "/quintadoamanha",
      ptText: "quinta do amanhã",
      enText: "quinta do amanhã",
    },
  ];

  return (
    <footer className="bg-stone-100 mt-auto w-full">
      <div className="w-full px-4 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-medium mb-3 text-emerald-700 flex items-center gap-2">
              <span>🧭</span>
              {language === "pt" ? "Navegação" : "Navigation"}
            </h3>
            <ul className="space-y-1">
              {navigationOptionGroups.map((option) => (
                <li key={option.to}>
                  <Link
                    to={option.to}
                    className="text-stone-600 hover:text-emerald-600 transition-colors text-sm"
                  >
                    {language === "pt" ? option.ptText : option.enText}
                  </Link>
                  {option.children && (
                    <ul className="ml-3 space-y-1">
                      {option.children.map((child) => (
                        <li key={child.to}>
                          <Link
                            to={child.to}
                            className="text-stone-500 hover:text-emerald-600 transition-colors text-xs"
                          >
                            {language === "pt" ? child.ptText : child.enText}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-lg font-medium mb-3 text-emerald-700 flex items-center gap-2">
              <span>🌐</span>
              {language === "pt" ? "Redes Sociais" : "Social Media"}
            </h3>
            <ul className="flex flex-col gap-4">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-600 hover:text-emerald-600 transition-all hover:scale-110 transform inline-flex items-center gap-2"
                    title={link.name}
                  >
                    <span className="text-2xl">{link.icon}</span>
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-medium mb-3 text-emerald-700 flex items-center gap-2">
              <span>💌</span>
              {language === "pt" ? "Contacto" : "Contact"}
            </h3>
            <a
              href="mailto:hello@humanature.com"
              className="text-stone-600 hover:text-emerald-600 transition-all hover:scale-105 transform inline-flex items-center gap-2 text-sm"
            >
              <span>✉️</span>
              <span>hello@humanature.life</span>
            </a>
          </div>
        </div>

        {/* Good Day Message */}
        <div className="mt-6 pt-4 border-t border-stone-200 text-center text-stone-500 text-xs">
          <span className="inline-flex items-center gap-2">
            <span>✨</span>
            {language === "pt" ? "Tenha um dia mágico!" : "Have a magical day!"}
            <span>✨</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
