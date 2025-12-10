import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("3000"),
  SLACK_CLIENT_ID: z.string().optional(),
  SLACK_CLIENT_SECRET: z.string().optional(),
  SLACK_SIGNING_SECRET: z.string().optional(),
  YC1_AWS_REGION: z.string().optional(),
  YC1_AWS_ACCESS_KEY: z.string().optional(),
  YC1_AWS_SECRET_KEY: z.string().optional(),
  YC1_AWS_BUCKET_NAME: z.string().optional(),
});

export const env = envSchema.parse(process.env);
