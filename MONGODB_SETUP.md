# MongoDB Setup Guide

The project now uses **MongoDB** with **Mongoose** for database operations and **NextAuth.js** for authentication.

## Prerequisites

1. **Install MongoDB locally** OR use **MongoDB Atlas** (cloud)

### Option 1: Local MongoDB

```bash
# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Linux
sudo apt-get install mongodb
sudo systemctl start mongodb

# Windows
# Download from https://www.mongodb.com/try/download/community
```

### Option 2: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Get your connection string

## Environment Setup

Create `.env.local` file:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/cloakroom
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cloakroom?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@cloakroom.ro
EMAIL_ADMIN=office@cloakroom.ro
```

### Generate NextAuth Secret

```bash
openssl rand -base64 32
```

## Create First Admin User

Run this script to create your first admin user:

```bash
node scripts/create-admin.js
```

Or use MongoDB Compass/mongo shell:

```javascript
use cloakroom

db.users.insertOne({
  email: "admin@cloakroom.ro",
  password: "$2a$10$..." // Use bcrypt to hash your password
  fullName: "Admin User",
  role: "admin",
  isActive: true,
  emailVerified: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## Database Models

The following Mongoose models are available:

### User
- email, password (bcrypt hashed)
- fullName, role (admin, manager, support, editor, customer)
- phone, avatarUrl
- isActive, emailVerified
- resetToken, resetTokenExpiry

### Quote
- quoteNumber, eventType, eventDate
- estimatedAttendees, location, services
- clientName, clientEmail, clientPhone
- status, totalPrice, notes

### Partner
- name, slug, logo
- website, contactEmail, contactPhone
- isActive, order

### Product
- name, slug, description
- category, basePrice, images
- variants (SKU, price, stock)
- isActive, isFeatured

### Order
- orderNumber, userId
- customerName, customerEmail, customerPhone
- shippingAddress, billingAddress
- items (products, quantities, prices)
- subtotal, shippingCost, tax, total
- status, paymentStatus, trackingNumber

### Category
- name, slug, description
- parentId, order, isActive

## Using MongoDB in Your Code

### Connect to Database

```typescript
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models';

async function myFunction() {
  await connectDB();
  const users = await User.find();
  return users;
}
```

### API Route Example

```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models';

export async function GET() {
  try {
    await connectDB();
    const users = await User.find().select('-password');
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
```

## Authentication

The app uses **NextAuth.js v5** with credentials provider.

### Protected Routes

Middleware automatically protects `/admin/*` routes.

### Using Auth in Components

```typescript
'use client';
import { useAuth } from '@/hooks/useAuth';

export function MyComponent() {
  const { user, role, isAuthenticated, loading, signOut } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;
  
  return <div>Welcome, {user?.name} ({role})</div>;
}
```

### Using Auth in Server Components

```typescript
import { auth } from '@/auth';

export default async function Page() {
  const session = await auth();
  
  if (!session) {
    redirect('/admin/login');
  }
  
  return <div>Welcome, {session.user.name}</div>;
}
```

## MongoDB Compass

Use MongoDB Compass (GUI) to view and manage your database:

1. Download from [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your connection string
3. Browse collections, run queries, create indexes

## Common Commands

```bash
# Start MongoDB (local)
brew services start mongodb-community

# Stop MongoDB
brew services stop mongodb-community

# Connect with mongo shell
mongosh

# Import data
mongoimport --db cloakroom --collection products --file products.json --jsonArray

# Export data
mongoexport --db cloakroom --collection products --out products.json --jsonArray

# Backup database
mongodump --db cloakroom --out ./backup

# Restore database
mongorestore --db cloakroom ./backup/cloakroom
```

## Migration from Supabase

All Supabase code has been removed. Key changes:

1. **Database**: PostgreSQL → MongoDB
2. **Auth**: Supabase Auth → NextAuth.js
3. **Client**: `createClient()` → `connectDB()` + Mongoose
4. **Hooks**: Updated `useAuth` to use NextAuth's `useSession`
5. **Middleware**: Updated to use NextAuth's `auth()`

## Permissions System

The RBAC permission system works the same:

- **Admin**: Full access
- **Manager**: Orders, quotes, products, partners
- **Support**: View/edit orders and quotes
- **Editor**: Content management
- **Customer**: Limited public access

## Next Steps

1. Set up MongoDB (local or Atlas)
2. Configure `.env.local`
3. Run `npm run dev`
4. Create admin user
5. Login at http://localhost:3000/admin/login

## Troubleshooting

### Connection Errors

- Check MongoDB is running: `brew services list`
- Verify connection string in `.env.local`
- For Atlas: Check IP whitelist and credentials

### Auth Errors

- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies and try again

### Model Errors

- Ensure `connectDB()` is called before using models
- Check Mongoose schema definitions match your data
- Use `.lean()` for better performance on read operations
