import { Router } from "express";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { siteSettingSchema } from "@movers-rwanda/shared";
import { db } from "../db/client.js";
import { siteSettings } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";

export const settingsRouter = Router();

settingsRouter.get("/", async (_req, res, next) => {
  try {
    const rows = await db.select().from(siteSettings);
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    res.json(map);
  } catch (err) {
    next(err);
  }
});

const bulkUpdateSchema = z.object({ settings: z.array(siteSettingSchema) });

settingsRouter.put("/", requireAuth, validateBody(bulkUpdateSchema), async (req, res, next) => {
  try {
    for (const { key, value } of req.body.settings) {
      await db
        .insert(siteSettings)
        .values({ key, value })
        .onConflictDoUpdate({ target: siteSettings.key, set: { value: sql`excluded.value` } });
    }
    const rows = await db.select().from(siteSettings);
    res.json(Object.fromEntries(rows.map((r) => [r.key, r.value])));
  } catch (err) {
    next(err);
  }
});
