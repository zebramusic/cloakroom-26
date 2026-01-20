# Garderobă Profesională - Complete Application

## 📋 PROJECT OVERVIEW

A production-ready, full-stack event cloakroom management system with:
- **Bilingual website** (RO/EN) with complete SEO
- **Quote management system** with calendar and pipeline
- **B2B e-commerce** with products, variants, cart, checkout
- **Payment integration** (Stripe, COD, Bank Transfer)
- **Invoice generation** (PDF, auto-attached)
- **Complete admin panel** with RBAC
- **Partner management** from admin
- **100% Docker-ready** for VPS deployment

---

## 🏗️ COMPLETE FILE TREE

```
cloakroom/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
├── docker-compose.yml
├── Dockerfile
├── README.md
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   └── 002_rls_policies.sql
│   └── seed.sql
│
├── scripts/
│   ├── migrate.js
│   └── seed.js
│
├── messages/
│   ├── ro.json (✅ CREATED - 300+ translations)
│   └── en.json (⚠️ NEEDED - full EN translations)
│
├── src/
│   ├── i18n.ts (✅ CREATED)
│   ├── middleware.ts (✅ CREATED - i18n + auth)
│   │
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx (Home)
│   │   │   ├── services/page.tsx
│   │   │   ├── industries/page.tsx
│   │   │   ├── pricing/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   ├── partners/page.tsx
│   │   │   ├── faq/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── legal/
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── quote/
│   │   │   │   └── page.tsx
│   │   │   ├── shop/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [slug]/page.tsx
│   │   │   │   ├── cart/page.tsx
│   │   │   │   └── checkout/page.tsx
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── auth/
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── callback/route.ts
│   │   │   └── admin/
│   │   │       ├── layout.tsx
│   │   │       ├── page.tsx (Dashboard)
│   │   │       ├── quotes/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── [id]/page.tsx
│   │   │       │   └── new/page.tsx
│   │   │       ├── bookings/
│   │   │       ├── products/
│   │   │       ├── orders/
│   │   │       ├── partners/
│   │   │       ├── content/
│   │   │       ├── users/
│   │   │       └── settings/
│   │   ├── api/
│   │   │   ├── quotes/route.ts
│   │   │   ├── orders/route.ts
│   │   │   ├── payments/
│   │   │   │   ├── stripe/route.ts
│   │   │   │   └── webhook/route.ts
│   │   │   ├── invoices/
│   │   │   │   └── generate/route.ts
│   │   │   └── upload/route.ts
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/ (shadcn components - 20+ files)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ... (15+ more)
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── LocaleSwitcher.tsx
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── HowItWorksSection.tsx
│   │   │   ├── ServicesSection.tsx
│   │   │   ├── IndustriesSection.tsx
│   │   │   ├── SafetySection.tsx
│   │   │   ├── PartnersSection.tsx
│   │   │   └── CTASection.tsx
│   │   ├── quote/
│   │   │   └── QuoteForm.tsx
│   │   ├── shop/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductFilter.tsx
│   │   │   ├── CartItem.tsx
│   │   │   └── CheckoutForm.tsx
│   │   ├── admin/
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── QuoteManagement.tsx
│   │   │   ├── ProductManagement.tsx
│   │   │   ├── OrderManagement.tsx
│   │   │   ├── PartnerManagement.tsx
│   │   │   └── ContentEditor.tsx
│   │   └── shared/
│   │       ├── SEOHead.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorBoundary.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── types.ts (generated from DB)
│   │   ├── services/
│   │   │   ├── quotes.service.ts
│   │   │   ├── products.service.ts
│   │   │   ├── orders.service.ts
│   │   │   ├── cart.service.ts
│   │   │   ├── payments.service.ts
│   │   │   ├── invoices.service.ts
│   │   │   ├── email.service.ts
│   │   │   ├── auth.service.ts
│   │   │   └── storage.service.ts
│   │   ├── utils/
│   │   │   ├── cn.ts
│   │   │   ├── format.ts
│   │   │   ├── validation.ts
│   │   │   └── constants.ts
│   │   ├── hooks/
│   │   │   ├── useCart.ts
│   │   │   ├── useAuth.ts
│   │   │   └── usePermissions.ts
│   │   └── store/
│   │       └── cart.store.ts (Zustand)
│   │
│   └── types/
│       ├── database.types.ts
│       ├── api.types.ts
│       └── common.types.ts
│
└── tests/
    ├── unit/
    │   └── orders.test.ts
    └── e2e/
        └── quote-flow.spec.ts
```

---

## 🔑 KEY IMPLEMENTATION FILES

### ✅ ALREADY CREATED (First batch):
1. `package.json` - Complete dependencies
2. `.env.example` - All environment variables
3. `tsconfig.json` - TypeScript configuration
4. `tailwind.config.ts` - Full Tailwind setup
5. `next.config.js` - Next.js with next-intl
6. `supabase/migrations/001_initial_schema.sql` - Complete DB schema (21 tables)
7. `supabase/migrations/002_rls_policies.sql` - All RLS policies + helper functions
8. `supabase/seed.sql` - Complete seed data (10 products, 5 partners, 5 FAQs, 3 quotes, 2 orders)
9. `src/i18n.ts` - i18n configuration
10. `src/middleware.ts` - Auth + i18n middleware
11. `messages/ro.json` - Complete Romanian translations (300+ keys)

### ⚠️ CRITICAL FILES NEEDED (Next batch):

**Core Infrastructure:**
- `messages/en.json` - English translations (mirror of ro.json)
- `src/lib/supabase/client.ts` - Supabase client setup
- `src/lib/supabase/server.ts` - Server-side Supabase
- `src/lib/services/*.ts` - All service layer files (8 services)
- `src/lib/store/cart.store.ts` - Cart state management
- `src/app/globals.css` - Tailwind base styles

**Layout & Core Pages:**
- `src/app/[locale]/layout.tsx` - Root layout with providers
- `src/app/[locale]/page.tsx` - Home page
- `src/components/layout/Header.tsx` - Navigation header
- `src/components/layout/Footer.tsx` - Site footer

**UI Components (shadcn):**
- 20+ shadcn/ui components in `src/components/ui/`

**Feature Pages:**
- Quote form page + component
- Shop pages (listing, detail, cart, checkout)
- Admin pages (dashboard + CRUD modules)

**API Routes:**
- Payment webhooks (Stripe)
- Invoice generation
- Quote submission
- Order creation

**DevOps:**
- `Dockerfile` - Production container
- `docker-compose.yml` - Local development
- `.github/workflows/ci.yml` - CI/CD
- `README.md` - Complete documentation

---

## 🚀 IMPLEMENTATION PRIORITY

### Phase 1: Core Infrastructure (DONE ✅)
- ✅ Project setup
- ✅ Database schema + RLS
- ✅ Seed data
- ✅ i18n config + RO translations
- ✅ Middleware (auth + i18n)

### Phase 2: Services & Utils (NEXT)
- Supabase client wrappers
- Service layer (all 8 services)
- Cart store (Zustand)
- Utility functions

### Phase 3: UI Components
- shadcn/ui components (20+)
- Layout components (Header, Footer)
- Shared components

### Phase 4: Public Pages
- Home page with all sections
- Services, About, Partners, FAQ, Contact
- Blog & Legal pages
- Quote form

### Phase 5: Shop & Checkout
- Product listing + filters
- Product detail pages
- Cart & checkout flow
- Payment integration

### Phase 6: Admin Panel
- Dashboard with stats
- CRUD for all entities
- RBAC implementation
- Content management

### Phase 7: API Routes
- Payment webhooks
- Invoice generation
- Email sending
- File uploads

### Phase 8: DevOps & Testing
- Docker setup
- CI/CD pipeline
- Basic tests
- Documentation

---

## 📦 DOCKER SETUP (Preview)

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      # ... all other env vars
    depends_on:
      - supabase
    
  supabase:
    # Supabase local setup or connect to cloud
    # Details in docker-compose.yml
```

---

## 🔐 SECURITY IMPLEMENTATION

1. **RLS Policies**: ✅ All tables protected
2. **Helper Functions**: ✅ `is_admin()`, `has_permission()`
3. **Middleware**: ✅ Auth + route protection
4. **API Routes**: Server-side validation
5. **Service Layer**: Centralized business logic
6. **Audit Log**: All admin actions tracked

---

## 💳 PAYMENT FLOW

1. **Stripe (Card)**:
   - Create PaymentIntent on server
   - Confirm payment on client
   - Webhook updates order status
   - Auto-generate invoice

2. **COD** (Cash on Delivery):
   - Order created with status `pending_cod`
   - Manual confirmation by admin
   - Invoice generated on confirmation

3. **Bank Transfer**:
   - Order created with status `pending_bank_transfer`
   - Bank details shown to customer
   - Manual confirmation by admin
   - Invoice generated on confirmation

---

## 📄 INVOICE GENERATION

- **Library**: PDFKit
- **Trigger**: Order status → `paid` OR manual
- **Content**: Company details, items, totals, TVA
- **Storage**: Supabase Storage (private bucket)
- **Attachment**: URL saved to `orders.invoice_pdf_url`

---

## 📧 EMAIL SYSTEM

- **Library**: Nodemailer (SMTP)
- **Templates**: HTML emails with company branding
- **Types**:
  - Quote confirmation (client + admin)
  - Order confirmation
  - Order status updates
  - Invoice delivery

---

## 🌐 SEO IMPLEMENTATION

- **Per-page metadata**: title, description, keywords
- **OpenGraph**: og:title, og:description, og:image
- **Schema.org**: Organization, LocalBusiness, Product
- **Sitemap**: Auto-generated from routes
- **Robots.txt**: Proper crawling rules

---

## 📱 RESPONSIVE DESIGN

- Mobile-first approach with Tailwind
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly components
- Optimized images with Next.js Image

---

## 🧪 TESTING STRATEGY

1. **Unit Tests**: Services, utils, helpers
2. **Integration Tests**: API routes, payment flow
3. **E2E Tests**: Quote submission, checkout flow (Playwright)
4. **CI/CD**: Auto-run on PR + main

---

## 📊 ADMIN DASHBOARD STATS

- Total quotes by status (chart)
- Total orders by month (chart)
- Revenue by month (chart)
- Top products
- Recent activity
- Low stock alerts

---

## 🎨 DESIGN SYSTEM

- **Primary Color**: Blue (#4F46E5)
- **Secondary**: Pink, Green, Yellow, Purple
- **Typography**: System fonts
- **Components**: shadcn/ui (consistent design)
- **Icons**: Lucide React

---

## 🔄 DEPLOYMENT OPTIONS

### Option 1: VPS (Ubuntu) with Docker
```bash
# Clone repo
git clone <repo-url>
cd cloakroom

# Copy and configure .env
cp .env.example .env
nano .env

# Run migrations
npm run db:migrate
npm run db:seed

# Build and start
docker-compose up -d

# Access: http://your-vps-ip:3000
```

### Option 2: Vercel
```bash
# Connect repo to Vercel
vercel link

# Set environment variables in Vercel dashboard

# Deploy
vercel --prod

# Note: Requires Supabase cloud (not local)
```

---

## ⏱️ ESTIMATED COMPLETION TIME

- **With all files**: 100% functional, production-ready
- **Local setup**: < 10 minutes (with Docker)
- **VPS deployment**: < 30 minutes

---

## 📝 NEXT STEPS TO COMPLETE

Due to response size limitations, I'll provide the remaining files in batches:

**Batch 2**: Core services + Supabase wrappers + EN translations
**Batch 3**: shadcn/ui components (20+)
**Batch 4**: Layout components + Home page
**Batch 5**: Shop pages + components
**Batch 6**: Admin panel
**Batch 7**: API routes
**Batch 8**: Docker + CI/CD + README

---

## 🎯 DECISION LOG

1. **Stripe as default payment**: Most common, easy to test, fallback to manual
2. **Shipping configurable in DB**: No hardcoded rates, admin can adjust
3. **Partner logos in Storage**: Not hardcoded, fully admin-managed
4. **ROW_LEVEL_SECURITY**: Maximum security, granular control
5. **Service layer pattern**: Clean separation, testable, maintainable
6. **Next.js App Router**: Latest, better performance, RSC support
7. **Zustand for cart**: Lightweight, simple, persistent
8. **PDFKit for invoices**: No external service, full control
9. **RBAC with permissions table**: Flexible, scalable, per-module control
10. **Audit log for compliance**: Track all admin actions

---

## ✅ PRODUCTION CHECKLIST

- [x] Database schema complete
- [x] RLS policies implemented
- [x] Seed data for testing
- [x] i18n setup (RO complete, EN pending)
- [x] Middleware (auth + i18n)
- [ ] Service layer (8 services)
- [ ] UI components (20+ shadcn)
- [ ] All public pages
- [ ] All admin pages
- [ ] Payment integration
- [ ] Invoice generation
- [ ] Email system
- [ ] Docker setup
- [ ] CI/CD pipeline
- [ ] Complete tests
- [ ] Documentation

---

**STATUS**: Core infrastructure ✅ | Services & UI in progress 🚧

The application architecture is production-ready. All critical decisions are documented. Continuing with implementation...
