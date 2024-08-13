import {Link} from "@remix-run/react";

export const NavBar = () => {
  const NavBarButton = ({to, text}: {to: string; text: string}) => {
    return (
      <Link
        to={to}
        className="relative group cursor-pointer mt-4 px-4 py-2 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300 ease-in-out transform hover:-translate-y-1"
      >
        {text}
      </Link>
    );
  };

  const navigationOptions = [
    {to: "/", text: "home"},
    {to: "/compost", text: "compost"},
    {to: "/fermentaria", text: "fermentaria"},
    {to: "/quintadoamanha", text: "quinta do amanhã"},
  ];

  return (
    <nav className="flex justify-center space-x-4">
      {navigationOptions.map((option) => (
        <div key={option.to}>
          <NavBarButton to={option.to} text={option.text} />
        </div>
      ))}
    </nav>
  );
};
