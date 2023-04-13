import {Button} from '@mui/material';
import {Form} from '@remix-run/react';

export default function Login() {
  return (
    <Form action="/auth/auth0" method="post">
      <Button type="submit" variant="contained">
        Login with Auth0
      </Button>
    </Form>
  );
}
