import { Delete, OpenInNew } from "@mui/icons-material";
import {
  Alert,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Outlet, useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { BreadcrumbLink } from "~/components";
import { authenticator } from "~/services/auth.server";
import database from "~/services/database.server";

export const handle = {
  title: () => "Channels",
  breadcrumb: () => <BreadcrumbLink to="/channels">Channels</BreadcrumbLink>,
};

export const loader = async ({ request }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request, { failureRedirect: "/login" });
  return database.listChannels(user);
};

export const action = async ({ request }: ActionArgs) => {
  const user = await authenticator.isAuthenticated(request, { failureRedirect: "/login" });

  const formData = await request.formData();
  const id = formData.get("id");
  invariant(typeof id === "string", "id must be a string");

  try {
    await database.deleteChannel(user, parseInt(id, 10));
  } catch (err) {
    return "Failed to delete channel";
  }
  return redirect("/channels");
};

function ChannelsCard() {
  const channels = useLoaderData<typeof loader>();
  const errorMessage = useActionData<typeof action>();

  return (
    <Card>
      <CardContent>
        {typeof errorMessage === "string" && <Alert severity="error">{errorMessage}</Alert>}
        <List>
          {channels.map((channel) => (
            <ListItem key={channel.id}>
              <ListItemText primary={channel.title} secondary={channel.description} sx={{ pr: 6 }} />
              <ListItemSecondaryAction>
                <Tooltip title="Visit Website">
                  <IconButton
                    color="primary"
                    component="a"
                    href={channel.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <OpenInNew />
                  </IconButton>
                </Tooltip>
                <Form method="post" style={{ display: "contents" }}>
                  <input name="id" defaultValue={channel.id} hidden />
                  <Tooltip title="Delete Channel">
                    <IconButton type="submit" color="primary">
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Form>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          {channels.length === 0 && (
            <Typography variant="body2" textAlign="center">
              <em>You are not yet subscribed to any channels. To add one, click the '+' button below.</em>
            </Typography>
          )}
        </List>
      </CardContent>
    </Card>
  );
}

export default function Channels() {
  return (
    <Stack spacing={2} padding={2}>
      <ChannelsCard />
      <Outlet />
    </Stack>
  );
}
