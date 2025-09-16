import {NavBar} from "./NavBar";
import {Footer} from "./Footer";
import {LanguageToggle} from "./LanguageToggle";

export const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <main className="font-sans flex flex-col items-center h-screen overflow-y-auto w-full">
      {/* Sticky Language Toggle - Top Right Corner */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageToggle />
      </div>

      <div className="w-full">
        <div className="flex justify-left w-full px-4 relative">
          <img
            src="/quinta-logo.png"
            alt="Quinta do Amanhã Logo"
            className="w-32 md:w-48 mr-4 md:mr-12 pb-4"
          />
          <div className="w-full mt-6 md:mt-12 relative">
            <NavBar />
          </div>
        </div>
        <div>{children}</div>
      </div>
      <Footer />
    </main>
  );
};
