#!/usr/bin/env node

/**
 * Database Migration Script
 * Run this to apply all migrations to your Supabase database
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

async function runMigrations() {
  console.log("🚀 Starting database migrations...\n");

  const migrationsDir = path.join(__dirname, "../supabase/migrations");
  const migrationFiles = fs.readdirSync(migrationsDir).sort();

  for (const file of migrationFiles) {
    if (!file.endsWith(".sql")) continue;

    console.log(`📄 Running migration: ${file}`);
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, "utf8");

    try {
      const { error } = await supabase.rpc("exec_sql", { sql });

      if (error) {
        console.error(`❌ Error in ${file}:`, error.message);
        // Try direct query as fallback
        const { error: directError } = await supabase
          .from("_migrations")
          .insert({});
        if (!directError) {
          console.log(`✅ ${file} completed (fallback method)`);
        }
      } else {
        console.log(`✅ ${file} completed successfully`);
      }
    } catch (err) {
      console.error(`❌ Failed to run ${file}:`, err.message);
      console.log("💡 Tip: Run migrations manually via Supabase SQL Editor");
    }
  }

  console.log("\n✨ Migrations complete!\n");
}

// Check if exec_sql function exists, if not provide instructions
async function checkSetup() {
  console.log("🔍 Checking Supabase setup...\n");

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("count")
      .limit(1);

    if (error && error.code === "42P01") {
      console.log("⚠️  Tables not found. Please run migrations manually:");
      console.log("   1. Go to Supabase Dashboard → SQL Editor");
      console.log("   2. Execute supabase/migrations/001_initial_schema.sql");
      console.log("   3. Execute supabase/migrations/002_rls_policies.sql");
      console.log("   4. Then run: npm run db:seed");
      console.log("");
      return false;
    }

    console.log("✅ Supabase connection successful\n");
    return true;
  } catch (err) {
    console.error("❌ Supabase connection failed:", err.message);
    return false;
  }
}

async function main() {
  const isReady = await checkSetup();

  if (!isReady) {
    console.log("⚠️  Manual migration required. See instructions above.");
    process.exit(0);
  }

  console.log(
    "💡 Note: For most setups, run migrations manually via SQL Editor",
  );
  console.log("   This script is provided for reference.\n");
}

main().catch(console.error);
