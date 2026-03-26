import type { IncomingMessage, ServerResponse } from "http";
import app from "../src/server.js";

// Disable Vercel's body parsing so the raw body is available for
// HMAC signature verification in the Slack webhook handler.
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

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const url = new URL(
    req.url || "/",
    `http://${req.headers.host || "localhost"}`,
  );
  const method = req.method || "GET";

  const headers = new Headers();
  for (let i = 0; i < req.rawHeaders.length; i += 2) {
    headers.append(req.rawHeaders[i], req.rawHeaders[i + 1]);
  }

  const body =
    method !== "GET" && method !== "HEAD"
      ? await getRawBody(req)
      : undefined;

  const request = new Request(url.href, { method, headers, body });
  const response = await app.fetch(request);

  const outHeaders: Record<string, string | string[]> = {};
  response.headers.forEach((value, key) => {
    const existing = outHeaders[key];
    if (existing) {
      outHeaders[key] = Array.isArray(existing)
        ? [...existing, value]
        : [existing, value];
    } else {
      outHeaders[key] = value;
    }
  });
  res.writeHead(response.status, outHeaders);

  if (response.body) {
    const reader = response.body.getReader();
    let chunk = await reader.read();
    while (!chunk.done) {
      res.write(chunk.value);
      chunk = await reader.read();
    }
  }
  res.end();
}
