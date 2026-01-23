const mongoose = require('mongoose');
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

async function checkUser() {
  try {
    await connectDB();
    console.log('Connected to MongoDB\n');

    const email = 'hriscudragos@yahoo.com';
    const user = await User.findOne({ email }).lean();

    if (!user) {
      console.log(`❌ User ${email} NOT FOUND in database`);
      return;
    }

    console.log('✅ User found:');
    console.log('================');
    console.log('Email:', user.email);
    console.log('Full Name:', user.fullName);
    console.log('Role:', user.role);
    console.log('Is Active:', user.isActive);
    console.log('Has Password:', !!user.password);
    console.log('Created At:', user.createdAt);
    console.log('Updated At:', user.updatedAt);
    console.log('================\n');

    // Check what permissions this role has
    console.log('Expected permissions for role "' + user.role + '":');
    
    const rolePermissions = {
      admin: 'ALL PERMISSIONS (full access)',
      manager: 'quotes, orders, products, categories, partners (read/write)',
      support: 'quotes, orders (read/write), products (read only)',
      editor: 'products, categories, blog, faq (read/write)',
      customer: 'No admin access'
    };

    console.log(rolePermissions[user.role] || 'Unknown role - no permissions');

    if (user.role !== 'admin') {
      console.log('\n⚠️  WARNING: User role is "' + user.role + '", not "admin"');
      console.log('To grant full admin access, run:');
      console.log(`node scripts/update-user-role.js ${email} admin`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkUser();
