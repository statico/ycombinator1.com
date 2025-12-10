import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { env } from "./env.js";

const s3 = new S3Client({
  region: env.YC1_AWS_REGION,
  credentials:
    env.YC1_AWS_ACCESS_KEY && env.YC1_AWS_SECRET_KEY
      ? {
          accessKeyId: env.YC1_AWS_ACCESS_KEY,
          secretAccessKey: env.YC1_AWS_SECRET_KEY,
        }
      : undefined,
});

export const setAccessToken = async (teamId: string, accessToken: string) => {
  await s3.send(
    new PutObjectCommand({
      Bucket: env.YC1_AWS_BUCKET_NAME!,
      Key: `/tokens/${teamId}`,
      Body: accessToken,
    }),
  );
};

export const getAccessToken = async (teamId: string) => {
  try {
    const s3res = await s3.send(
      new GetObjectCommand({
        Bucket: env.YC1_AWS_BUCKET_NAME!,
        Key: `/tokens/${teamId}`,
      }),
    );
    if (!s3res.Body) {
      throw new Error(`No body in S3 response for team ${teamId}`);
    }
    return s3res.Body.transformToString();
  } catch (err) {
    throw new Error(`failed to get token for team ${teamId}: ${err}`);
  }
};
