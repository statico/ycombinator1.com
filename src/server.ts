// Load .env file using Node.js built-in support (works with or without --env-file flag)
import { loadEnvFile } from "./lib/load-env.js";
loadEnvFile();

import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rawBody from "fastify-raw-body";
import staticFiles from "@fastify/static";
import { env } from "./lib/env.js";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import indexRoute from "./routes/index.js";
import itemRoute from "./routes/item.js";
import callbackRoute from "./routes/slack/callback.js";
import webhookRoute from "./routes/slack/webhook.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fastify = Fastify({
  logger: {
    level: env.NODE_ENV === "production" ? "info" : "debug",
  },
  bodyLimit: 1048576, // 1MB
  disableRequestLogging: false,
});

// Register plugins
await fastify.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
      imgSrc: ["'self'", "https:", "data:"],
      connectSrc: ["'self'"],
    },
  },
});

await fastify.register(cors, {
  origin: true,
});

await fastify.register(rawBody, {
  field: "rawBody",
  global: false,
  encoding: false,
  runFirst: true,
  routes: ["/api/slack/webhook"],
});

await fastify.register(staticFiles, {
  root: join(__dirname, "../public"),
  prefix: "/",
  wildcard: false, // Don't create catch-all route
});

// Register routes (order matters - more specific routes first)
await fastify.register(indexRoute);
await fastify.register(itemRoute);
await fastify.register(callbackRoute);
await fastify.register(webhookRoute);

// Health check endpoint
fastify.get("/health", async () => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

// 404 handler - redirect all unmatched paths to news.ycombinator.com
fastify.setNotFoundHandler(async (request, reply) => {
  return reply
    .status(302)
    .header("Location", `https://news.ycombinator.com${request.url}`)
    .send();
});

// Error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  const statusCode = (error as { statusCode?: number }).statusCode || 500;
  const message =
    error instanceof Error ? error.message : "Internal Server Error";
  reply.status(statusCode).send({
    error: {
      message,
      statusCode,
    },
  });
});

// Start server
const start = async () => {
  try {
    const port = parseInt(env.PORT, 10);
    const host = env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";

    await fastify.listen({ port, host });
    fastify.log.info(`Server listening on http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
