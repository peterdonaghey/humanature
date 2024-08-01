import {Link} from "@remix-run/react";

export const NavBar = () => {
  const NavBarButton = ({
    to,
    text,
    key,
  }: {
    to: string;
    text: string;
    key: string;
  }) => {
    return (
      <Link to={to} className="relative group cursor-pointer mt-4" key={key}>
        <div className="absolute -inset-1 bg-gradient-to-r from-sky-600 to-red-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-500 group-hover:duration-200"></div>
        <div className="relative px-7 py-4 bg-white ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
          <div className="space-y-1">
            <p className="text-slate-800">{text}</p>
          </div>
        </div>
      </Link>
    );
  };

  const navigationOptions = [
    {to: "/", text: "home"},
    {to: "/compost", text: "compost"},
  ];

  return (
    <nav className="flex justify-center space-x-4">
      {navigationOptions.map((option) => (
        <NavBarButton key={option.to} to={option.to} text={option.text} />
      ))}
    </nav>
  );
};
