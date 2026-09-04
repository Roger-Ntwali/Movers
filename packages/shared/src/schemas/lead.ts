import { z } from "zod";

export const MOVE_TYPES = [
  "Home Moving",
  "Office Moving",
  "Packing & Unpacking",
  "Furniture Moving",
  "Specialty Item",
  "Other",
] as const;

export const ROOM_OPTIONS = [
  "Studio / 1 Room",
  "2 Rooms",
  "3 Rooms",
  "4+ Rooms",
  "Office / Other",
] as const;

export const LEAD_STATUSES = ["new", "contacted", "quoted", "won", "lost"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

// Submitted by the public quote form. `company` is a honeypot field: it must
// stay empty for real visitors (hidden via CSS) and is rejected server-side
// when filled in, since only bots fill hidden fields.
export const createLeadSchema = z.object({
  pickup: z.string().trim().min(2, "Pick-up location is required").max(200),
  dropoff: z.string().trim().min(2, "Drop-off location is required").max(200),
  moveType: z.enum(MOVE_TYPES, { errorMap: () => ({ message: "Please select a move type" }) }),
  moveDate: z.string().min(1, "Preferred move date is required"),
  rooms: z.enum(ROOM_OPTIONS, { errorMap: () => ({ message: "Please select number of rooms" }) }),
  name: z.string().trim().min(2, "Name is required").max(120),
  phone: z
    .string()
    .trim()
    .min(7, "Phone number is required")
    .max(20)
    .regex(/^[+\d][\d\s-]{5,19}$/, "Enter a valid phone number"),
  email: z.union([z.literal(""), z.string().trim().email()]).optional(),
  details: z.string().trim().max(1000, "Keep it under 1000 characters").optional(),
  company: z.string().max(0, "Spam detected").optional().default(""),
});
export type CreateLeadInput = z.infer<typeof createLeadSchema>;

// Admin edits: every business field from createLeadSchema, all optional
// (partial update), plus the two admin-only fields. Reuses the same
// per-field validation as the public form instead of redefining it.
export const updateLeadSchema = createLeadSchema
  .omit({ company: true })
  .partial()
  .extend({
    status: z.enum(LEAD_STATUSES).optional(),
    notes: z.string().max(4000).optional(),
  });
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
