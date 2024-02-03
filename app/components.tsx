import { Form, NavLink, Link as RouterLink, useFetcher, useHref, useRouteLoaderData } from "@remix-run/react";
import type { ReactNode } from "react";
import { useEffect, useId, useState } from "react";
import type { Auth0Profile } from "remix-auth-auth0";
import type { loader } from "./root";
import { ChevronDownIcon } from "./svgs";
import { parseThemeMode } from "./types";

function ModeSwitcher() {
  const { themeMode: serverMode = "system" } = useRouteLoaderData<typeof loader>("root") ?? {};
  const fetcher = useFetcher();
  const href = useHref(".");

  const [clientMode, setClientMode] = useState(serverMode);
  useRootDataAttribute("data-theme-mode-client", clientMode);

  return (
    <fetcher.Form className="mode-switcher" action="/" method="POST">
      <div className="mode-switcher__select-container">
        <select
          className="mode-switcher__select"
          name="themeMode"
          onChange={(e) => {
            fetcher.submit(e.currentTarget.form);
            setClientMode(parseThemeMode(e.currentTarget.value));
          }}
          defaultValue={serverMode}
        >
          <option className="mode-switcher__select-option" value="light">
            Light
          </option>
          <option className="mode-switcher__select-option" value="dark">
            Dark
          </option>
          <option className="mode-switcher__select-option" value="system">
            System
          </option>
        </select>
        <div className="mode-switcher__select-icon-container">
          <ChevronDownIcon className="mode-switcher__select-icon" />
        </div>
      </div>
      <input type="hidden" name="redirect" value={href} />
      <button className="mode-switcher__submit button button--text" type="submit">
        Update
      </button>
    </fetcher.Form>
  );
}

function useRootDataAttribute(attribute: string, value: string) {
  useEffect(() => {
    const html = document.getElementsByTagName("html")[0];
    html.setAttribute(attribute, value);
    return () => html.removeAttribute(attribute);
  }, [attribute, value]);
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
