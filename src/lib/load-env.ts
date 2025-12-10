// Load .env file using Node.js built-in support (Node.js 20.6.0+)
// This works as a fallback when --env-file flag is not used
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function loadEnvFile() {
  // Only load if not already loaded via --env-file flag
  // Check if we're in a development environment
  if (process.env.NODE_ENV === "production") {
    return; // In production, assume env vars are set via system/environment
  }

  try {
    const envPath = join(__dirname, "../../.env");
    const envFile = readFileSync(envPath, "utf-8");

    for (const line of envFile.split("\n")) {
      const trimmed = line.trim();
      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      // Parse KEY=VALUE format
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const [, key, value] = match;
        // Only set if not already in process.env (--env-file takes precedence)
        if (key && !process.env[key.trim()]) {
          // Remove quotes if present
          const cleanValue = value.trim().replace(/^["']|["']$/g, "");
          process.env[key.trim()] = cleanValue;
        }
      }
    }
  } catch (error) {
    // .env file doesn't exist or can't be read, that's okay
    // Environment variables might be set via --env-file flag or system env
  }
}
