import { App, cors, secureHeaders, logger, serve, serveStatic } from "@statico/zerodep-node-http-server";
import { env } from "./lib/env.js";

import { indexRoute } from "./routes/index.js";
import { itemRoute } from "./routes/item.js";
import { callbackRoute } from "./routes/slack/callback.js";
import { webhookRoute } from "./routes/slack/webhook.js";

const app = new App();

// Middleware
app.use("*", logger());
app.use("*", cors());
app.use(
  "*",
  secureHeaders({
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "https:", "data:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      connectSrc: ["'self'"],
    },
  }),
);

// Routes
app.get("/", indexRoute);
app.get("/item", itemRoute);
app.get("/api/slack/callback", callbackRoute);
app.post("/api/slack/webhook", webhookRoute);

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler - redirect all unmatched paths to news.ycombinator.com
app.notFound((c) => {
  const reqUrl = new URL(c.req.url);
  return c.redirect(
    `https://news.ycombinator.com${reqUrl.pathname}${reqUrl.search}`,
    302,
  );
});

// Error handler
app.onError((err, c) => {
  console.error(err);
  const statusCode = (err as any).status || 500;
  const message =
    err instanceof Error ? err.message : "Internal Server Error";
  return c.json({ error: { message, statusCode } }, statusCode);
});

export default app;

// Start server (only when running standalone, not in serverless mode)
const isMainModule =
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1]?.endsWith("server.js") ||
  process.argv[1]?.endsWith("server.ts");

if (isMainModule && !process.env.VERCEL) {
  // Static files only needed in dev - Vercel serves public/ automatically
  app.use("/*", serveStatic({ root: "./public" }));

  const port = parseInt(env.PORT, 10);
  const host = "0.0.0.0";

  console.log(`Server listening on http://${host}:${port}`);
  serve({ fetch: app.fetch, port, hostname: host });
}
