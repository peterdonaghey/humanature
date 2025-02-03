import {NavBar} from "./NavBar";
import {Footer} from "./Footer";

export const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <main className="font-sans flex flex-col items-center h-screen overflow-y-auto w-full">
      <div className="w-full">
        <div className="flex justify-left w-full px-4">
          <img
            src="/humanature-logo.png"
            alt="Humanature Logo"
            className="w-24 mr-12 pb-4"
          />
          <NavBar />
        </div>
        {children}
      </div>
      <Footer />
    </main>
  );
};
