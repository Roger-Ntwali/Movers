import type { NextFunction, Request, Response } from "express";

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(404, "Not found"));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // Only HttpError carries a message we deliberately wrote to be shown to a
  // client (validation text, "not found", etc). Anything else — a raw DB
  // driver error, an unexpected exception — must never reach the response
  // body verbatim: it can leak schema/query internals. Log it in full
  // server-side instead and return a generic message.
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: "Something went wrong. Please try again." });
}
