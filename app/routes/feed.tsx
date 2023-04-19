import { OpenInNew } from "@mui/icons-material";
import { Button, Card, CardActions, CardContent, CardHeader, Link, Stack, Typography } from "@mui/material";
import type { LoaderArgs } from "@remix-run/node";
import { Link as RouterLink, useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import sanitizeHtml from "sanitize-html";
import { authenticator } from "~/services/auth.server";
import database from "~/services/database.server";

dayjs.extend(relativeTime);

export const loader = async ({ request }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request, { failureRedirect: "/login" });

  return database.getFeed(user);
};

function formatHostname(url?: string) {
  if (url === undefined) return undefined;
  try {
    return new URL(url).hostname;
  } catch (err) {
    return undefined;
  }
}

function formatRelative(text?: string) {
  if (text === undefined) return undefined;
  const date = dayjs(text);
  if (!date.isValid()) return undefined;
  return date.from(dayjs());
}

export default function Feed() {
  const items = useLoaderData<typeof loader>();

  return (
    <Stack spacing={4}>
      {items.map((item) => (
        <Card key={item.guid}>
          <CardHeader
            title={item.title}
            subheader={
              <>
                {formatHostname(item.link)} / {formatRelative(item.pubDate) ?? "never"}
              </>
            }
          />
          <CardContent>
            <div
              style={{ overflow: "auto" }}
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(item.description ?? "", {
                  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]).filter((tag) => tag !== "a"),
                }),
              }}
            />
          </CardContent>
          <CardActions>
            <Button component="a" startIcon={<OpenInNew />} href={item.link} target="_blank" rel="noopener noreferrer">
              Visit Website
            </Button>
          </CardActions>
        </Card>
      ))}
      {items.length === 0 && (
        <Typography variant="body2" textAlign="center">
          <em>
            No content here yet. To add a channel, click{" "}
            <Link component={RouterLink} to="/channels/new">
              here
            </Link>
            .
          </em>
        </Typography>
      )}
    </Stack>
  );
}
