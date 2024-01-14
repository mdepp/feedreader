import type { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs, SerializeFrom } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Outlet, useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { TooltipContainer } from "~/components";
import { authenticator } from "~/services/auth.server";
import database from "~/services/database.server";
import stylesheet from "~/styles/channels.css";
import { DeleteIcon, ExternalLinkIcon } from "~/svgs";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: stylesheet }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, { failureRedirect: "/login" });
  return database.listChannels(user);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, { failureRedirect: "/login" });

  const formData = await request.formData();
  const id = formData.get("id");
  invariant(typeof id === "string", "id must be a string");

  try {
    await database.deleteChannel(user, parseInt(id, 10));
  } catch (err) {
    console.error(err);
    return "Failed to delete channel";
  }
  return redirect("/channels");
};

function ChannelsList(props: { channels: SerializeFrom<typeof loader> }) {
  const { channels } = props;
  return (
    <ul className="channel-list">
      {channels.map((channel) => (
        <li key={channel.id} className="channel-list__item">
          <div>
            <span className="channel-list__item__title">{channel.title}</span>
            <p className="channel-list__item__description">{channel.description}</p>
          </div>
          <div className="channel-list__item__actions">
            <TooltipContainer title="Visit Website">
              <a
                className="button button--text button--icon"
                href={channel.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLinkIcon aria-label="Visit Website" />
              </a>
            </TooltipContainer>
            <Form method="post" className="contents">
              <input name="id" defaultValue={channel.id} hidden />
              <TooltipContainer title="Delete Channel">
                <button className="button button--text button--icon" type="submit">
                  <DeleteIcon aria-label="Delete Channel" />
                </button>
              </TooltipContainer>
            </Form>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Channels() {
  const channels = useLoaderData<typeof loader>();
  const errorMessage = useActionData<typeof action>();

  return (
    <div className="channels">
      <div className="card">
        <div className="card__content">
          {typeof errorMessage === "string" && <div className="alert alert--error">{errorMessage}</div>}
          <ChannelsList channels={channels} />
          {channels.length === 0 && (
            <p className="nocontent">
              You are not yet subscribed to any channels. To add one, click the '+' button below.
            </p>
          )}
        </div>
      </div>
      <Outlet />
    </div>
  );
}
