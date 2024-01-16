import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { useId } from "react";
import invariant from "tiny-invariant";
import { authenticator } from "~/services/auth.server";
import database from "~/services/database.server";

export const action = async ({ request }: ActionFunctionArgs): Promise<{ url?: string | null; message?: string }> => {
  const user = await authenticator.isAuthenticated(request, { failureRedirect: "/login" });

  const formData = await request.formData();
  const url = formData.get("url");

  if (url === null) {
    return { message: "URL is required" };
  }

  invariant(typeof url === "string", "url must be a string");

  let channel;
  try {
    channel = await database.createChannel(user, url);
  } catch (err) {
    console.error(err);
    return { message: "Failed to add channel" };
  }
  if (channel === null) {
    return { message: "A channel with this URL already exists" };
  }
  return redirect("/channels");
};

export default function New() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const errors = useActionData<typeof action>();
  const inputId = useId();

  return (
    <Form method="post">
      <div className="card">
        <div className="card__title">New Channel</div>
        <div className="card__content card__content--stack">
          <label className="sr-only" htmlFor={inputId}>
            URL
          </label>
          <input className="textinput" type="url" name="url" placeholder="URL*" required id={inputId} />
          {Boolean(errors?.message) && (
            <div role="alert" className="alert alert--error">
              {errors?.message}
            </div>
          )}
        </div>
        <div className="card__actions">
          <button className="button button--contained" type="submit" disabled={isSubmitting}>
            Submit
          </button>
          <Link className="button button--text" to="/channels">
            Cancel
          </Link>
        </div>
      </div>
    </Form>
  );
}
