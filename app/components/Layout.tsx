import {NavBar} from "./NavBar";

export const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <main className="font-sans flex flex-col items-center h-screen">
      <img
        src="https://humanature.s3.eu-central-1.amazonaws.com/humanature_banner.png"
        alt="Humanature"
        className=" w-3/4 "
      />
      <NavBar />
      {children}
    </main>
  );
};
