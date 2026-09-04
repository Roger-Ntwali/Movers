import { Router } from "express";
import { eq } from "drizzle-orm";
import { createLeadSchema, updateLeadSchema } from "@movers-rwanda/shared";
import { db } from "../db/client.js";
import { leads } from "../db/schema.js";
import { attachAuthIfPresent, requireAuth } from "../middleware/auth.js";
import { leadsRateLimiter } from "../middleware/rateLimiter.js";
import { validateBody } from "../middleware/validate.js";
import { HttpError } from "../middleware/errorHandler.js";

export const leadsRouter = Router();

// Public quote form AND admin "+ Add Lead" share this route — an
// authenticated admin skips the rate limit (meant to deter bot spam, not
// throttle someone manually logging leads) and gets the full created row
// back instead of the minimal public response.
leadsRouter.post(
  "/",
  attachAuthIfPresent,
  (req, res, next) => (req.admin ? next() : leadsRateLimiter(req, res, next)),
  validateBody(createLeadSchema),
  async (req, res, next) => {
    try {
      const { company, ...data } = req.body as typeof req.body & { company?: string };
      if (company) {
        // Honeypot tripped — silently pretend success so bots don't learn.
        return res.status(201).json({ ok: true });
      }
      const [created] = await db.insert(leads).values(data).returning();
      res.status(201).json(req.admin ? created : { ok: true, id: created.id });
    } catch (err) {
      next(err);
    }
  },
);

// Admin: list leads.
leadsRouter.get("/", requireAuth, async (_req, res, next) => {
  try {
    const rows = await db.query.leads.findMany({ orderBy: (t, { desc }) => desc(t.createdAt) });
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Admin: lead detail.
leadsRouter.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const row = await db.query.leads.findFirst({ where: eq(leads.id, req.params.id) });
    if (!row) throw new HttpError(404, "Lead not found");
    res.json(row);
  } catch (err) {
    next(err);
  }
});

// Admin: update status/notes/any lead field.
leadsRouter.patch("/:id", requireAuth, validateBody(updateLeadSchema), async (req, res, next) => {
  try {
    const [updated] = await db
      .update(leads)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(leads.id, req.params.id))
      .returning();
    if (!updated) throw new HttpError(404, "Lead not found");
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Admin: delete a lead.
leadsRouter.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const [deleted] = await db.delete(leads).where(eq(leads.id, req.params.id)).returning({ id: leads.id });
    if (!deleted) throw new HttpError(404, "Lead not found");
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
