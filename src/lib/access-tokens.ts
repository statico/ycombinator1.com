import { S3mini } from "s3mini";
import { env } from "./env.js";

const s3 = new S3mini({
  accessKeyId: env.YC1_AWS_ACCESS_KEY!,
  secretAccessKey: env.YC1_AWS_SECRET_KEY!,
  endpoint: `https://${env.YC1_AWS_BUCKET_NAME}.s3.${env.YC1_AWS_REGION}.amazonaws.com`,
  region: env.YC1_AWS_REGION,
});

export const setAccessToken = async (teamId: string, accessToken: string) => {
  const res = await s3.putObject(`tokens/${teamId}`, accessToken);
  if (!res.ok) {
    throw new Error(
      `S3 PUT failed for team ${teamId}: ${res.status} ${await res.text()}`,
    );
  }
};

export const getAccessToken = async (teamId: string) => {
  const body = await s3.getObject(`tokens/${teamId}`);
  if (!body) {
    throw new Error(`No token found for team ${teamId}`);
  }
  return body;
};
