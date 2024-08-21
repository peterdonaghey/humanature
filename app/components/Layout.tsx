import {NavBar} from "./NavBar";

export const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <main className="font-sans flex flex-col items-center h-screen overflow-y-scroll w-full">
      <div className="relative  w-full">
        <img
          src="https://humanature.s3.eu-central-1.amazonaws.com/humanature_banner.png"
          alt="Humanature"
          className="w-full"
        />
        <div className="w-full absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>
      </div>
      <div className="w-full translate-y-[-100px]">
        <NavBar />
        {children}
      </div>
    </main>
  );
};
