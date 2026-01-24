const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Read .env.local for MONGODB_URI
const envPath = path.join(__dirname, "..", ".env.local");
let MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  const uriMatch = envContent.match(/MONGODB_URI=(.+)/);
  if (uriMatch) {
    MONGODB_URI = uriMatch[1].trim();
  }
}

async function checkHomePage() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB\n");

    const SitePage = mongoose.model(
      "SitePage",
      new mongoose.Schema({}, { strict: false, collection: "sitepages" }),
    );
    const homePage = await SitePage.findOne({ key: "home" }).lean();

    if (homePage) {
      console.log("✓ Home page found!");
      console.log("Status:", homePage.status);
      console.log("RO Blocks:", homePage.localeData?.ro?.blocks?.length || 0);
      console.log("EN Blocks:", homePage.localeData?.en?.blocks?.length || 0);

      if (homePage.localeData?.ro?.blocks?.length > 0) {
        console.log("\n=== RO Blocks ===");
        homePage.localeData.ro.blocks.forEach((block, i) => {
          console.log(
            `${i + 1}. Type: ${block.type}, Visibility: ${block.visibility}`,
          );
          if (block.type === "hero") {
            console.log(
              "   Background image:",
              block.data?.backgroundImage || "None",
            );
            console.log("   Headline:", block.data?.headline || "None");
          }
        });
      }
    } else {
      console.log("⚠️  No home page found in database");
      console.log("\nTo create home page, go to:");
      console.log("  https://cloakroom-26.vercel.app/admin/site/pages");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkHomePage();
