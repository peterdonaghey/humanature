import {Link} from "@remix-run/react";
import {useLanguage} from "../contexts/LanguageContext";

export const NavBar = () => {
  const {language} = useLanguage();
  const colors = [
    "bg-emerald-600",
    "bg-amber-700",
    "bg-sage-600",
    "bg-terra-700",
  ];

  const NavBarButton = ({
    to,
    text,
    index,
    children,
  }: {
    to: string;
    text: string;
    index: number;
    children?: React.ReactNode;
  }) => {
    const bgColor = colors[index % colors.length];
    const hasChildren = children !== undefined;

    return (
      <div className="relative group">
        <Link
          to={to}
          className={`
            whitespace-nowrap
            text-sm font-medium
            ${bgColor} text-stone-50
            px-4 py-2 rounded-full
            shadow-sm
            opacity-90 hover:opacity-100
            transition-all duration-300 ease-out
            hover:transform hover:scale-105
          `}
        >
          {text}
        </Link>
        {hasChildren && (
          <div className="absolute hidden group-hover:block mt-1 left-1/2 -translate-x-1/2 w-max">
            <div
              className="
              flex flex-col items-center gap-4 mt-1 p-2
              animate-fadeIn
            "
            >
              {children}
            </div>
          </div>
        )}
      </div>
    );
  };

  type NavigationOption = {
    to: string;
    ptText: string;
    enText: string;
    children?: NavigationOption[];
  };

  const navigationOptionGroups: NavigationOption[] = [
    {
      to: "/compost-service-fundao",
      ptText: "compostagem",
      enText: "compost",
      children: [
        {
          to: "/why-compost",
          ptText: "porquê compostar?",
          enText: "why compost?",
        },
        {
          to: "/compost-service-fundao",
          ptText: "serviço de compostagem fundão",
          enText: "compost service fundão",
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
    <nav
      className="
      flex justify-center items-center gap-4
      py-4
    "
    >
      {navigationOptionGroups.map((option, i) => (
        <NavBarButton
          key={option.to}
          to={option.to}
          text={language === "pt" ? option.ptText : option.enText}
          index={i}
        >
          {option.children?.map((child) => (
            <NavBarButton
              key={child.to}
              to={child.to}
              text={language === "pt" ? child.ptText : child.enText}
              index={i}
            />
          ))}
        </NavBarButton>
      ))}
    </nav>
  );
};
