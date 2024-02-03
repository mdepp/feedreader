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
import type { ThemeMode } from "./types";
import { parseThemeMode } from "./types";

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
  return json({ user: await authenticator.isAuthenticated(request), themeMode: parseThemeMode(cookie.themeMode) });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) ?? {};
  const formData = await request.formData();
  cookie.themeMode = parseThemeMode(String(formData.get("themeMode")));
  const headers = { "Set-Cookie": await userPrefs.serialize(cookie) };
  const href = formData.get("redirect");
  if (href) return redirect(String(href), { headers });
  return new Response(null, { headers });
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: sharedStylesheet },
  { rel: "stylesheet", href: rootStylesheet },
];

function Document({ children, themeMode }: PropsWithChildren<{ themeMode?: ThemeMode }>) {
  return (
    <html lang="en" data-theme-mode-server={themeMode}>
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
  const { user, themeMode } = useLoaderData<typeof loader>();
  const { state } = useNavigation();

  return (
    <Document themeMode={themeMode}>
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
