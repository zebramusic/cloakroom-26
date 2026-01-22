# Customer Portal Implementation - Phase 1 Complete ✅

## Overview

This is the **first phase** of the Customer Portal implementation for Garderobă Pro. The system allows B2B customers to register, manage orders, and communicate with admin support.

## Architecture

### Dual Authentication System

We use **NextAuth v5 with a single instance** but dual authentication realms:
- **Admin realm**: Existing users in `User` collection (admin, manager, support, editor)
- **Customer realm**: New customers in `Customer` collection

The discriminator is `principalType: 'admin' | 'customer'` in the JWT token.

### Database Collections (MongoDB)

#### 1. Customer Collection
```typescript
{
  email: string (unique, indexed)
  passwordHash: string
  emailVerified: boolean
  emailVerificationToken?: string
  emailVerificationExpires?: Date
  passwordResetToken?: string
  passwordResetExpires?: Date
  name: string
  companyName?: string
  phone?: string
  cui?: string
  regCom?: string
  hasVAT: boolean
  billingAddress?: Address
  shippingAddresses: Address[]
  localePreference: 'ro' | 'en'
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}
```

#### 2. ConversationThread Collection (NOT YET IMPLEMENTED)
```typescript
{
  type: 'order_support' | 'general_support'
  customerId: ObjectId (indexed)
  orderId?: ObjectId (indexed)
  status: 'open' | 'closed' (indexed)
  subject: string
  lastMessageAt: Date (indexed)
  unreadByCustomer: number
  unreadByAdmin: number
  assignedTo?: ObjectId (admin user)
  createdAt: Date
  updatedAt: Date
}
```

#### 3. Message Collection (NOT YET IMPLEMENTED)
```typescript
{
  threadId: ObjectId (indexed)
  senderType: 'customer' | 'admin'
  senderId: ObjectId
  body: string (sanitized)
  attachments?: [{
    filename: string
    path: string
    mimeType: string
    size: number
  }]
  readAt?: Date
  createdAt: Date
  updatedAt: Date
}
```

## Implemented Features (Phase 1)

### ✅ Authentication System

#### Files Created:
- `/src/lib/models-customer.ts` - Mongoose schemas for Customer, ConversationThread, Message
- `/src/lib/auth/customer-auth.ts` - Password hashing, validation, token generation, sanitization
- `/src/lib/email/index.ts` - Generic email sending function
- `/src/auth.ts` - **UPDATED** with dual CredentialsProvider (admin + customer)
- `/src/types/next-auth.d.ts` - **UPDATED** to include `principalType`
- `/src/middleware.ts` - **UPDATED** to protect `/account/*` routes for customers

#### API Endpoints:
1. **POST /api/auth/customer/signup**
   - Registers new customer
   - Validates email, password (8+ chars, uppercase, lowercase, number)
   - Sends verification email
   - Rate limited: 3 signups per hour per IP

2. **GET /api/auth/customer/verify-email?token=xxx**
   - Verifies email address
   - Token valid for 24 hours
   - Marks customer as `emailVerified: true`

3. **POST /api/auth/customer/forgot-password**
   - Sends password reset email
   - Token valid for 1 hour
   - Rate limited: 3 requests per 15 minutes per IP
   - Always returns success (security best practice)

4. **POST /api/auth/customer/reset-password**
   - Resets password with valid token
   - Validates new password strength
   - Clears reset token after use

#### UI Pages:
1. **[/account/login](http://localhost:3000/account/login)**
   - Customer login form
   - Uses `customer-credentials` provider with `principalType: 'customer'`
   - Redirects to `/account` after successful login

2. **[/account/signup](http://localhost:3000/account/signup)**
   - Customer registration form
   - Fields: name, email, company (optional), phone (optional), password, confirmPassword
   - Shows success message with email verification instructions

3. **[/account/verify-email](http://localhost:3000/account/verify-email?token=xxx)**
   - Email verification page
   - Shows loading → success/error states
   - Redirects to login after verification

4. **[/account/forgot-password](http://localhost:3000/account/forgot-password)**
   - Password reset request form
   - Always shows success message (security)

5. **[/account/reset-password](http://localhost:3000/account/reset-password?token=xxx)**
   - Password reset form with new password + confirm password
   - Validates password strength
   - Redirects to login after success

6. **[/account](http://localhost:3000/account)** (Protected)
   - Customer dashboard with navigation
   - Links to Orders, Messages, Profile
   - Quick actions: Browse Products, Request Quote

7. **[/account/layout.tsx](http://localhost:3000/account)**
   - Protected layout that verifies `principalType === 'customer'`
   - Shows navigation bar with logout button
   - Redirects to `/account/login` if not authenticated

#### Admin Login Updated:
- **[/admin/login](http://localhost:3000/admin/login)** - **UPDATED**
  - Now uses `admin-credentials` provider with `principalType: 'admin'`
  - Separated from customer login flow

## Security Features

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Hashed with bcrypt (12 rounds)

### Rate Limiting (In-Memory)
⚠️ **Production Note**: Replace with Redis-based rate limiting for multi-instance deployments

- **Signup**: 3 attempts per hour per IP
- **Password Reset**: 3 requests per 15 minutes per IP

### Email Verification
- Customers **MUST** verify email before logging in
- Verification token: 32 bytes crypto random, valid 24 hours
- Tokens are single-use (cleared after verification)

### Password Reset
- Reset token: 32 bytes crypto random, valid 1 hour
- Single-use tokens (cleared after password reset)
- Always returns success message (prevents email enumeration)

### XSS Prevention
- `sanitizeMessageBody()` function strips HTML tags (for future messaging)
- 5000 character limit on message bodies

### Route Protection
- `/account/*` routes require `principalType === 'customer'`
- `/admin/*` routes require `principalType === 'admin'`
- Middleware checks JWT token for principal type
- Cross-realm access is prevented

## Testing

### Manual Testing Steps

#### 1. Test Customer Signup Flow
```bash
# 1. Visit signup page
open http://localhost:3000/account/signup

# 2. Fill form:
Name: Test Customer
Email: test@example.com
Company: Acme Corp (optional)
Phone: +40 712 345 678 (optional)
Password: TestPass123
Confirm Password: TestPass123

# 3. Click "Create Account"
# 4. Check email for verification link
# 5. Click verification link → should see "Email Verified!"
# 6. Click "Go to Login"
```

#### 2. Test Customer Login Flow
```bash
# 1. Visit login page
open http://localhost:3000/account/login

# 2. Try login WITHOUT verification → should see error
# 3. Verify email first (step 1.5)
# 4. Login with email + password
# 5. Should redirect to /account dashboard
```

#### 3. Test Password Reset Flow
```bash
# 1. Visit forgot password
open http://localhost:3000/account/forgot-password

# 2. Enter email → should see "Check Your Email"
# 3. Click link in email
# 4. Enter new password (must meet requirements)
# 5. Should see "Password Reset!" → click "Go to Login"
# 6. Login with new password
```

#### 4. Test Dual Authentication (Admin vs Customer)
```bash
# Admin login should NOT work on customer portal
open http://localhost:3000/admin/login
# Login with admin credentials → should redirect to /admin

open http://localhost:3000/account/login
# Login with customer credentials → should redirect to /account

# Cross-realm access should be blocked by middleware
```

### API Testing with cURL

```bash
# 1. Create customer account
curl -X POST http://localhost:3000/api/auth/customer/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "name": "Test Customer",
    "companyName": "Acme Corp",
    "phone": "+40 712 345 678"
  }'

# Expected: 201 Created with message about email verification

# 2. Verify email (get token from MongoDB or email)
curl "http://localhost:3000/api/auth/customer/verify-email?token=YOUR_TOKEN"

# Expected: 200 OK with { verified: true }

# 3. Request password reset
curl -X POST http://localhost:3000/api/auth/customer/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Expected: 200 OK (always, even if email doesn't exist)

# 4. Reset password (get token from MongoDB or email)
curl -X POST http://localhost:3000/api/auth/customer/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_RESET_TOKEN",
    "password": "NewPass123"
  }'

# Expected: 200 OK with success message
```

## Environment Variables Required

Add to `.env.local`:

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017/cloakroom
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cloakroom

# NextAuth
NEXTAUTH_SECRET=your-secret-here  # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@garderoba-pro.ro
EMAIL_ADMIN=admin@garderoba-pro.ro
```

## Known Issues & Limitations

### 1. Rate Limiting (In-Memory)
**Issue**: Rate limiting uses `Map<string, number>` in memory
**Impact**: Won't work in multi-instance deployments, resets on server restart
**Solution**: Implement Redis-based rate limiting for production

### 2. Email Verification Required
**Impact**: Customers cannot login until email is verified
**Note**: This is intentional for security, but may need bypass for development

### 3. No Resend Verification Email
**Issue**: If user loses verification email, no way to resend
**Solution**: Add `/api/auth/customer/resend-verification` endpoint (Phase 2)

### 4. No Session Timeout
**Issue**: JWT tokens don't expire (NextAuth default)
**Solution**: Configure `session.maxAge` in NextAuth config

### 5. Admin Errors Still Present
**Issue**: `/admin` and `/admin/orders` pages have "Functions cannot be passed to Client Components" errors
**Note**: These are pre-existing issues, not related to Customer Portal implementation

## Next Steps (Phase 2 - PENDING)

### Priority 1: Customer Orders Viewing
- [ ] API: GET `/api/customer/orders` - List customer's orders
- [ ] API: GET `/api/customer/orders/[id]` - View order details
- [ ] Page: `/account/orders/page.tsx` - Orders list with filters
- [ ] Page: `/account/orders/[id]/page.tsx` - Order detail view
- [ ] Component: `OrderCard.tsx` - Display order summary
- [ ] Component: `OrderStatusBadge.tsx` - Show order status with colors

### Priority 2: Order Claiming System
- [ ] API: POST `/api/customer/orders/claim` - Claim unclaimed order by order number
- [ ] Modify `Order` model: Add `customerId` field (nullable, indexed)
- [ ] UI: Add "Claim Order" button on order detail page
- [ ] Validation: Only allow claiming if order has no `customerId`

### Priority 3: Messaging System (Customer-Admin Communication)
- [ ] API: GET `/api/customer/threads` - List conversation threads
- [ ] API: GET `/api/customer/threads/[id]/messages` - Get messages in thread
- [ ] API: POST `/api/customer/threads` - Create new thread
- [ ] API: POST `/api/customer/threads/[id]/messages` - Send message
- [ ] API: POST `/api/customer/threads/[id]/messages/upload` - Upload attachment
- [ ] Page: `/account/messages/page.tsx` - Threads list
- [ ] Page: `/account/messages/[threadId]/page.tsx` - Thread detail with messages
- [ ] Component: `MessageThread.tsx` - Display thread conversation
- [ ] Component: `MessageInput.tsx` - Send message with file upload
- [ ] Component: `FileUploadZone.tsx` - Drag-drop file upload with validation

### Priority 4: Admin Support Module
- [ ] Page: `/admin/support/page.tsx` - View all customer threads
- [ ] Page: `/admin/support/[threadId]/page.tsx` - Respond to customer
- [ ] API: GET `/api/admin/support/threads` - List threads (with filters)
- [ ] API: PATCH `/api/admin/support/threads/[id]` - Assign thread, change status
- [ ] Notifications: Email admin when new thread created
- [ ] Notifications: Email customer when admin responds

### Priority 5: Customer Profile Management
- [ ] API: GET `/api/customer/profile` - Get customer details
- [ ] API: PATCH `/api/customer/profile` - Update profile (name, company, phone, CUI, etc.)
- [ ] API: POST `/api/customer/profile/addresses` - Add shipping address
- [ ] API: PATCH `/api/customer/profile/addresses/[id]` - Edit address
- [ ] API: DELETE `/api/customer/profile/addresses/[id]` - Delete address
- [ ] Page: `/account/profile/page.tsx` - Edit profile form
- [ ] Component: `AddressForm.tsx` - Manage multiple addresses

## File Structure

```
src/
├── app/
│   ├── account/                          # Customer portal pages
│   │   ├── layout.tsx                   # ✅ Protected layout with nav
│   │   ├── page.tsx                     # ✅ Customer dashboard
│   │   ├── login/page.tsx               # ✅ Customer login
│   │   ├── signup/page.tsx              # ✅ Customer registration
│   │   ├── verify-email/page.tsx        # ✅ Email verification
│   │   ├── forgot-password/page.tsx     # ✅ Request password reset
│   │   ├── reset-password/page.tsx      # ✅ Reset password form
│   │   ├── orders/                       # ⏳ PENDING (Phase 2)
│   │   │   ├── page.tsx                 # Orders list
│   │   │   └── [id]/page.tsx            # Order detail
│   │   ├── messages/                     # ⏳ PENDING (Phase 3)
│   │   │   ├── page.tsx                 # Threads list
│   │   │   └── [threadId]/page.tsx      # Thread conversation
│   │   └── profile/                      # ⏳ PENDING (Phase 5)
│   │       └── page.tsx                 # Edit profile
│   ├── api/
│   │   └── auth/
│   │       └── customer/
│   │           ├── signup/route.ts      # ✅ Customer registration
│   │           ├── verify-email/route.ts # ✅ Email verification
│   │           ├── forgot-password/route.ts # ✅ Request reset
│   │           └── reset-password/route.ts # ✅ Reset password
├── auth.ts                               # ✅ UPDATED: Dual providers
├── middleware.ts                         # ✅ UPDATED: Protect /account/*
├── lib/
│   ├── models-customer.ts               # ✅ Customer, Thread, Message schemas
│   ├── auth/
│   │   └── customer-auth.ts             # ✅ Password utils, validation
│   └── email/
│       └── index.ts                     # ✅ Generic sendEmail function
└── types/
    └── next-auth.d.ts                   # ✅ UPDATED: principalType
```

## Database Indexes

**Already created** via Mongoose schemas:

```javascript
// Customer collection
{ email: 1 } - unique
{ createdAt: -1 }

// ConversationThread collection (Phase 3)
{ customerId: 1 }
{ orderId: 1 }
{ status: 1 }
{ lastMessageAt: -1 }

// Message collection (Phase 3)
{ threadId: 1, createdAt: -1 }
{ senderType: 1, senderId: 1 }
```

## Deployment Checklist (Before Production)

- [ ] Replace in-memory rate limiting with Redis
- [ ] Configure NextAuth `session.maxAge` (e.g., 7 days)
- [ ] Set up MongoDB Atlas production database
- [ ] Configure SMTP server (e.g., SendGrid, AWS SES)
- [ ] Add email templates with proper branding
- [ ] Enable HTTPS (required for NextAuth)
- [ ] Set `NEXTAUTH_URL` to production URL
- [ ] Add monitoring for failed login attempts
- [ ] Implement account lockout after N failed attempts
- [ ] Add CAPTCHA to signup form (prevent spam)
- [ ] Test email delivery with real domain
- [ ] Add Terms of Service + Privacy Policy links
- [ ] Implement soft delete for customers (GDPR)
- [ ] Add customer account deletion endpoint
- [ ] Set up backup strategy for customer data

## Documentation

- **Full Implementation Guide**: [CUSTOMER_PORTAL_IMPLEMENTATION_GUIDE.md](./CUSTOMER_PORTAL_IMPLEMENTATION_GUIDE.md)
- **Main README**: [README.md](./README.md)
- **Auth System**: [docs/AUTH_SYSTEM.md](./docs/AUTH_SYSTEM.md)
- **Design System**: [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)

## Support

For questions or issues with the Customer Portal implementation, contact the development team or refer to the comprehensive implementation guide.
