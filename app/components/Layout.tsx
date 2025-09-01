import {NavBar} from "./NavBar";
import {Footer} from "./Footer";

export const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <main className="font-sans flex flex-col items-center h-screen overflow-y-auto w-full">
      <div className="w-full">
        <div className="flex justify-left w-full px-4 relative">
          <img
            src="/quinta-logo.png"
            alt="Quinta do Amanhã Logo"
            className="w-48 mr-12 pb-4 "
          />
          <div className="w-full mt-12">
            <NavBar />
          </div>
        </div>
        <div>{children}</div>
      </div>
      <Footer />
    </main>
  );
};
