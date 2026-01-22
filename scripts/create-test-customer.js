#!/usr/bin/env node

/**
 * Create Test Customer
 * Creates a test customer account for development
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/cloakroom";

const CustomerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  phone: String,
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: Date,
  addresses: [
    {
      type: { type: String, enum: ["billing", "shipping"], required: true },
      isDefault: { type: Boolean, default: false },
      firstName: String,
      lastName: String,
      company: String,
      address: { type: String, required: true },
      city: { type: String, required: true },
      county: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: "Romania" },
      phone: String,
    },
  ],
  preferences: {
    newsletter: { type: Boolean, default: false },
    orderNotifications: { type: Boolean, default: true },
  },
});

const Customer =
  mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);

async function createTestCustomer() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    const testEmail = "customer@test.com";
    const testPassword = "Test123456";
    const testName = "Test Customer";

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email: testEmail });

    if (existingCustomer) {
      console.log("ℹ️  Test customer already exists");
      console.log(`📧 Email: ${testEmail}`);
      console.log(`🔑 Password: ${testPassword}`);
      console.log(`👤 Name: ${existingCustomer.name}`);
      console.log(`✉️  Verified: ${existingCustomer.emailVerified}`);
      console.log(`✅ Active: ${existingCustomer.isActive}\n`);

      // Update password in case it was changed
      const passwordHash = await bcrypt.hash(testPassword, 12);
      await Customer.updateOne(
        { email: testEmail },
        {
          passwordHash,
          emailVerified: true, // Verify email in development
          isActive: true,
        },
      );
      console.log("✅ Password updated and email verified\n");
    } else {
      // Create new test customer
      const passwordHash = await bcrypt.hash(testPassword, 12);

      const customer = await Customer.create({
        email: testEmail,
        passwordHash,
        name: testName,
        phone: "+40712345678",
        emailVerified: true, // Skip email verification in development
        isActive: true,
        addresses: [
          {
            type: "billing",
            isDefault: true,
            firstName: "Test",
            lastName: "Customer",
            address: "Strada Exemplu 123",
            city: "București",
            county: "București",
            postalCode: "010101",
            country: "Romania",
            phone: "+40712345678",
          },
        ],
        preferences: {
          newsletter: false,
          orderNotifications: true,
        },
      });

      console.log("✅ Test customer created successfully!\n");
      console.log("📧 Email:", testEmail);
      console.log("🔑 Password:", testPassword);
      console.log("👤 Name:", testName);
      console.log("🆔 ID:", customer._id.toString());
      console.log("\n💡 You can now login at /account/login\n");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.code === 11000) {
      console.error("   Duplicate key error - customer already exists");
    }
  } finally {
    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB");
  }
}

createTestCustomer();
