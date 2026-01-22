// Script to add product categories
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

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    image: String,
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);

async function addCategories() {
  try {
    console.log("📦 Adding product categories...\n");
    console.log(
      "Connecting to MongoDB:",
      MONGODB_URI.replace(/\/\/.*@/, "//<credentials>@"),
    );

    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Check if categories already exist
    const existingCount = await Category.countDocuments();
    if (existingCount > 0) {
      console.log(
        `⚠️  Found ${existingCount} existing categories. Skipping seed.`,
      );
      console.log(
        "   To re-seed, delete existing categories in MongoDB first.\n",
      );
      process.exit(0);
    }

    // Define categories
    const categories = [
      {
        name: "Echipamente Garderobă",
        slug: "echipamente-garderoba",
        description:
          "Stanzi, numere, umerașe și alte echipamente pentru garderobe profesionale",
        order: 0,
        isActive: true,
      },
      {
        name: "Stanzi & Numere",
        slug: "stanzi-numere",
        description: "Stanzi și numere pentru identificarea hainelor",
        order: 1,
        isActive: true,
      },
      {
        name: "Umerașe",
        slug: "umerase",
        description: "Umerașe profesionale pentru garderobă",
        order: 2,
        isActive: true,
      },
      {
        name: "Rafturi & Dulapuri",
        slug: "rafturi-dulapuri",
        description: "Soluții de stocare pentru haine și accesorii",
        order: 3,
        isActive: true,
      },
      {
        name: "Accesorii",
        slug: "accesorii",
        description: "Accesorii diverse pentru garderobă",
        order: 4,
        isActive: true,
      },
      {
        name: "Sisteme Complete",
        slug: "sisteme-complete",
        description:
          "Pachete complete de echipamente pentru evenimente de diferite dimensiuni",
        order: 5,
        isActive: true,
      },
    ];

    // Insert categories
    const result = await Category.insertMany(categories);

    console.log(`✅ Created ${result.length} categories:`);
    result.forEach((cat) => {
      console.log(`   - ${cat.name} (${cat.slug})`);
    });

    console.log("\n🎉 Categories seeding complete!\n");
    console.log("Next steps:");
    console.log("1. Visit http://localhost:3000/admin/products/new");
    console.log("2. Select a category when creating products");
    console.log(
      "3. Or add more categories by editing this script and running again\n",
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

addCategories();
