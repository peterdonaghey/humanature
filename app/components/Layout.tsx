import {NavBar} from "./NavBar";

export const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <main className="font-sans flex flex-col items-center h-screen overflow-y-scroll">
      <div className="relative w-3/4">
        <img
          src="https://humanature.s3.eu-central-1.amazonaws.com/humanature_banner.png"
          alt="Humanature"
          className="w-full"
        />
        <div className=" absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>
      </div>
      <div className="translate-y-[-100px]">
        <NavBar />
        {children}
      </div>
    </main>
  );
};
