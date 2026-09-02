import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { HttpError } from "./errorHandler.js";

export const AUTH_COOKIE_NAME = "mr_admin_token";

export interface AuthTokenPayload {
  sub: string;
  email: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: AuthTokenPayload;
    }
  }
}

export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "12h" });
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[AUTH_COOKIE_NAME];
  if (!token) return next(new HttpError(401, "Not authenticated"));
  try {
    req.admin = jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
    next();
  } catch {
    next(new HttpError(401, "Invalid or expired session"));
  }
}

// Verifies the auth cookie when present but never rejects the request —
// used on public list routes so `?all=1` can be honored for logged-in
// admins while anonymous visitors silently fall back to the public view.
export function attachAuthIfPresent(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[AUTH_COOKIE_NAME];
  if (token) {
    try {
      req.admin = jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
    } catch {
      // ignore invalid/expired token — request proceeds unauthenticated
    }
  }
  next();
}
