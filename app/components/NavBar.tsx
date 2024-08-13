import {Link} from "@remix-run/react";

export const NavBar = () => {
  const colors = ["lime-500", "sky-500", "amber-500", "indigo-500"];
  const NavBarButton = ({
    to,
    text,
    index,
  }: {
    to: string;
    text: string;
    index: number;
  }) => {
    const bgColor = colors[index % colors.length];
    const hoverColor = colors[(index + 1) % colors.length];

    return (
      <Link
        to={to}
        className={`relative group cursor-pointer mt-4   px-4 py-2 bg-${bgColor} text-white rounded-lg shadow-md hover:bg-${hoverColor} transition duration-300 ease-in-out transform hover:-translate-y-1`}
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
