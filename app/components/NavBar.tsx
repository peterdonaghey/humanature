import {Link, useOutletContext} from "@remix-run/react";
import {useLanguage} from "../contexts/LanguageContext";
import {UserAvatar} from "./UserAvatar";
import {useState} from "react";

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
    to: "/calendar",
    ptText: "calendário",
    enText: "calendar",
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
    to: "/posts",
    ptText: "posts",
    enText: "posts",
    bgColor: "bg-sky-600",
  },
  {
    to: "/projects",
    allowedRoles: ["admin"],
    ptText: "projetos",
    enText: "projects",
    bgColor: "bg-yellow-500",
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    <nav className="flex justify-between items-center w-full py-4">
      {/* Desktop Navigation - Hidden on Mobile */}
      <div className="hidden md:flex items-center justify-left gap-4 w-full">
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

      {/* Mobile Hamburger Button */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Desktop User Avatar */}
      <div className="hidden md:flex items-end justify-end gap-4 w-fit">
        {user && <UserAvatar username={user.username} />}
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 md:hidden z-50">
          <div className="px-4 py-2 space-y-2">
            {navigationOptionGroups.map((option) => {
              if (!isAllowed(option)) return null;
              return (
                <div key={option.to}>
                  <Link
                    to={option.to}
                    className={`block px-4 py-3 text-sm font-medium ${option.bgColor} text-white rounded-lg mb-2`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {language === "pt" ? option.ptText : option.enText}
                  </Link>
                  {option.children?.map((child) => {
                    if (!isAllowed(child)) return null;
                    return (
                      <Link
                        key={child.to}
                        to={child.to}
                        className={`block px-6 py-2 text-sm ${child.bgColor} text-white rounded-lg mb-1 ml-4`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {language === "pt" ? child.ptText : child.enText}
                      </Link>
                    );
                  })}
                </div>
              );
            })}
            {/* Mobile User Avatar */}
            {user && (
              <div className="border-t border-gray-200 pt-2 mt-2">
                <UserAvatar username={user.username} />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
