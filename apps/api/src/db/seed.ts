import bcrypt from "bcryptjs";
import { db } from "./client.js";
import { adminUsers, services, serviceAreas, siteSettings } from "./schema.js";

async function seed() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@moversrwanda.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await db
    .insert(adminUsers)
    .values({ email: adminEmail, passwordHash, name: "Movers Rwanda Admin" })
    .onConflictDoNothing({ target: adminUsers.email });

  await db
    .insert(siteSettings)
    .values([
      { key: "phone", value: "+250787225782" },
      { key: "whatsapp_number", value: "250787225782" },
      { key: "email", value: "excelmoversrw@gmail.com" },
      { key: "address", value: "Kigali, Rwanda" },
      { key: "hours", value: "Mon–Sat | 8:00 AM – 6:00 PM" },
      { key: "facebook_url", value: "" },
      { key: "instagram_url", value: "" },
      { key: "tiktok_url", value: "" },
      { key: "linkedin_url", value: "" },
    ])
    .onConflictDoNothing({ target: siteSettings.key });

  await db
    .insert(services)
    .values([
      {
        title: "Home Moving",
        slug: "home-moving",
        tag: "Service 01",
        lead: "Move your home without the stress.",
        includes: ["Furniture moving", "Household items", "Loading & unloading", "Local relocation"],
        displayOrder: 1,
      },
      {
        title: "Office Relocation",
        slug: "office-relocation",
        tag: "Service 02",
        lead: "Move your business while keeping your work moving.",
        includes: ["Office furniture", "Equipment", "Packing"],
        displayOrder: 2,
      },
      {
        title: "Packing & Unpacking",
        slug: "packing-unpacking",
        tag: "Service 03",
        lead: "Let our team handle the boxes.",
        includes: ["Packing", "Wrapping", "Labeling"],
        displayOrder: 3,
      },
      {
        title: "Furniture Assembly",
        slug: "furniture-assembly",
        tag: "Service 04",
        lead: "Move it. Set it up. Done.",
        includes: ["Disassembly", "Transportation", "Reassembly", "Furniture placement"],
        displayOrder: 4,
      },
      {
        title: "Specialty Moving",
        slug: "specialty-moving",
        tag: "Service 05",
        lead: "For the things that need extra care.",
        includes: ["Large furniture", "Appliances", "Fragile items"],
        displayOrder: 5,
      },
    ])
    .onConflictDoNothing({ target: services.slug });

  await db
    .insert(serviceAreas)
    .values([
      { districtName: "Kigali", latitude: -1.9441, longitude: 30.0619, displayOrder: 1 },
      { districtName: "Gasabo", latitude: -1.9346, longitude: 30.1044, displayOrder: 2 },
      { districtName: "Kicukiro", latitude: -1.9878, longitude: 30.1044, displayOrder: 3 },
      { districtName: "Nyarugenge", latitude: -1.95, longitude: 30.0588, displayOrder: 4 },
      { districtName: "Bugesera", latitude: -2.15, longitude: 30.2833, displayOrder: 5 },
      { districtName: "Musanze", latitude: -1.4995, longitude: 29.6335, displayOrder: 6 },
      { districtName: "Huye", latitude: -2.5975, longitude: 29.7392, displayOrder: 7 },
      { districtName: "Rubavu", latitude: -1.7025, longitude: 29.2564, displayOrder: 8 },
      { districtName: "Muhanga", latitude: -2.0847, longitude: 29.7568, displayOrder: 9 },
      { districtName: "Other Districts", displayOrder: 10 },
    ])
    .onConflictDoNothing();

  console.log(`Seed complete. Admin login: ${adminEmail} / ${adminPassword}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
