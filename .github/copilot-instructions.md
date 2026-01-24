# Cloakroom Pro - AI Coding Agent Instructions

## Project Overview

Bilingual (RO/EN) Next.js 14 event cloakroom management platform with B2B e-commerce, **MongoDB-only database with Mongoose ODM**, Stripe integration, and comprehensive RBAC admin panel. Built with TypeScript, next-intl, Zustand, and shadcn/ui components.

## Architecture & Critical Patterns

### Database Strategy (MongoDB Only - NO Supabase)

- **MongoDB with Mongoose** for ALL data: auth (NextAuth), users, quotes, orders, products, partners, blog, FAQs, categories
- Connection singleton in `src/lib/mongodb.ts` prevents connection pooling issues during hot reload
- **CRITICAL: Always use `await connectDB()` before any MongoDB operation** in API routes or server components
- All models defined in `src/lib/models.ts` with proper TypeScript interfaces extending `Document`
- File uploads stored in local filesystem at `public/uploads/` (no cloud storage)

### MongoDB Models Reference

```typescript
// Available models in src/lib/models.ts:
- User (email, password, fullName, role, isActive)
- Quote (quoteNumber, eventType, startDate, status, clientName, services flags)
- Partner (name, slug, logo, website, description, isActive, order)
- Product (name, slug, category, basePrice, variants[], stock, images[])
- Order (orderNumber, userId, items[], subtotal, tax, total, status, paymentStatus)
- Category (name, slug, description, parentId, order, isActive)
- BlogPost (title, slug, content, author, status, publishedAt)
- FAQ (question, answer, category, locale, order, isActive)
```

### Authentication & Authorization

- NextAuth 5 beta with JWT strategy - config in `src/auth.ts`
- Credentials provider with bcrypt password hashing
- RBAC system: 5 roles (admin, manager, support, editor, customer) with granular permissions
- Permission checks via `src/lib/auth/permissions.ts` - use `hasPermission(role, permission)` for checks
- Protected routes in `src/middleware.ts` - handles both i18n routing AND auth/role-based access
- Admin routes at `/admin/*` (no locale prefix), public routes at `/[locale]/*`

### Internationalization (i18n)

- next-intl configured in `src/i18n.ts` with messages in `messages/ro.json` and `messages/en.json`
- Locale routing: `/` → Romanian (default), `/en/` → English
- Use `useTranslations('namespace')` in client components, `getTranslations('namespace')` in server components
- Admin panel is English-only (no locale prefix)
- Translation keys follow nested structure: `home.hero.title`, `services.title`, etc.

### State Management

- **Zustand** for client-side state (cart only) - `src/lib/store/cart.store.ts`
- Cart persisted in localStorage with 19% VAT calculation (Romanian tax rate)
- No Redux/Context - Zustand handles all cart operations: `useCartStore()`

### Component Architecture

- shadcn/ui components in `src/components/ui/` - never edit these directly, use composition
- Layout components: `src/components/layout/` (Header, Footer, LocaleSwitch)
- Admin components: `src/components/admin/` (DataTable, StatusBadge, Timeline, UserMenu, etc.)
- Custom hooks: `src/hooks/useAuth.ts`, `src/hooks/usePermissions.ts`
- Component specs documented in `COMPONENT_LIBRARY.md` with exact props/variants

### API Routes Pattern (MongoDB)

- All API routes in `src/app/api/` using Next.js 14 App Router
- Standard pattern: export `GET`, `POST`, `PUT`, `DELETE` async functions
- **CRITICAL**: Always `await connectDB()` at the start of every API route handler
- Auth-protected routes check session via `auth()` from `src/auth.ts`
- Error handling: return `NextResponse.json({ error: 'message' }, { status: code })`
- Use `.lean()` on Mongoose queries for better performance (returns plain objects)
- Validate MongoDB ObjectIDs: `mongoose.Types.ObjectId.isValid(id)` before queries
- Examples: `src/app/api/quotes/route.ts`, `src/app/api/products/route.ts`, `src/app/api/partners/route.ts`

### Styling & Design System

- Tailwind CSS with design tokens in `DESIGN_SYSTEM.md`
- Custom colors: `--primary` (purple), `--secondary` (orange), `--accent` (cyan)
- Status colors: 7 states for quotes/orders (new, in-review, offer-sent, negotiation, booked, completed, cancelled)
- Typography: Inter font, scale from 12px (xs) to 48px (5xl)
- Always use Tailwind utilities, not custom CSS
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

### Payment Integration

- Stripe in test mode - keys in `.env`, webhook handler at `src/app/api/stripe/webhook/route.ts`
- 3 payment methods: Stripe (card), Cash on Delivery (COD), Bank Transfer (auto-generated instructions)
- Invoice generation with PDFKit - `src/lib/pdf/invoice-generator.ts`
- Checkout flow: Cart → Shipping → Payment → Confirmation with email

## Development Workflows

### Quick Start

```bash
npm install              # Install dependencies (no Supabase packages)
npm run dev              # Development server on :3000
npm run build            # Production build
npm run lint             # ESLint check
npm run typecheck        # TypeScript validation
npm run test             # Jest unit tests
npm run test:e2e         # Playwright E2E tests
```

### Database Operations

```bash
# MongoDB (local or Atlas)
npm run db:migrate       # Run migrations (via scripts/migrate.js)
npm run db:seed          # Seed initial data (scripts/seed.js)

# Create admin user
node scripts/create-admin.js
```

### Docker Deployment

```bash
docker-compose up        # Development with hot reload (includes MongoDB container)
docker-compose -f docker-compose.prod.yml up  # Production mode
```

## Code Conventions

### File Naming

- React components: PascalCase (`ProductCard.tsx`, `CheckoutForm.tsx`)
- API routes: lowercase (`route.ts` for endpoints)
- Utilities/libs: camelCase (`mongodb.ts`, `utils.ts`)
- Types: camelCase with `.d.ts` or in `src/types/`

### Import Order

1. External packages (React, Next.js, mongoose)
2. Internal aliases (`@/components`, `@/lib`, `@/types`)
3. Relative imports (`./utils`, `../models`)
4. Styles (if any)

### TypeScript Standards

- Strict mode enabled - no `any` types without justification
- Interface for props/public APIs, type for unions/utility types
- Mongoose models extend `Document` from mongoose
- NextAuth session extended in `src/types/next-auth.d.ts`

### MongoDB/Mongoose Patterns

```typescript
// API Route Pattern - ALWAYS follow this structure
import connectDB from "@/lib/mongodb";
import { Product, Order } from "@/lib/models";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await connectDB(); // ← ALWAYS first!

  const products = await Product.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean(); // ← Use .lean() for read-only queries

  return NextResponse.json({ products });
}

// Validate ObjectID before using in queries
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const product = await Product.findById(params.id).lean();
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ product });
}
```

## Common Pitfalls & Critical Rules

1. **MongoDB Connection**: **ALWAYS** `await connectDB()` in API routes before Mongoose queries - THIS IS THE #1 CAUSE OF ERRORS
2. **Middleware Edge Runtime**: Can't use Mongoose in `middleware.ts` - use `getToken()` from next-auth/jwt instead
3. **Admin vs Public Routes**: Admin routes don't have locale prefix, public routes require `[locale]`
4. **Translation Keys**: Must exist in both `ro.json` and `en.json` (EN translations pending)
5. **Stripe Webhooks**: Must verify signature - see `src/app/api/stripe/webhook/route.ts`
6. **ObjectID vs String**: MongoDB uses ObjectID, not UUIDs - always validate with `mongoose.Types.ObjectId.isValid()`
7. **Lean Queries**: Use `.lean()` for read-only queries to get plain objects instead of Mongoose documents (better performance)
8. **NO Supabase**: This project uses MongoDB ONLY - do not import or reference Supabase in any new code

## Testing Strategy

- Unit tests: Jest for utilities and business logic
- E2E tests: Playwright for critical user flows (checkout, quote submission)
- Manual testing: Test all 3 payment methods in checkout
- Test roles: Create test users for each RBAC role (admin, manager, support, editor, customer)
- Database: Use separate test database or mock MongoDB with `mongodb-memory-server`

## Key Files to Reference

- `README.md` - Complete feature overview and setup guide
- `DESIGN_SYSTEM.md` - Color tokens, typography, component variants
- `COMPONENT_LIBRARY.md` - Detailed component specifications
- `PAGE_SPECIFICATIONS.md` - All public pages with content requirements
- `docs/AUTH_SYSTEM.md` - Complete RBAC implementation details
- `docs/SPRINT_*.md` - Sprint summaries with implementation details
- **`src/lib/models.ts`** - ALL MongoDB schemas (User, Quote, Order, Product, Partner, Category, BlogPost, FAQ)
- `src/lib/mongodb.ts` - Connection singleton (critical for Next.js hot reload)

## Environment Variables

Required variables in `.env.local` (see `.env.example`):

- `MONGODB_URI` - MongoDB connection string (local: mongodb://localhost:27017/cloakroom or Atlas cloud)
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` - App URL (http://localhost:3000 for dev)
- `NEXT_PUBLIC_APP_URL` - Public app URL
- Stripe keys: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- SMTP config: `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`, `EMAIL_ADMIN`
- Bank details: `BANK_NAME`, `BANK_IBAN`, `BANK_SWIFT` for bank transfer instructions
- Company details: `COMPANY_NAME`, `COMPANY_CUI`, `COMPANY_ADDRESS`, etc.

## Quick Reference Examples

### Create Protected API Route

```typescript
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import { Quote } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const quotes = await Quote.find({ status: "new" }).lean();
  return NextResponse.json({ quotes });
}
```

### Check Permissions in Server Component

```typescript
import { auth } from "@/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();
  if (!session || !hasPermission(session.user.role, "quotes.view")) {
    redirect("/admin/login");
  }
  // Render admin content
}
```

### Use Translations in Client Component

```typescript
"use client";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("home.hero");
  return <h1>{t("title")}</h1>;
}
```

### File Upload (Local Filesystem)

Files are uploaded to `public/uploads/{folder}/` via `/api/upload` endpoint.  
Public URL format: `/uploads/{folder}/{filename}`  
Example: Upload partner logo → `/uploads/partners/1234567890-abc123.png`

### Create New MongoDB Document

```typescript
import connectDB from "@/lib/mongodb";
import { Partner } from "@/lib/models";

await connectDB();
const partner = await Partner.create({
  name: "Company Name",
  slug: "company-name",
  logo: "/uploads/partners/logo.png",
  website: "https://example.com",
  isActive: true,
  order: 0,
});
```

### Update MongoDB Document

```typescript
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models";

await connectDB();
const product = await Product.findByIdAndUpdate(
  productId,
  { basePrice: 199.99, stock: 50 },
  { new: true, runValidators: true }, // returns updated doc, validates schema
).lean();
```

## Migration Notes (for reference)

- **Migrated from Supabase to MongoDB**: All data now in MongoDB (no hybrid approach)
- Supabase client libraries removed from package.json
- `/supabase` directory deleted (no SQL migrations)
- File uploads moved from Supabase Storage to local filesystem
- All API routes updated to use Mongoose instead of Supabase client
- Docker compose updated to include MongoDB container

## Rules for code generation:

- Any request in copilot chat must strictly follow these instructions and the architectural patterns described above and must be written in a file with the full documentation.
- Any request must generate a TODO list and questions to clarify requirements before proceeding to code generation.
- Ask me if I am satisfied with the outcome and then commit the changes to git.
