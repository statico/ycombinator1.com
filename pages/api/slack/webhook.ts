import { createHmac } from "crypto";
import { getHNLinkInfo } from "lib/hn";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Read the body in as a string
  const rawBody = await new Promise<string>((resolve) => {
    let buffer = "";
    req.on("data", (chunk) => {
      buffer += chunk;
    });
    req.on("end", () => {
      resolve(buffer);
    });
  });

  // Check the signature per https://api.slack.com/authentication/verifying-requests-from-slack
  const signingSecret = process.env.SLACK_SIGNING_SECRET;
  if (process.env.NODE_ENV === "production" && !signingSecret) {
    throw new Error("SLACK_SIGNING_SECRET is required in production");
  }
  if (signingSecret) {
    const hmac = createHmac("sha256", signingSecret);
    hmac.update(
      ["v0", req.headers["x-slack-request-timestamp"], rawBody].join(":")
    );
    const sig = "v0=" + hmac.digest("hex");
    if (sig !== req.headers["x-slack-signature"])
      throw new Error("Invalid signature");
    console.log("signature ok");
  }

  const body = JSON.parse(rawBody);

  if (body.type === "url_verification") {
    res.send(body.challenge);
    return;
  }

  if (body.type !== "event_callback" || body.event?.type !== "link_shared") {
    res.send("ok");
    return;
  }

  const unfurls: any = {};
  for (const link of body.event.links) {
    try {
      const url = new URL(link.url);
      const id = url.searchParams.get("id");
      console.log("getting info for item", id);
      const { title, snippet } = await getHNLinkInfo(id, 250);
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
      console.error("could not get info for URL", link.url, err);
    }
  }

  // https://api.slack.com/methods/chat.unfurl/test
  const token = process.env.SLACK_TOKEN;
  const url = new URL("https://slack.com/api/chat.unfurl");
  url.searchParams.set("source", body.event.source);
  url.searchParams.set("unfurl_id", body.event.unfurl_id);
  url.searchParams.set("unfurls", JSON.stringify(unfurls));
  const res2 = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("response from slack:", await res2.text());

  // Don't try to be smart and send OK early, otherwise Vercel's response
  // handlers do strange and mysterious things.
  res.send("ok");
};
