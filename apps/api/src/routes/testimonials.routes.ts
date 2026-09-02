import { Router } from "express";
import { eq } from "drizzle-orm";
import { testimonialSchema } from "@movers-rwanda/shared";
import { db } from "../db/client.js";
import { testimonials } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { HttpError } from "../middleware/errorHandler.js";

export const testimonialsRouter = Router();

testimonialsRouter.get("/", async (_req, res, next) => {
  try {
    const rows = await db.query.testimonials.findMany({
      orderBy: (t, { asc }) => asc(t.displayOrder),
    });
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

testimonialsRouter.post("/", requireAuth, validateBody(testimonialSchema), async (req, res, next) => {
  try {
    const [created] = await db.insert(testimonials).values(req.body).returning();
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

testimonialsRouter.patch(
  "/:id",
  requireAuth,
  validateBody(testimonialSchema.partial()),
  async (req, res, next) => {
    try {
      const [updated] = await db
        .update(testimonials)
        .set(req.body)
        .where(eq(testimonials.id, req.params.id))
        .returning();
      if (!updated) throw new HttpError(404, "Testimonial not found");
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },
);

testimonialsRouter.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const [deleted] = await db
      .delete(testimonials)
      .where(eq(testimonials.id, req.params.id))
      .returning();
    if (!deleted) throw new HttpError(404, "Testimonial not found");
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
