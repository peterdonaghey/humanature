import {Outlet, useOutletContext} from "@remix-run/react";

type ContextType = {
  user: {
    id: string;
    username: string;
    privilages: string[];
  } | null;
};

export default function Projects() {
  const context = useOutletContext<ContextType>();

  return <Outlet context={context} />;
}
