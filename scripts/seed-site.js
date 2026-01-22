// Seed script for Site Builder - Initial navigation and home page content
const mongoose = require("mongoose");

// Load environment variables manually from .env.local if exists
const fs = require("fs");
const path = require("path");
const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, "");
      process.env[key] = value;
    }
  });
}

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/cloakroom";

// Define schemas (simplified versions)
const SiteNavigationSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    localeData: {
      ro: {
        items: [
          {
            id: String,
            type: { type: String, enum: ["link", "dropdown"] },
            label: String,
            href: String,
            visibility: {
              type: String,
              enum: ["public", "logged_in_customer", "hidden"],
            },
            orderIndex: Number,
          },
        ],
      },
      en: {
        items: [
          {
            id: String,
            type: { type: String, enum: ["link", "dropdown"] },
            label: String,
            href: String,
            visibility: {
              type: String,
              enum: ["public", "logged_in_customer", "hidden"],
            },
            orderIndex: Number,
          },
        ],
      },
    },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    version: { type: Number, default: 1 },
    createdBy: String,
    publishedAt: Date,
    publishedBy: String,
  },
  { timestamps: true },
);

const SiteNavigation =
  mongoose.models.SiteNavigation ||
  mongoose.model("SiteNavigation", SiteNavigationSchema);

async function seed() {
  try {
    console.log("🌱 Seeding Site Builder data...\n");
    console.log(
      "Connecting to MongoDB:",
      MONGODB_URI.replace(/\/\/.*@/, "//<credentials>@"),
    );

    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Check if navigation already exists
    const existingNav = await SiteNavigation.findOne({ key: "main" });
    if (existingNav) {
      console.log("⚠️  Navigation already exists. Skipping seed.");
      console.log(
        "   To re-seed, delete existing navigation in MongoDB first.\n",
      );
      process.exit(0);
    }

    // Seed main navigation
    const mainNavigation = await SiteNavigation.create({
      key: "main",
      localeData: {
        ro: {
          items: [
            {
              id: "nav-home-ro",
              type: "link",
              label: "Acasă",
              href: "/",
              visibility: "public",
              orderIndex: 0,
            },
            {
              id: "nav-services-ro",
              type: "link",
              label: "Servicii",
              href: "/servicii",
              visibility: "public",
              orderIndex: 1,
            },
            {
              id: "nav-portfolio-ro",
              type: "link",
              label: "Portofoliu",
              href: "/portofoliu",
              visibility: "public",
              orderIndex: 2,
            },
            {
              id: "nav-pricing-ro",
              type: "link",
              label: "Prețuri",
              href: "/preturi",
              visibility: "public",
              orderIndex: 3,
            },
            {
              id: "nav-shop-ro",
              type: "link",
              label: "Shop",
              href: "/shop",
              visibility: "public",
              orderIndex: 4,
            },
            {
              id: "nav-about-ro",
              type: "link",
              label: "Despre",
              href: "/despre",
              visibility: "public",
              orderIndex: 5,
            },
            {
              id: "nav-contact-ro",
              type: "link",
              label: "Contact",
              href: "/contact",
              visibility: "public",
              orderIndex: 6,
            },
          ],
        },
        en: {
          items: [
            {
              id: "nav-home-en",
              type: "link",
              label: "Home",
              href: "/en",
              visibility: "public",
              orderIndex: 0,
            },
            {
              id: "nav-services-en",
              type: "link",
              label: "Services",
              href: "/en/servicii",
              visibility: "public",
              orderIndex: 1,
            },
            {
              id: "nav-portfolio-en",
              type: "link",
              label: "Portfolio",
              href: "/en/portofoliu",
              visibility: "public",
              orderIndex: 2,
            },
            {
              id: "nav-pricing-en",
              type: "link",
              label: "Pricing",
              href: "/en/preturi",
              visibility: "public",
              orderIndex: 3,
            },
            {
              id: "nav-shop-en",
              type: "link",
              label: "Shop",
              href: "/en/shop",
              visibility: "public",
              orderIndex: 4,
            },
            {
              id: "nav-about-en",
              type: "link",
              label: "About",
              href: "/en/despre",
              visibility: "public",
              orderIndex: 5,
            },
            {
              id: "nav-contact-en",
              type: "link",
              label: "Contact",
              href: "/en/contact",
              visibility: "public",
              orderIndex: 6,
            },
          ],
        },
      },
      status: "published",
      version: 1,
      createdBy: "seed-script",
      publishedAt: new Date(),
      publishedBy: "seed-script",
    });

    console.log("✅ Created main navigation (published)");
    console.log(`   - RO: ${mainNavigation.localeData.ro.items.length} items`);
    console.log(
      `   - EN: ${mainNavigation.localeData.en.items.length} items\n`,
    );

    console.log("🎉 Site Builder seeding complete!\n");
    console.log("Next steps:");
    console.log("1. Visit http://localhost:3000/admin/site");
    console.log("2. Edit navigation items");
    console.log("3. Create new draft and publish changes\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seed();
