import { getRequestListener } from "@hono/node-server";
import app from "../src/server.js";

// Disable Vercel's body parsing so the raw body is available for
// HMAC signature verification in the Slack webhook handler.
export const config = {
  api: {
    bodyParser: false,
  },
};

export default getRequestListener(app.fetch);
