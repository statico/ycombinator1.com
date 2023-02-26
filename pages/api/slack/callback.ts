import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextApiRequest, NextApiResponse } from "next";

const s3 = new S3Client({
  region: process.env.YC1_AWS_REGION,
  credentials: {
    accessKeyId: process.env.YC1_AWS_ACCESS_KEY,
    secretAccessKey: process.env.YC1_AWS_SECRET_KEY,
  },
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const clientId = process.env.SLACK_CLIENT_ID;
  const clientSecret = process.env.SLACK_CLIENT_SECRET;
  if (!clientId || !clientSecret)
    throw new Error("Slack OAuth client ID and secret must be specified");

  const res2 = await fetch("https://slack.com/api/oauth.v2.access", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code: String(req.query.code),
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  const obj = await res2.json();

  if (obj.ok) {
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.YC1_AWS_BUCKET_NAME,
        Key: `/tokens/${obj.team.id}`,
        Body: obj.access_token,
      })
    );
    res.setHeader("Location", "/?installed=1").status(302).end();
  } else {
    res.status(500).send(`
      There was an error during install. Please report a bug at
      https://github.com/statico/ycombinator1.com/issues
      with this information: ${JSON.stringify(obj)}
    `);
  }
};
