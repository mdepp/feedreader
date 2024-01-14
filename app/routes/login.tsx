import { Form } from "@remix-run/react";

export default function Login() {
  return (
    <Form action="/auth/auth0" method="post">
      <button className="button button--contained" type="submit">
        Login with Auth0
      </button>
    </Form>
  );
}
