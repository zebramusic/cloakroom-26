const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// Read .env.local manually
const envPath = path.join(__dirname, "..", ".env.local");
const envContent = fs.readFileSync(envPath, "utf8");
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^=:#]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim();
    process.env[key] = value;
  }
});

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

const CustomerSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordHash: String,
  emailVerified: Boolean,
  isActive: Boolean,
  phone: String,
  company: String,
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
});

const Customer =
  mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);

async function fixCustomer() {
  try {
    await connectDB();
    console.log("Connected to MongoDB\n");

    const email = "customer@test.com";
    const password = "Test123456";

    // Delete existing customer
    await Customer.deleteOne({ email });
    console.log("✅ Deleted old customer\n");

    // Create fresh customer with correct password
    const passwordHash = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      email,
      name: "Test Customer",
      passwordHash,
      emailVerified: true, // Skip verification for testing
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("✅ Customer created successfully!\n");
    console.log("================");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Name:", customer.name);
    console.log("Email Verified:", customer.emailVerified);
    console.log("Is Active:", customer.isActive);
    console.log("================\n");
    console.log("Login at: https://cloakroom-26.vercel.app/account/login\n");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

fixCustomer();
