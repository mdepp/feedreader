import { LoaderArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ request }: LoaderArgs) => {
  return authenticator.authenticate("auth0", request, { successRedirect: "/", failureRedirect: "/login" });
};
