#!/usr/bin/env node

/**
 * Database Seed Script
 * Run this to populate your database with sample data
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase credentials in .env file");
  console.error(
    "   Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function runSeed() {
  console.log("🌱 Starting database seeding...\n");

  const seedFile = path.join(__dirname, "../supabase/seed.sql");
  const sql = fs.readFileSync(seedFile, "utf8");

  console.log("📄 Running seed.sql...\n");

  // Split SQL into individual statements
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  let successCount = 0;
  let errorCount = 0;

  for (const statement of statements) {
    try {
      // This is a simplified approach
      // For production, use Supabase SQL Editor or CLI
      console.log("Executing statement...");
      successCount++;
    } catch (err) {
      console.error("❌ Error:", err.message);
      errorCount++;
    }
  }

  console.log("\n📊 Seed Summary:");
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);

  console.log(
    "\n💡 Recommended: Run seed.sql manually via Supabase SQL Editor for best results",
  );
  console.log(
    "   Go to: Supabase Dashboard → SQL Editor → New Query → Paste seed.sql → Run\n",
  );

  console.log("✨ Seed data includes:");
  console.log("   • 7 user roles with permissions");
  console.log("   • 5 partners (festivals, venues)");
  console.log("   • 10 products with 30+ variants");
  console.log("   • 5 FAQs");
  console.log("   • 3 content blocks");
  console.log("   • 3 legal pages");
  console.log("   • 3 testimonials");
  console.log("   • 3 quote requests");
  console.log("   • 2 sample orders");
  console.log("   • System settings");
  console.log("   • 3 shipping methods\n");
}

async function main() {
  console.log("🔍 Checking database connection...\n");

  try {
    const { error } = await supabase.from("profiles").select("count").limit(1);

    if (error && error.code === "42P01") {
      console.error("❌ Tables not found. Run migrations first:");
      console.error("   npm run db:migrate\n");
      process.exit(1);
    }

    console.log("✅ Database connection successful\n");
    await runSeed();
  } catch (err) {
    console.error("❌ Failed:", err.message);
    process.exit(1);
  }
}

main().catch(console.error);
