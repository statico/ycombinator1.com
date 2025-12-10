import { FastifyPluginAsync } from "fastify";
import { setAccessToken } from "../../lib/access-tokens.js";
import { env } from "../../lib/env.js";

const callbackRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Querystring: { code?: string } }>(
    "/api/slack/callback",
    async (request, reply) => {
      const { code } = request.query;

      if (!code) {
        return reply.status(400).send("Missing code parameter");
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
        team_id?: string;
        access_token?: string;
        error?: string;
      };

      if (obj.ok && obj.team_id && obj.access_token) {
        // Store the access code for later.
        await setAccessToken(obj.team_id, obj.access_token);
        return reply.status(302).header("Location", "/?installed=1").send();
      } else {
        // Encourage users to tell me about errors if they see one here.
        return reply.status(500).send(`
          There was an error during install. Please report a bug at
          https://github.com/statico/ycombinator1.com/issues
          with this information: ${JSON.stringify(obj)}
        `);
      }
    },
  );
};

export default callbackRoute;
