import type { Context } from "hono";
import { setAccessToken } from "../../lib/access-tokens.js";
import { env } from "../../lib/env.js";

export const callbackRoute = async (c: Context) => {
  const code = c.req.query("code");

  if (!code) {
    return c.text("Missing code parameter", 400);
  }

  const clientId = env.SLACK_CLIENT_ID;
  const clientSecret = env.SLACK_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Slack OAuth client ID and secret must be specified");
  }

  // Trade the OAuth callback code for an access token, which also finalizes
  // the app installation process.
  const res = await fetch("https://slack.com/api/oauth.v2.access", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  const obj = (await res.json()) as {
    ok: boolean;
    team?: { id: string };
    access_token?: string;
    error?: string;
  };

  const teamId = obj.team?.id;
  if (obj.ok && teamId && obj.access_token) {
    // Store the access code for later.
    await setAccessToken(teamId, obj.access_token);
    return c.redirect("/?installed=1", 302);
  } else {
    // Encourage users to tell me about errors if they see one here.
    return c.text(
      `There was an error during install. Please report a bug at
https://github.com/statico/ycombinator1.com/issues
with this information: ${JSON.stringify(obj)}`,
      500,
    );
  }
};
