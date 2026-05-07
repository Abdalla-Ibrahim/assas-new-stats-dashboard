import { createRequire } from "node:module";
import type { NextFunction, Request, Response } from "express";

const require = createRequire(import.meta.url);
const jwt = require("jsonwebtoken") as typeof import("jsonwebtoken");

export type AuthenticatedRequest = Request & {
  admin?: {
    id: string;
    email: string;
    name: string;
  };
};

function getJwtSecret() {
  const secret = process.env["JWT_SECRET"];
  if (!secret) {
    throw new Error("JWT_SECRET must be set before using admin routes.");
  }
  return secret;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.header("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() : null;

  if (!token) {
    return res.status(401).json({ error: "Missing bearer token." });
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());

    if (typeof payload !== "object" || payload === null || !("sub" in payload)) {
      return res.status(401).json({ error: "Invalid token payload." });
    }

    req.admin = {
      id: String(payload.sub),
      email: String(payload.email ?? ""),
      name: String(payload.name ?? ""),
    };

    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}
