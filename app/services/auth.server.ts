import {Authenticator} from 'remix-auth';
import {Auth0Profile, Auth0Strategy} from 'remix-auth-auth0';
import {sessionStorage} from '~/services/session.server';

export const authenticator = new Authenticator<Auth0Profile>(sessionStorage);

const auth0Strategy = new Auth0Strategy(
  {
    callbackURL: process.env.AUTH0_CALLBACK_URL!,
    clientID: process.env.AUTH0_CLIENT_ID!,
    clientSecret: process.env.AUTH0_CLIENT_SECRET!,
    domain: process.env.AUTH0_DOMAIN!,
  },
  async ({profile}) => profile
);

authenticator.use(auth0Strategy);
