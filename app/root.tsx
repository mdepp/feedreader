import "reflect-metadata";

import { ThemeProvider } from "@emotion/react";
import { Button, Container, Stack, Typography, unstable_useEnhancedEffect as useEnhancedEffect } from "@mui/material";
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
import stylesheet from "~/tailwind.css";
import { Footer, Header } from "./components";
import { useResetEmotionCache } from "./emotion";
import { authenticator } from "./services/auth.server";
import theme from "./theme";

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

export const links: LinksFunction = () => [{ rel: "stylesheet", href: stylesheet }];

function Document({ children }: PropsWithChildren) {
  const resetCache = useResetEmotionCache();
  useEnhancedEffect(() => {
    resetCache();
  }, []);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body style={{ height: "100vh" }}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
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
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Header user={user} />
        <div style={{ flexGrow: 1, overflow: "auto" }}>
          <Container maxWidth="md" sx={{ py: 4 }}>
            <Outlet />
          </Container>
        </div>
        <Footer />
      </div>
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  console.error(error);

  return (
    <Document>
      <Container sx={{ position: "relative", top: "30vh" }}>
        <Stack spacing={1} alignItems="center">
          <Typography variant="h3">Application Error</Typography>
          <Button href="/">Back</Button>
        </Stack>
      </Container>
    </Document>
  );
}
