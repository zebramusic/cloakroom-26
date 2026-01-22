// Script to add "Industrii" link to navigation
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Load environment variables manually
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

const NavigationItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, enum: ["link", "dropdown"], required: true },
    label: { type: String, required: true },
    href: String,
    visibility: {
      type: String,
      enum: ["public", "logged_in_customer", "hidden"],
      default: "public",
    },
    orderIndex: { type: Number, default: 0 },
    children: [{ type: mongoose.Schema.Types.Mixed }],
  },
  { _id: false },
);

const SiteNavigationSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    localeData: {
      ro: {
        items: [NavigationItemSchema],
      },
      en: {
        items: [NavigationItemSchema],
      },
    },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    version: { type: Number, default: 1 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    publishedAt: Date,
    publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

const SiteNavigation =
  mongoose.models.SiteNavigation ||
  mongoose.model("SiteNavigation", SiteNavigationSchema);

async function addIndustriiLink() {
  try {
    console.log("🔧 Adding Industrii link to navigation...\n");
    console.log(
      "Connecting to MongoDB:",
      MONGODB_URI.replace(/\/\/.*@/, "//<credentials>@"),
    );

    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Find the main navigation using direct MongoDB
    const nav = await mongoose.connection.db
      .collection("sitenavigations")
      .findOne({ key: "main" });

    if (!nav) {
      console.log("❌ Main navigation not found. Run seed-site.js first.");
      process.exit(1);
    }

    console.log("📝 Current navigation:");
    console.log(`   - RO: ${nav.localeData.ro.items.length} items`);
    console.log(`   - EN: ${nav.localeData.en.items.length} items\n`);

    // Check if Industrii already exists
    const hasIndustriiRo = nav.localeData.ro.items.some(
      (item) => item.href === "/industrii",
    );
    const hasIndustriiEn = nav.localeData.en.items.some(
      (item) => item.href === "/en/industrii",
    );

    if (hasIndustriiRo && hasIndustriiEn) {
      console.log("⚠️  Industrii link already exists in navigation.");
      process.exit(0);
    }

    // Add Industrii link after Servicii (orderIndex: 2)
    if (!hasIndustriiRo) {
      nav.localeData.ro.items.push({
        id: "nav-industries-ro",
        type: "link",
        label: "Industrii",
        href: "/industrii",
        visibility: "public",
        orderIndex: 2,
      });
    }

    if (!hasIndustriiEn) {
      nav.localeData.en.items.push({
        id: "nav-industries-en",
        type: "link",
        label: "Industries",
        href: "/en/industrii",
        visibility: "public",
        orderIndex: 2,
      });
    }

    // Reorder items: Servicii=1, Industrii=2, Portofoliu=3, Prețuri=4, etc.
    nav.localeData.ro.items.forEach((item) => {
      if (item.orderIndex >= 2 && item.id !== "nav-industries-ro") {
        item.orderIndex += 1;
      }
    });

    nav.localeData.en.items.forEach((item) => {
      if (item.orderIndex >= 2 && item.id !== "nav-industries-en") {
        item.orderIndex += 1;
      }
    });

    // Sort items by orderIndex
    nav.localeData.ro.items.sort((a, b) => a.orderIndex - b.orderIndex);
    nav.localeData.en.items.sort((a, b) => a.orderIndex - b.orderIndex);

    // Update in database
    await mongoose.connection.db
      .collection("sitenavigations")
      .updateOne(
        { _id: nav._id },
        { $set: { localeData: nav.localeData, updatedAt: new Date() } },
      );

    console.log("✅ Added Industrii link to navigation");
    console.log(`   - RO: ${nav.localeData.ro.items.length} items`);
    console.log(`   - EN: ${nav.localeData.en.items.length} items\n`);

    console.log("📋 Updated navigation order:");
    nav.localeData.ro.items.forEach((item) => {
      console.log(`   ${item.orderIndex}. ${item.label} (${item.href})`);
    });

    console.log("\n🎉 Navigation updated successfully!\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

addIndustriiLink();
