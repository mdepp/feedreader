import "reflect-metadata";

import {
  Button,
  Container,
  CssBaseline,
  Experimental_CssVarsProvider as CssVarsProvider,
  Stack,
  Typography,
  getInitColorSchemeScript,
  unstable_useEnhancedEffect as useEnhancedEffect,
} from "@mui/material";
import type { LoaderArgs, V2_MetaFunction as MetaFunction } from "@remix-run/node";
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
import { Footer, Header } from "~/components";
import { useResetEmotionCache } from "./emotion";
import { authenticator } from "./services/auth.server";
import theme from "./theme";

export const meta: MetaFunction = () => {
  return [{ charSet: "utf-8", title: "Feedreader", viewport: "width=device-width,initial-scale=1" }];
};

export const loader = async ({ request }: LoaderArgs) => {
  return authenticator.isAuthenticated(request);
};

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
        {getInitColorSchemeScript({})}
        <CssVarsProvider theme={theme}>
          <CssBaseline />
          {children}
        </CssVarsProvider>
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
