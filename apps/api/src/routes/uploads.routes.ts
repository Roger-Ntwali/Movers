import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { HttpError } from "../middleware/errorHandler.js";
import { cloudinaryConfigured, createSignedUpload } from "../lib/cloudinary.js";

export const uploadsRouter = Router();

const signSchema = z.object({
  folder: z.enum(["gallery", "services", "blog", "site"]),
});

uploadsRouter.post("/sign", requireAuth, validateBody(signSchema), (req, res, next) => {
  try {
    if (!cloudinaryConfigured) {
      throw new HttpError(503, "Image uploads are not configured on this server");
    }
    const payload = createSignedUpload(`movers-rwanda/${req.body.folder}`);
    res.json(payload);
  } catch (err) {
    next(err);
  }
});
