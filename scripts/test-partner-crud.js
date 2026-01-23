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
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

// Define Partner Schema
const PartnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    logo: String,
    website: String,
    contactEmail: String,
    contactPhone: String,
    description: String,
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

let Partner;

async function testPartnerCRUD() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✓ Connected to MongoDB\n");

    // Register model
    Partner =
      mongoose.models.Partner || mongoose.model("Partner", PartnerSchema);

    // Test 1: List existing partners
    console.log("📋 TEST 1: List all existing partners");
    console.log("─".repeat(50));
    const existingPartners = await Partner.find({}).lean();
    console.log(`Found ${existingPartners.length} existing partner(s)`);
    if (existingPartners.length > 0) {
      existingPartners.forEach((p, i) => {
        console.log(
          `  ${i + 1}. ${p.name} (${p.slug}) - Active: ${p.isActive}`,
        );
      });
    }
    console.log("✓ List operation successful\n");

    // Test 2: Create new partner
    console.log("📝 TEST 2: Create new partner");
    console.log("─".repeat(50));
    const testPartner = {
      name: "Test Partner Company",
      slug: `test-partner-${Date.now()}`,
      logo: "/uploads/partners/test-logo.png",
      website: "https://testpartner.com",
      contactEmail: "contact@testpartner.com",
      contactPhone: "+40 123 456 789",
      description: "This is a test partner created for CRUD testing",
      isActive: true,
      order: 999,
    };

    let createdPartner;
    try {
      createdPartner = await Partner.create(testPartner);
      console.log(`✓ Created partner: ${createdPartner.name}`);
      console.log(`  ID: ${createdPartner._id}`);
      console.log(`  Slug: ${createdPartner.slug}`);
      console.log(`  Created at: ${createdPartner.createdAt}`);
    } catch (err) {
      console.error("❌ Create failed:", err.message);
      if (err.code === 11000) {
        console.error("   Duplicate key error - slug already exists");
      }
      throw err;
    }
    console.log("✓ Create operation successful\n");

    // Test 3: Read single partner
    console.log("🔍 TEST 3: Read partner by ID");
    console.log("─".repeat(50));
    const foundPartner = await Partner.findById(createdPartner._id).lean();
    if (!foundPartner) {
      throw new Error("Partner not found after creation!");
    }
    console.log(`✓ Found partner: ${foundPartner.name}`);
    console.log(`  Website: ${foundPartner.website || "N/A"}`);
    console.log(`  Email: ${foundPartner.contactEmail || "N/A"}`);
    console.log(`  Description: ${foundPartner.description || "N/A"}`);
    console.log("✓ Read operation successful\n");

    // Test 4: Update partner
    console.log("✏️  TEST 4: Update partner");
    console.log("─".repeat(50));
    const updateData = {
      name: "Updated Test Partner",
      description: "Updated description for testing",
      website: "https://updated-testpartner.com",
      isActive: false,
      order: 100,
    };

    const updatedPartner = await Partner.findByIdAndUpdate(
      createdPartner._id,
      updateData,
      { new: true, runValidators: true },
    ).lean();

    if (!updatedPartner) {
      throw new Error("Partner not found during update!");
    }

    console.log(`✓ Updated partner: ${updatedPartner.name}`);
    console.log(`  New description: ${updatedPartner.description}`);
    console.log(`  New website: ${updatedPartner.website}`);
    console.log(`  Active status: ${updatedPartner.isActive}`);
    console.log(`  Order: ${updatedPartner.order}`);
    console.log("✓ Update operation successful\n");

    // Test 5: Query with filters
    console.log("🔎 TEST 5: Query partners with filters");
    console.log("─".repeat(50));
    const activePartners = await Partner.find({
      isActive: true,
    }).countDocuments();
    const inactivePartners = await Partner.find({
      isActive: false,
    }).countDocuments();
    console.log(`  Active partners: ${activePartners}`);
    console.log(`  Inactive partners: ${inactivePartners}`);
    console.log("✓ Query operation successful\n");

    // Test 6: Delete partner
    console.log("🗑️  TEST 6: Delete partner");
    console.log("─".repeat(50));
    const deletedPartner = await Partner.findByIdAndDelete(createdPartner._id);

    if (!deletedPartner) {
      throw new Error("Partner not found during deletion!");
    }

    console.log(`✓ Deleted partner: ${deletedPartner.name}`);

    // Verify deletion
    const verifyDeleted = await Partner.findById(createdPartner._id);
    if (verifyDeleted) {
      throw new Error("Partner still exists after deletion!");
    }
    console.log("✓ Verified partner was deleted");
    console.log("✓ Delete operation successful\n");

    // Final count
    console.log("📊 FINAL STATUS");
    console.log("─".repeat(50));
    const finalCount = await Partner.countDocuments({});
    console.log(`Total partners in database: ${finalCount}`);

    console.log("\n✅ ALL TESTS PASSED!");
    console.log("─".repeat(50));
    console.log("Partner model CRUD operations are working correctly.");
  } catch (error) {
    console.error("\n❌ TEST FAILED!");
    console.error("─".repeat(50));
    console.error("Error:", error.message);
    if (error.stack) {
      console.error("\nStack trace:");
      console.error(error.stack);
    }
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("\n✓ Connection closed");
    process.exit(0);
  }
}

// Run tests
testPartnerCRUD();
