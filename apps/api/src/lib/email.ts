import { Resend } from "resend";
import { eq } from "drizzle-orm";
import { env } from "../config/env.js";
import { db } from "../db/client.js";
import { siteSettings } from "../db/schema.js";
import type { leads } from "../db/schema.js";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

// Resend's shared test sender — works without verifying a domain, good
// enough for this volume. Verify moversrwanda.com in Resend later to send
// from an @moversrwanda.com address instead.
const FROM = "Movers Rwanda <onboarding@resend.dev>";

type Lead = typeof leads.$inferSelect;

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

// Fire-and-forget from the caller's perspective: never throws, a missing
// API key or a delivery failure just gets logged, since a customer's quote
// request must still succeed either way.
export async function sendNewLeadEmail(lead: Lead): Promise<void> {
  if (!resend) {
    console.log("RESEND_API_KEY not set — skipping new-lead email notification.");
    return;
  }

  try {
    const [row] = await db.select().from(siteSettings).where(eq(siteSettings.key, "email"));
    const to = row?.value;
    if (!to) {
      console.warn("No 'email' site setting configured — skipping new-lead email notification.");
      return;
    }

    const rows: Array<[string, string]> = [
      ["Name", lead.name],
      ["Phone", lead.phone],
      ["Email", lead.email ?? "—"],
      ["Pick-up", lead.pickup],
      ["Drop-off", lead.dropoff],
      ["Move type", lead.moveType],
      ["Rooms", lead.rooms],
      ["Preferred date", lead.moveDate],
      ["Details", lead.details ?? "—"],
    ];

    const html = `
      <h2 style="font-family:sans-serif;">New quote request</h2>
      <table style="font-family:sans-serif; border-collapse:collapse;">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="padding:4px 12px 4px 0; color:#667085;">${escapeHtml(label)}</td><td style="padding:4px 0; font-weight:600;">${escapeHtml(value)}</td></tr>`,
          )
          .join("")}
      </table>
      <p style="font-family:sans-serif; color:#667085; margin-top:16px;">Reply directly to this lead in the admin dashboard.</p>
    `;

    await resend.emails.send({
      from: FROM,
      to,
      subject: `New quote request from ${lead.name}`,
      html,
    });
  } catch (err) {
    console.error("Failed to send new-lead email notification:", err);
  }
}
