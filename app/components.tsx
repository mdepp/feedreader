import { AppBar, Button, Container, FormControlLabel, styled, Switch, Toolbar, Typography } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { Form, NavLink, Link as RouterLink } from "@remix-run/react";
import { useEffect, useState } from "react";
import type { Auth0Profile } from "remix-auth-auth0";

export const ModeSwitcher = () => {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <FormControlLabel
      label={mode === "light" ? "Light" : "Dark"}
      control={
        <Switch
          checked={mode === "dark"}
          onChange={(e, checked) => {
            setMode(checked ? "dark" : "light");
          }}
        />
      }
    />
  );
};

export const Footer = () => {
  return (
    <footer
      style={{
        background: "var(--mui-palette-background-default)",
        borderTop: "1px solid var(--mui-palette-divider)",
        display: "flex",
        justifyContent: "end",
      }}
    >
      <ModeSwitcher />
    </footer>
  );
};

const HeaderNavLink = styled(Button)({
  color: "var(--mui-palette-text-secondary)",
  display: "flex",
  minHeight: "inherit",
  borderRadius: 0,
  "&.active": {
    color: "var(--mui-palette-text-primary)",
    textDecoration: "underline",
  },
  "&:hover": {
    color: "var(--mui-palette-text-primary)",
    background: "unset",
  },
}) as typeof Button;

export const Header = ({ user }: { user: Auth0Profile | null }) => {
  return (
    <AppBar variant="outlined" elevation={0} position="static" sx={{ borderTop: "none" }} color="transparent">
      <Container maxWidth="md">
        <Toolbar variant="regular" sx={{ alignItems: "center" }} disableGutters>
          <RouterLink to="/" style={{ display: "contents", color: "var(--mui-palette-text-primary)" }}>
            <Typography variant="h4" sx={{ mr: 4, display: user === null ? "flex" : { xs: "none", sm: "flex" } }}>
              Feedreader
            </Typography>
          </RouterLink>
          {user !== null && (
            <>
              <HeaderNavLink component={NavLink} to="/feed">
                Feed
              </HeaderNavLink>
              <HeaderNavLink component={NavLink} to="/channels">
                Channels
              </HeaderNavLink>
              <div style={{ flexGrow: 1 }} />
              <Form action="/auth/logout" method="post">
                <Button type="submit">Log out</Button>
              </Form>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
