import { readFileSync } from "node:fs";

export function loadLocalEnv() {
  try {
    const envText = readFileSync(new URL("../.env", import.meta.url), "utf8");
    for (const line of envText.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const separator = trimmed.indexOf("=");
      if (separator === -1) continue;
      const key = trimmed.slice(0, separator);
      const value = trimmed.slice(separator + 1);
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // Production deployments should provide env vars through the host.
  }
}

loadLocalEnv();
