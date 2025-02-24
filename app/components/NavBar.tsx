import {Link, useOutletContext} from "@remix-run/react";
import {useLanguage} from "../contexts/LanguageContext";
import {LanguageToggle} from "./LanguageToggle";
import {UserAvatar} from "./UserAvatar";

export type NavigationOption = {
  to: string;
  ptText: string;
  enText: string;
  children?: NavigationOption[];
  allowedRoles?: string[];
  isAllowed?: boolean;
  bgColor?: string;
};

export const navigationOptionGroups: NavigationOption[] = [
  {
    to: "/quintadoamanha",
    ptText: "quinta do amanhã",
    enText: "quinta do amanhã",
    bgColor: "bg-amber-700",
  },
  {
    to: "/compost-service-fundao",
    ptText: "compostagem",
    enText: "compost",
    bgColor: "bg-emerald-600",
    children: [
      {
        to: "/why-compost",
        ptText: "porquê compostar?",
        enText: "why compost?",
        bgColor: "bg-emerald-600",
      },
      {
        to: "/compost-service-fundao",
        ptText: "serviço de compostagem fundão",
        enText: "compost service fundão",
        bgColor: "bg-emerald-600",
      },
    ],
  },
  {
    to: "/projects",
    allowedRoles: ["admin"],
    ptText: "projetos",
    enText: "projects",
    bgColor: "bg-sky-600",
  },
  {
    to: "/users",
    allowedRoles: ["userAdmin"],
    ptText: "usuários",
    enText: "users",
    bgColor: "bg-red-600",
  },
];

type ContextType = {
  user: {
    id: string;
    username: string;
    privilages: string[];
  } | null;
};

export const NavBar = () => {
  const {language} = useLanguage();
  const {user} = useOutletContext<ContextType>();
  // console.log(user?.privilages);

  const isAllowed = (option: NavigationOption) => {
    if (option.allowedRoles) {
      return option.allowedRoles.some((role) =>
        user?.privilages.includes(role)
      );
    }
    return true;
  };

  const NavBarButton = ({
    to,
    text,
    children,
    isAllowed,
    bgColor,
  }: {
    to: string;
    text: string;
    children?: React.ReactNode;
    isAllowed?: boolean;
    bgColor?: string;
  }) => {
    const hasChildren = children !== undefined;

    if (!isAllowed) {
      return null;
    }

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

  return (
    <nav
      className="
      flex justify-between items-center gap-4 w-full
      py-4
    "
    >
      <div className="flex items-center justify-left gap-4 w-full">
        {navigationOptionGroups.map((option) => (
          <NavBarButton
            key={option.to}
            to={option.to}
            text={language === "pt" ? option.ptText : option.enText}
            isAllowed={isAllowed(option)}
            bgColor={option.bgColor}
          >
            {option.children?.map((child) => (
              <NavBarButton
                key={child.to}
                to={child.to}
                text={language === "pt" ? child.ptText : child.enText}
                isAllowed={isAllowed(child)}
                bgColor={child.bgColor}
              />
            ))}
          </NavBarButton>
        ))}
      </div>
      <div className="flex items-end justify-end gap-4 w-fit">
        <LanguageToggle />
        {user && <UserAvatar username={user.username} />}
      </div>
    </nav>
  );
};
