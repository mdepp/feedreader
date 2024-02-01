import "reflect-metadata";

import type { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  redirect,
  useLoaderData,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import type { PropsWithChildren } from "react";
import rootStylesheet from "~/styles/root.css";
import sharedStylesheet from "~/styles/shared.css";
import { Footer, Header, LinearProgress } from "./components";
import { userPrefs } from "./cookies.server";
import { authenticator } from "./services/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Feedreader" },
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) ?? {};
  return json({ user: await authenticator.isAuthenticated(request), themeMode: cookie.themeMode ?? null });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) ?? {};
  const formData = await request.formData();
  console.log("formData", formData);
  cookie.themeMode = formData.get("themeMode") === "dark" ? "dark" : "light";
  const href = String(formData.get("redirect") ?? "/");
  return redirect(href, { headers: { "Set-Cookie": await userPrefs.serialize(cookie) } });
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: sharedStylesheet },
  { rel: "stylesheet", href: rootStylesheet },
];

function Document({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <noscript>
          <div className="no-script none" />
        </noscript>
      </body>
    </html>
  );
}

export default function App() {
  const { user } = useLoaderData<typeof loader>();
  const { state } = useNavigation();

  return (
    <Document>
      <div className="app-layout">
        <div className="app-layout__header">
          <Header user={user} />
          <LinearProgress key={state} className={state === "idle" ? "hidden" : undefined} />
        </div>
        <main className="app-layout__main">
          <Outlet />
        </main>
        <div className="app-layout__footer">
          <Footer />
        </div>
      </div>
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  console.error(error);

  return (
    <Document>
      <main className="error-layout">
        <h1 className="error-layout__header">Application Error</h1>
        <a className="button button--text" href="/">
          Back
        </a>
      </main>
    </Document>
  );
}
