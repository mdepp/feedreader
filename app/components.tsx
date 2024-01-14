import { Form, NavLink, Link as RouterLink } from "@remix-run/react";
import { ChangeEventHandler, ReactNode, useEffect, useId, useState } from "react";
import type { Auth0Profile } from "remix-auth-auth0";

export const ModeSwitcher = () => {
  const [mode, setMode] = useState("default");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setMode("dark");
    } else {
      setMode("light");
    }
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Switch
      data-theme-mode={mode}
      labelOn="Dark"
      labelOff="Light"
      checked={mode === "dark"}
      onChange={(event) => setMode(event.target.checked ? "dark" : "light")}
    />
  );
};

type SwitchProps = {
  labelOn: ReactNode;
  labelOff: ReactNode;
  checked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};
function Switch(props: SwitchProps) {
  const { labelOn, labelOff, checked, onChange, ...rest } = props;
  return (
    <label className="switch" {...rest}>
      <input className="switch__checkbox" type="checkbox" checked={checked} onChange={onChange} />
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
