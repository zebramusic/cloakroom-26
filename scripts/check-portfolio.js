const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Read .env.local manually
const envPath = path.join(__dirname, "../.env.local");
const envContent = fs.readFileSync(envPath, "utf8");
const lines = envContent.split("\n");
let mongoUri = null;

for (const line of lines) {
  if (line.startsWith("MONGODB_URI=")) {
    mongoUri = line.substring("MONGODB_URI=".length).trim();
    // Remove quotes if present
    if (mongoUri.startsWith('"') && mongoUri.endsWith('"')) {
      mongoUri = mongoUri.slice(1, -1);
    }
    if (mongoUri.startsWith("'") && mongoUri.endsWith("'")) {
      mongoUri = mongoUri.slice(1, -1);
    }
    break;
  }
}

if (!mongoUri) {
  console.error("MONGODB_URI not found in .env.local");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(async () => {
    console.log("✓ Connected to MongoDB");

    const PortfolioItem = mongoose.model(
      "PortfolioItem",
      new mongoose.Schema({}, { strict: false }),
      "portfolioitems",
    );

    const count = await PortfolioItem.countDocuments({});
    console.log(`\nTotal portfolio items: ${count}`);

    if (count > 0) {
      const items = await PortfolioItem.find({}).lean();
      items.forEach((item, i) => {
        console.log(`\n--- Item ${i + 1} ---`);
        console.log(`ID: ${item._id}`);
        console.log(`Slug: ${item.slug}`);
        console.log(`Title (RO): ${item.localeContent?.ro?.title || "N/A"}`);
        console.log(`Title (EN): ${item.localeContent?.en?.title || "N/A"}`);
        console.log(`Published: ${item.isPublished}`);
        console.log(`Featured: ${item.isFeatured || false}`);
        console.log(`Created: ${item.createdAt}`);
      });
    } else {
      console.log("\n⚠️  No portfolio items found in database");
    }

    await mongoose.connection.close();
    console.log("\n✓ Connection closed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });
