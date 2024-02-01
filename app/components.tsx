import { Form, NavLink, Link as RouterLink, useFetcher, useHref, useRouteLoaderData } from "@remix-run/react";
import type { ChangeEventHandler, ReactNode } from "react";
import { useId, useState } from "react";
import type { Auth0Profile } from "remix-auth-auth0";
import type { loader } from "./root";

export const ModeSwitcher = () => {
  return (
    <>
      <div className="client-only">
        <ModeSwitcherClient />
      </div>
      <div className="server-only">
        <ModeSwitcherServer />
      </div>
    </>
  );
};

function ModeSwitcherServer() {
  const { themeMode } = useRouteLoaderData<typeof loader>("root") ?? {};
  const href = useHref(".");
  return (
    <Form className="mode-switcher" action="/" method="POST">
      <Switch
        data-theme-mode-server={themeMode}
        name="themeMode"
        value="dark"
        labelOn="Dark"
        labelOff="Light"
        defaultChecked={themeMode === "dark"}
      />
      <input type="hidden" name="redirect" value={href} />
      <button className="mode-switcher__submit button button--text" type="submit">
        Update
      </button>
    </Form>
  );
}

function ModeSwitcherClient() {
  const preferredThemeMode = usePreferredThemeMode();
  const { themeMode: defaultThemeMode } = useRouteLoaderData<typeof loader>("root") ?? {};
  const fetcher = useFetcher();
  const [themeMode, setThemeMode] = useState(defaultThemeMode);

  return (
    <Switch
      data-theme-mode-client={themeMode}
      labelOn="Dark"
      labelOff="Light"
      checked={(themeMode ?? preferredThemeMode) === "dark"}
      onChange={(e) => {
        const newMode = e.target.checked ? "dark" : "light";
        setThemeMode(newMode);
        fetcher.submit({ themeMode: newMode }, { action: "/", method: "POST" });
      }}
    />
  );
}

function usePreferredThemeMode() {
  if ("window" in globalThis) {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    return mql.matches ? "dark" : "light";
  }
  return null;
}

type SwitchProps = {
  name?: string;
  value?: string;
  labelOn: ReactNode;
  labelOff: ReactNode;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};
function Switch(props: SwitchProps) {
  const { name, value, labelOn, labelOff, defaultChecked, checked, onChange, ...rest } = props;
  return (
    <label className="switch" {...rest}>
      <input
        className="switch__checkbox"
        type="checkbox"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        checked={checked}
        onChange={onChange}
      />
      <span className="switch__track-container">
        <span className="switch__track" />
        <span className="switch__thumb" />
      </span>
      <span className="switch__label-on">{labelOn}</span>
      <span className="switch__label-off">{labelOff}</span>
    </label>
  );
}

export const Footer = () => {
  return (
    <footer className="footer">
      <ModeSwitcher />
    </footer>
  );
};

export const Header = ({ user }: { user: Auth0Profile | null }) => {
  return (
    <header className="header">
      <div className="header__container">
        <h1 className="header__title">
          <RouterLink to="/">Feedreader</RouterLink>
        </h1>
        {user !== null && (
          <>
            <nav className="header__nav" aria-label="Main Menu">
              <NavLink className="header__link" to="/feed">
                Feed
              </NavLink>
              <NavLink className="header__link" to="/channels">
                Channels
              </NavLink>
            </nav>
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

export function TooltipContainer(props: { title: string; children: ReactNode }) {
  const id = useId();
  const { title, children } = props;
  return (
    <div className="tooltip">
      <div className="tooltip__shadow-container">
        <span className="tooltip__title" role="tooltip" id={id}>
          {title}
        </span>
      </div>
      <div className="tooltip__content" aria-describedby={id}>
        {children}
      </div>
    </div>
  );
}

export function LinearProgress(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return (
    <div role="progressbar" className={`linear-progress ${className}`} {...rest}>
      <div className="linear-progress__bar" />
    </div>
  );
}
