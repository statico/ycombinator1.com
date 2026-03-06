import { createApp } from "../src/server.js";
import type { HTTPMethods, InjectOptions } from "fastify";
import type { IncomingMessage } from "http";

type VercelRequest = IncomingMessage & {
  url?: string;
  method?: string;
  headers: Record<string, string>;
  query?: Record<string, string>;
  body?: unknown;
};

type VercelResponse = {
  setHeader: (key: string, value: string) => void;
  status: (code: number) => VercelResponse;
  json: (data: unknown) => void;
  send: (data: unknown) => void;
};

// Disable Vercel's body parsing so we can forward the raw body to Fastify.
// This preserves the exact bytes for HMAC signature verification.
export const config = {
  api: {
    bodyParser: false,
  },
};

function getRawBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

let app: Awaited<ReturnType<typeof createApp>> | null = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!app) {
    app = await createApp();
  }

  await app.ready();

  // Use Fastify's inject method for serverless environments
  // Build URL with query string if present
  let url = req.url || "/";
  if (req.query && Object.keys(req.query).length > 0) {
    const queryString = new URLSearchParams(req.query).toString();
    url = url.includes("?") ? `${url}&${queryString}` : `${url}?${queryString}`;
  }

  const method = (req.method || "GET") as HTTPMethods;

  // Remove content-length since it may not match after proxy processing.
  const headers = { ...(req.headers || {}) };
  delete headers["content-length"];

  // Read the raw body to preserve exact bytes for signature verification.
  const rawBody = await getRawBody(req);

  const injectOptions = {
    method: method,
    url,
    headers,
    query: req.query || {},
    ...(rawBody.length > 0 && { payload: rawBody }),
  } as InjectOptions;

  const response = await app.inject(injectOptions);

  // Set response headers
  if (response.headers) {
    Object.entries(response.headers).forEach(([key, value]) => {
      if (value !== undefined) {
        res.setHeader(key, String(value));
      }
    });
  }

  // Set status and send response
  res.status(response.statusCode);

  // Handle different response types
  const contentType = response.headers?.["content-type"] || "";
  if (typeof contentType === "string" && contentType.includes("application/json")) {
    try {
      const body = typeof response.body === "string" ? response.body : JSON.stringify(response.body);
      res.json(JSON.parse(body));
    } catch {
      res.send(response.body);
    }
  } else {
    res.send(response.body);
  }
}
