const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

async function createAdmin() {
  try {
    const mongodbUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/cloakroom";

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongodbUri);
    console.log("Connected!\n");

    const UserSchema = new mongoose.Schema({
      email: String,
      password: String,
      fullName: String,
      role: String,
      isActive: Boolean,
      emailVerified: Date,
      createdAt: Date,
      updatedAt: Date,
    });

    const User = mongoose.models.User || mongoose.model("User", UserSchema);

    const email = await question("Email: ");
    const password = await question("Password: ");
    const fullName = await question("Full Name: ");
    const role =
      (await question("Role (admin/manager/support/editor): ")) || "admin";

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("\n❌ User with this email already exists");
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      fullName,
      role,
      isActive: true,
      emailVerified: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("\n✅ User created successfully!");
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`\nYou can now login at http://localhost:3000/admin/login\n`);

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
}

createAdmin();
