import 'reflect-metadata';

import {Container, CssBaseline, Experimental_CssVarsProvider as CssVarsProvider} from '@mui/material';
import {experimental_extendTheme as extendTheme, getInitColorSchemeScript, ThemeProvider} from '@mui/material/styles';
import type {} from '@mui/material/themeCssVarsAugmentation';
import {LoaderArgs} from '@remix-run/node';
import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData} from '@remix-run/react';
import {Footer, Header} from '~/components';
import {authenticator} from './services/auth.server';

export const loader = async ({request}: LoaderArgs) => {
  return authenticator.isAuthenticated(request);
};

const theme = extendTheme();

export default function App() {
  const user = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
        {getInitColorSchemeScript({})}
        <CssVarsProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header user={user} />
            <div style={{flexGrow: 1, overflow: 'auto'}}>
              <Container maxWidth="md" sx={{py: 4}}>
                <Outlet />
              </Container>
            </div>
            <Footer />
          </ThemeProvider>
        </CssVarsProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
