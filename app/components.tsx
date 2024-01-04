import { Button, FormControlLabel, styled, Switch } from "@mui/material";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { Form, NavLink, Link as RouterLink } from "@remix-run/react";
import { useEffect, useState } from "react";
import type { Auth0Profile } from "remix-auth-auth0";

export const ModeSwitcher = () => {
  const [mode, setMode] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <FormControlLabel
      data-theme-mode={mode}
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
    <header className="header">
      <div className="header__container">
        <h1 className="header__title">
          <RouterLink to="/">Feedreader</RouterLink>
        </h1>
        {user !== null && (
          <>
            <NavLink className="header__link" to="/feed">
              Feed
            </NavLink>
            <NavLink className="header__link" to="/channels">
              Channels
            </NavLink>
            <Form className="header__logout" action="/auth/logout" method="post">
              <button className="button button--text" type="submit">
                Log out
              </button>
            </Form>
          </>
        )}
      </div>
    </header>
  );
};
