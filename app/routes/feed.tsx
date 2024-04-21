import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import sanitizeHtml from "sanitize-html";
import { authenticator } from "~/services/auth.server";
import database from "~/services/database.server";
import stylesheet from "~/styles/feed.css";
import { ExternalLinkIcon } from "~/svgs";

dayjs.extend(relativeTime);

export const links: LinksFunction = () => [{ rel: "stylesheet", href: stylesheet }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, { failureRedirect: "/login" });

  return database.getFeed(user);
};

function formatHostname(url?: string) {
  if (url === undefined) return undefined;
  try {
    return new URL(url).hostname;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

function parseDate(text: string) {
  const date = dayjs(text);
  return date.isValid() ? date : null;
}

function RelativeTime(props: { text: string | null }) {
  const { text } = props;
  const date = text !== null ? parseDate(text) : null;
  const reltime = date !== null ? date.from(dayjs()) : "never";
  return <time dateTime={date?.toISOString()}>{reltime}</time>;
}

export default function Feed() {
  const items = useLoaderData<typeof loader>();

  return (
    <div className="feed">
      {items.map((item) => (
        <article key={item.guid} className="card">
          <h2 className="card__title">{item.title}</h2>
          <div role="doc-subtitle">
            {formatHostname(item.link ?? undefined)} / <RelativeTime text={item.pubDate ?? null} />
          </div>
          <div
            className="card__content card__content--overflow"
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(item.description ?? "", {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]).filter((tag) => tag !== "a"),
              }),
            }}
          />
          <div className="card__actions">
            <a
              className="button button--text button--icon"
              href={item.link ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLinkIcon aria-label="[External]" />
              Visit Website
            </a>
          </div>
        </article>
      ))}
      {items.length === 0 && (
        <p className="nocontent">
          No content here yet. To add a channel, click{" "}
          <Link className="link" to="/channels/new">
            here
          </Link>
          .
        </p>
      )}
    </div>
  );
}
