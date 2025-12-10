import { createApp } from "../dist/src/server.js";

type VercelRequest = {
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  query?: Record<string, string>;
  body?: unknown;
};

type VercelResponse = {
  setHeader: (key: string, value: string) => void;
  status: (code: number) => VercelResponse;
  json: (data: unknown) => void;
  send: (data: unknown) => void;
};

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

  const method = req.method || "GET";

  const response = await app.inject({
    method,
    url,
    headers: req.headers || {},
    query: req.query || {},
    body: req.body,
    payload: req.body,
  });

  // Set response headers
  Object.entries(response.headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Set status and send response
  res.status(response.statusCode);

  // Handle different response types
  const contentType = response.headers["content-type"] || "";
  if (contentType.includes("application/json")) {
    try {
      res.json(JSON.parse(response.body));
    } catch {
      res.send(response.body);
    }
  } else {
    res.send(response.body);
  }
}
