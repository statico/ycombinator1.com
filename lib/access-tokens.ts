import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.YC1_AWS_REGION,
  credentials: {
    accessKeyId: process.env.YC1_AWS_ACCESS_KEY,
    secretAccessKey: process.env.YC1_AWS_SECRET_KEY,
  },
});

export const setAccessToken = async (teamId: string, accessToken: string) => {
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.YC1_AWS_BUCKET_NAME,
      Key: `/tokens/${teamId}`,
      Body: accessToken,
    })
  );
};

export const getAccessToken = async (teamId: string) => {
  try {
    const s3res = await s3.send(
      new GetObjectCommand({
        Bucket: process.env.YC1_AWS_BUCKET_NAME,
        Key: `/tokens/${teamId}`,
      })
    );
    return s3res.Body.transformToString();
  } catch (err) {
    throw new Error(`failed to get token for team ${teamId}: ${err}`);
  }
};
