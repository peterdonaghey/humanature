import {Link} from "@remix-run/react";

export const NavBar = () => {
  const colors = ["bg-lime-500", "bg-sky-500", "bg-amber-500", "bg-indigo-500"];
  const NavBarButton = ({
    to,
    text,
    index,
  }: {
    to: string;
    text: string;
    index: number;
  }) => {
    const bgColor = colors[index];

    return (
      <Link
        to={to}
        className={`relative group cursor-pointer h-fit mt-4 select-none whitespace-nowrap px-4 py-2 ${bgColor} text-white rounded-lg shadow-md opacity-80 hover:opacity-100 transition duration-300 ease-in-out transform hover:-translate-y-1`}
      >
        {text}
      </Link>
    );
  };

  const navigationOptions = [
    // {to: "/", text: "home"},
    {to: "/compost", text: "compost"},
    {to: "/quintadoamanha", text: "quinta do amanhã"},
  ];

  return (
    <nav className="flex justify-center space-x-4 align-middle">
      {navigationOptions.map((option, i) => (
        <NavBarButton
          key={option.to}
          to={option.to}
          text={option.text}
          index={i}
        />
      ))}
    </nav>
  );
};
