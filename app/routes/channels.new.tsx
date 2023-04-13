import { Alert, Button, Card, CardActions, CardContent, CardHeader, TextField, TextFieldProps } from "@mui/material";

import { ActionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import { authenticator } from "~/services/auth.server";
import database from "~/services/database.server";

export const action = async ({ request }: ActionArgs): Promise<{ url?: string | null; message?: string }> => {
  const user = await authenticator.isAuthenticated(request, { failureRedirect: "/login" });

  const formData = await request.formData();
  const url = formData.get("url");

  const errors = {
    url: url ? null : "URL is required",
  };
  if (Object.values(errors).some((message) => message)) {
    return json(errors);
  }

  invariant(typeof url === "string", "url must be a string");

  let channel;
  try {
    channel = await database.createChannel(user, url);
  } catch (err) {
    return { message: "Failed to add channel" };
  }
  if (channel === null) {
    return { message: "A channel with this URL already exists" };
  }
  return redirect("/channels");
};

function CustomTextField(props: Omit<TextFieldProps, "label"> & { label?: string }) {
  const { label, ...rest } = props;

  const [overrideLabel, setOverrideLabel] = useState<string | undefined>(undefined);
  const [overridePlaceholder, setOverridePlaceholder] = useState(label);

  useEffect(() => {
    setOverrideLabel(label);
    setOverridePlaceholder(undefined);
  }, [label]);

  return <TextField {...rest} label={overrideLabel} placeholder={overridePlaceholder} />;
}

export default function New() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const errors = useActionData<typeof action>();

  return (
    <Form method="post">
      <Card>
        <CardHeader title="New Channel" />
        <CardContent>
          <CustomTextField
            name="url"
            label="URL"
            size="small"
            fullWidth
            error={Boolean(errors?.url)}
            helperText={errors?.url}
          />
          {Boolean(errors?.message) && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {errors?.message}
            </Alert>
          )}
        </CardContent>
        <CardActions>
          <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
            Submit
          </Button>
          <Button component={Link} to="/channels" sx={{ ml: 1 }}>
            Cancel
          </Button>
        </CardActions>
      </Card>
    </Form>
  );
}
