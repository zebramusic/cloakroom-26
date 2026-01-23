const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
envContent.split('\n').forEach(line => {
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

const UserSchema = new mongoose.Schema({
  email: String,
  fullName: String,
  role: String,
  isActive: Boolean,
  password: String,
  createdAt: Date,
  updatedAt: Date,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createOrUpdateUser() {
  try {
    await connectDB();
    console.log('Connected to MongoDB\n');

    const email = 'hriscudragos@yahoo.com';
    const fullName = 'Dragos Hriscu';
    const password = 'admin123'; // Change this password after first login!
    const role = 'admin';

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      console.log('✏️  User already exists, updating...');
      user.role = role;
      user.isActive = true;
      user.updatedAt = new Date();
      await user.save();
      console.log('✅ User updated successfully!');
    } else {
      console.log('➕ Creating new user...');
      const hashedPassword = await bcrypt.hash(password, 10);
      
      user = await User.create({
        email,
        fullName,
        role,
        isActive: true,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('✅ User created successfully!');
    }

    console.log('\n================');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Full Name:', fullName);
    console.log('Role:', role);
    console.log('Is Active:', true);
    console.log('================\n');
    console.log('⚠️  IMPORTANT: Change this password after first login!');
    console.log('Login at: https://cloakroom-26.vercel.app/admin/login\n');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createOrUpdateUser();
