import { FastifyPluginAsync } from "fastify";
import { createHmac } from "crypto";
import { getHNLinkInfo } from "../../lib/hacker-news.js";
import { getAccessToken } from "../../lib/access-tokens.js";
import { env } from "../../lib/env.js";

interface SlackWebhookBody {
  type: string;
  challenge?: string;
  event?: {
    type: string;
    links?: Array<{ url: string }>;
    source?: string;
    unfurl_id?: string;
  };
  team_id?: string;
}

const webhookRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post("/api/slack/webhook", async (request, reply) => {
    // Get raw body for signature verification
    const rawBody = (request as any).rawBody as Buffer;
    const bodyString = rawBody.toString("utf-8");

    // Check the signature per https://api.slack.com/authentication/verifying-requests-from-slack
    const signingSecret = env.SLACK_SIGNING_SECRET;
    if (env.NODE_ENV === "production" && !signingSecret) {
      throw new Error("SLACK_SIGNING_SECRET is required in production");
    }

    if (signingSecret) {
      const timestamp = request.headers["x-slack-request-timestamp"] as string;
      const hmac = createHmac("sha256", signingSecret);
      hmac.update(["v0", timestamp, bodyString].join(":"));
      const sig = "v0=" + hmac.digest("hex");
      const receivedSig = request.headers["x-slack-signature"] as string;

      if (sig !== receivedSig) {
        throw new Error("Invalid signature");
      }
      fastify.log.info("signature ok");
    }

    const body: SlackWebhookBody = JSON.parse(bodyString);

    // Handle Events verification handshake: https://api.slack.com/apis/connections/events-api#handshake
    if (body.type === "url_verification") {
      return reply.send(body.challenge);
    }

    // Ignore all events other than things we need to unfurl.
    if (body.type !== "event_callback" || body.event?.type !== "link_shared") {
      return reply.send("ok");
    }

    const unfurls: Record<string, any> = {};

    for (const link of body.event.links || []) {
      try {
        const url = new URL(link.url);
        if (url.host !== "news.ycombinator.com") {
          // This should never happen, but just in case...
          fastify.log.info(`ignoring host ${url.host}`);
          continue;
        }

        const id = url.searchParams.get("id");
        if (!id || !/^\d+$/.test(id)) {
          fastify.log.info(`ignoring invalid id ${id}`);
          continue;
        }

        fastify.log.info(`getting info for HN item ${id}`);
        const { title, snippet } = await getHNLinkInfo(id, 250);

        // This is kinda the best I could do using https://app.slack.com/block-kit-builder
        unfurls[link.url] = {
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `<${link.url}|*${title}*>\n\n${snippet}`,
              },
              accessory: {
                type: "image",
                image_url: "https://news.ycombinator1.com/favicon.png",
                alt_text: "Hacker News Logo",
              },
            },
          ],
        };
      } catch (err) {
        fastify.log.error(`could not get info for URL ${link.url}: ${err}`);
      }
    }

    // Post the unfurl: https://api.slack.com/methods/chat.unfurl/test
    if (body.team_id) {
      const token = await getAccessToken(body.team_id);
      const url = new URL("https://slack.com/api/chat.unfurl");
      url.searchParams.set("source", body.event.source || "");
      url.searchParams.set("unfurl_id", body.event.unfurl_id || "");
      url.searchParams.set("unfurls", JSON.stringify(unfurls));

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const responseText = await res.text();
      fastify.log.info({ msg: "response from slack", response: responseText });
    }

    // Don't try to be smart and send OK early, otherwise response
    // handlers do strange and mysterious things.
    return reply.send("ok");
  });
};

export default webhookRoute;
