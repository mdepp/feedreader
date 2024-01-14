import "reflect-metadata";

import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import type { PropsWithChildren } from "react";
import rootStylesheet from "~/styles/root.css";
import sharedStylesheet from "~/styles/shared.css";
import { Footer, Header } from "./components";
import { authenticator } from "./services/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Feedreader" },
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return authenticator.isAuthenticated(request);
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
      </body>
    </html>
  );
}

export default function App() {
  const user = useLoaderData<typeof loader>();

  return (
    <Document>
      <div className="app-layout">
        <div className="app-layout__header">
          <Header user={user} />
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
