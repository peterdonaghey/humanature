import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type {LoaderFunctionArgs} from "@remix-run/node";
import {json} from "@remix-run/node";
import "./tailwind.css";
import {LanguageProvider} from "./contexts/LanguageContext";
import {getUser} from "./utils/auth.server";

export async function loader({request}: LoaderFunctionArgs) {
  const user = await getUser(request);
  return json({user});
}

export function Layout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const {user} = useLoaderData<typeof loader>();

  return (
    <LanguageProvider>
      <Layout>
        <Outlet context={{user}} />
      </Layout>
    </LanguageProvider>
  );
}
