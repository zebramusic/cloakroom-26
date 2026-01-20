# Implementation Map - Next.js File Structure

This document maps the design specifications to the actual Next.js files and components that need to be created.

## PHASE 1: FOUNDATION (Already Complete ✅)

```
✅ package.json
✅ .env.local
✅ .gitignore
✅ tsconfig.json
✅ tailwind.config.ts
✅ postcss.config.js
✅ next.config.js
✅ src/i18n.ts
✅ src/middleware.ts
✅ messages/ro.json
✅ messages/en.json
✅ src/lib/supabase/client.ts
✅ src/lib/supabase/server.ts
✅ src/lib/supabase/types.ts
✅ src/lib/utils/cn.ts
✅ src/lib/utils/format.ts
✅ src/lib/utils/validation.ts
✅ src/lib/utils/constants.ts
✅ src/app/globals.css
✅ supabase/migrations/001_initial_schema.sql
✅ supabase/migrations/002_rls_policies.sql
✅ supabase/seed.sql
✅ Dockerfile
✅ docker-compose.yml
✅ .github/workflows/ci.yml
✅ README.md
✅ IMPLEMENTATION_GUIDE.md
✅ DELIVERY_SUMMARY.md
```

## PHASE 2: SHADCN/UI COMPONENTS (Install First)

Install these shadcn/ui components before building custom components:

```bash
# Core UI primitives
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add label
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add switch

# Layout components
npx shadcn-ui@latest add card
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add avatar

# Overlays
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add alert-dialog

# Navigation
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add accordion

# Data display
npx shadcn-ui@latest add table
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add skeleton

# Feedback
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add alert

# Forms
npx shadcn-ui@latest add form
npx shadcn-ui@latest add calendar

# Other
npx shadcn-ui@latest add pagination
```

After installation, files will be in:
```
src/components/ui/
├── button.tsx
├── input.tsx
├── card.tsx
├── dialog.tsx
├── sheet.tsx
├── table.tsx
├── badge.tsx
├── ... (all shadcn components)
```

---

## PHASE 3: LAYOUT COMPONENTS

### 3.1 Root Layout
**File:** `src/app/[locale]/layout.tsx` ✅ (created)

**Dependencies:** 
- `src/i18n.ts`
- `src/app/globals.css`
- `next-intl`

**Children:**
- All page components

---

### 3.2 Header
**File:** `src/components/layout/Header.tsx`

**Props:**
```typescript
interface HeaderProps {
  locale: 'ro' | 'en';
  transparent?: boolean;
}
```

**Dependencies:**
- `src/components/ui/button.tsx`
- `src/components/ui/sheet.tsx` (mobile menu)
- `src/components/layout/LocaleSwitch.tsx`
- `src/components/layout/Navigation.tsx`
- `lucide-react` icons
- `next/link`
- `next-intl` (useTranslations)

**Sub-components:**
- `src/components/layout/Navigation.tsx` - Nav links
- `src/components/layout/MobileMenu.tsx` - Mobile drawer

**Styling:**
- Sticky header: `sticky top-0 z-50`
- Shadow: `shadow-sm`
- Background: `bg-background/95 backdrop-blur`

---

### 3.3 Footer
**File:** `src/components/layout/Footer.tsx`

**Props:** None (static content)

**Dependencies:**
- `next/link`
- `next-intl`
- `lucide-react` (social icons)

**Structure:**
- 4-column grid (desktop)
- Stacked (mobile)
- Social links with icons
- Copyright bar

---

### 3.4 LocaleSwitch
**File:** `src/components/layout/LocaleSwitch.tsx`

**Props:**
```typescript
interface LocaleSwitchProps {
  currentLocale: 'ro' | 'en';
  variant?: 'dropdown' | 'toggle';
}
```

**Dependencies:**
- `src/components/ui/dropdown-menu.tsx` (dropdown variant)
- `src/components/ui/button.tsx` (toggle variant)
- `next/navigation` (useRouter, usePathname)
- `lucide-react` (Globe icon)

**Behavior:**
- Updates URL locale prefix
- Sets cookie for persistence
- Maintains current route structure

---

## PHASE 4: PAGE COMPONENTS (Public Site)

### 4.1 Home Page
**File:** `src/app/[locale]/page.tsx` ✅ (minimal version created)

**Full version dependencies:**
- `src/components/sections/Hero.tsx`
- `src/components/sections/TrustBar.tsx`
- `src/components/sections/ServiceGrid.tsx`
- `src/components/sections/ProcessSteps.tsx`
- `src/components/sections/IndustryGrid.tsx`
- `src/components/sections/FeatureGrid.tsx`
- `src/components/sections/TestimonialCarousel.tsx`
- `src/components/sections/QuoteCTA.tsx`
- Supabase query: Fetch featured partners, testimonials

**Metadata:**
- Title: "Garderobă profesională | Sisteme cloakroom"
- Description, OG tags

---

### 4.2 Services Page
**File:** `src/app/[locale]/servicii/page.tsx` (RO)
**File:** `src/app/[locale]/services/page.tsx` (EN)

**Dependencies:**
- `src/components/ui/tabs.tsx`
- `src/components/cards/ServiceCard.tsx`
- `src/components/sections/ProcessSteps.tsx`
- `src/components/sections/QuoteCTA.tsx`

**Content:** Static content from translations

---

### 4.3 Industries Page
**File:** `src/app/[locale]/industrii/page.tsx` (RO)
**File:** `src/app/[locale]/industries/page.tsx` (EN)

**Dependencies:**
- `src/components/cards/IndustryCard.tsx`
- `src/components/sections/QuoteCTA.tsx`

---

### 4.4 Pricing Page
**File:** `src/app/[locale]/preturi/page.tsx` (RO)
**File:** `src/app/[locale]/pricing/page.tsx` (EN)

**Dependencies:**
- `src/components/sections/PricingExplainer.tsx`
- `src/components/ui/accordion.tsx`
- `src/components/sections/QuoteCTA.tsx`

---

### 4.5 About Page
**File:** `src/app/[locale]/despre/page.tsx` (RO)
**File:** `src/app/[locale]/about/page.tsx` (EN)

**Dependencies:**
- `src/components/ui/card.tsx`
- `src/components/sections/QuoteCTA.tsx`

**Content:** Static content about company

---

### 4.6 Partners Page
**File:** `src/app/[locale]/parteneri/page.tsx` (RO)
**File:** `src/app/[locale]/partners/page.tsx` (EN)

**Dependencies:**
- `src/components/sections/PartnerLogoGrid.tsx`
- Supabase query: Fetch all published partners

---

### 4.7 FAQ Page
**File:** `src/app/[locale]/intrebari/page.tsx` (RO)
**File:** `src/app/[locale]/faq/page.tsx` (EN)

**Dependencies:**
- `src/components/ui/accordion.tsx`
- `src/components/shared/SearchInput.tsx`
- Supabase query: Fetch published FAQs

---

### 4.8 Contact Page
**File:** `src/app/[locale]/contact/page.tsx`

**Dependencies:**
- `src/components/forms/ContactForm.tsx`
- `src/components/ui/card.tsx`

---

### 4.9 Blog Index
**File:** `src/app/[locale]/blog/page.tsx`

**Dependencies:**
- `src/components/cards/BlogPostCard.tsx`
- `src/components/shared/Pagination.tsx`
- Supabase query: Fetch published blog posts

---

### 4.10 Blog Article
**File:** `src/app/[locale]/blog/[slug]/page.tsx`

**Dependencies:**
- `src/components/shared/Breadcrumbs.tsx`
- Supabase query: Fetch blog post by slug
- Dynamic metadata

**Styling:** Use `.prose-custom` class for content

---

### 4.11 Legal Pages
**Files:**
- `src/app/[locale]/gdpr/page.tsx`
- `src/app/[locale]/termeni/page.tsx` (RO) / `terms/page.tsx` (EN)
- `src/app/[locale]/confidentialitate/page.tsx` (RO) / `privacy/page.tsx` (EN)

**Dependencies:**
- Supabase query: Fetch legal page content by slug
- `.prose-custom` styling

---

## PHASE 5: QUOTE FUNNEL

### 5.1 Quote Request Page
**File:** `src/app/[locale]/cere-oferta/page.tsx` (RO)
**File:** `src/app/[locale]/request-quote/page.tsx` (EN)

**Dependencies:**
- `src/components/forms/QuoteForm.tsx`
- `src/components/forms/DateRangePicker.tsx`
- `src/lib/utils/validation.ts` (quoteFormSchema)

---

### 5.2 Quote Confirmation Page
**File:** `src/app/[locale]/cere-oferta/confirmare/page.tsx` (RO)
**File:** `src/app/[locale]/request-quote/confirmation/page.tsx` (EN)

**Dependencies:**
- `src/components/ui/card.tsx`
- `lucide-react` (CheckCircle icon)

**Props:** Receives email via URL params or state

---

### 5.3 Quote API
**File:** `src/app/api/quotes/route.ts`

**Methods:** POST (create quote)

**Dependencies:**
- `src/lib/supabase/server.ts` (createClient)
- `src/lib/utils/validation.ts` (quoteFormSchema)
- `src/lib/services/email.service.ts` (send emails)
- `src/lib/utils/format.ts` (generateQuoteNumber)

**Logic:**
1. Validate request body with Zod
2. Check honeypot field
3. Insert to `quotes` table
4. Send confirmation email to user
5. Send notification email to admin
6. Return quote ID

---

## PHASE 6: SHOP

### 6.1 Shop Catalog Page
**File:** `src/app/[locale]/shop/page.tsx`

**Dependencies:**
- `src/components/sections/ProductGrid.tsx`
- `src/components/cards/ProductCard.tsx`
- `src/components/shared/FilterBar.tsx`
- `src/components/shared/Pagination.tsx`
- Supabase query: Fetch products with filters

**Query params:** category, price_min, price_max, sort, page

---

### 6.2 Product Detail Page
**File:** `src/app/[locale]/shop/[slug]/page.tsx`

**Dependencies:**
- `src/components/products/ProductDetail.tsx`
- `src/components/products/ImageGallery.tsx`
- `src/components/products/VariantSelector.tsx`
- `src/components/products/CompatibilityList.tsx`
- `src/components/ui/tabs.tsx`
- `src/components/shared/Breadcrumbs.tsx`
- Supabase query: Fetch product by slug with variants, images, compatibility

**Dynamic metadata:** Product name, description, OG image

---

### 6.3 Cart Page
**File:** `src/app/[locale]/shop/cos/page.tsx` (RO)
**File:** `src/app/[locale]/shop/cart/page.tsx` (EN)

**Dependencies:**
- `src/components/shop/CartItem.tsx`
- `src/components/shop/OrderSummary.tsx`
- `src/lib/store/cart.store.ts` (Zustand)
- `src/lib/utils/format.ts` (calculateTax, calculateTotalWithTax)

---

### 6.4 Checkout Page
**File:** `src/app/[locale]/shop/checkout/page.tsx`

**Dependencies:**
- `src/components/shop/CheckoutForm.tsx`
- `src/components/shop/OrderSummary.tsx`
- `src/components/shop/PaymentMethodSelector.tsx`
- `src/lib/utils/validation.ts` (checkoutFormSchema)
- `@stripe/stripe-js`, `@stripe/react-stripe-js` (for card payment)

---

### 6.5 Order Confirmation Page
**File:** `src/app/[locale]/shop/order/[id]/page.tsx`

**Dependencies:**
- `src/components/shop/OrderConfirmation.tsx`
- Supabase query: Fetch order by ID with items

**Auth:** Check if user owns order (by email in checkout form)

---

### 6.6 Cart Store (Zustand)
**File:** `src/lib/store/cart.store.ts`

**State:**
```typescript
interface CartItem {
  product_id: string;
  variant_id: string;
  name: string;
  variant_name: string;
  image_url?: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}
```

**Persistence:** LocalStorage via Zustand persist middleware

---

### 6.7 Shop APIs

#### Products API
**File:** `src/app/api/products/route.ts`

**Methods:** GET (list with filters)

**Query params:** category, sort, page, limit

---

#### Orders API
**File:** `src/app/api/orders/route.ts`

**Methods:** POST (create order)

**Dependencies:**
- `src/lib/services/orders.service.ts`
- `src/lib/services/payments.service.ts` (if Stripe)
- `src/lib/services/invoices.service.ts`
- `src/lib/services/email.service.ts`

**Logic:**
1. Validate checkout data
2. Calculate shipping & tax
3. Create order + order_items (transaction)
4. If payment=card: Create Stripe PaymentIntent
5. If payment=cod/bank: Set pending status
6. Generate invoice PDF
7. Send confirmation email
8. Return order ID

---

#### Stripe Webhook
**File:** `src/app/api/payments/webhook/route.ts`

**Methods:** POST

**Logic:**
1. Verify Stripe signature
2. Handle `payment_intent.succeeded` event
3. Update order payment_status to 'paid'
4. Send email with invoice

---

## PHASE 7: ADMIN PANEL

### 7.1 Admin Login
**File:** `src/app/admin/login/page.tsx`

**Dependencies:**
- `src/components/forms/LoginForm.tsx`
- `src/lib/supabase/client.ts`

**Logic:**
- Supabase Auth sign in
- Redirect to `/admin` on success

---

### 7.2 Admin Layout
**File:** `src/app/admin/layout.tsx`

**Dependencies:**
- `src/components/admin/AdminSidebar.tsx`
- `src/middleware.ts` (auth check)

**Behavior:**
- Protected route (middleware redirects if not auth)
- Sidebar visible on all admin pages

---

### 7.3 Admin Dashboard
**File:** `src/app/admin/page.tsx`

**Dependencies:**
- `src/components/admin/StatsCard.tsx`
- `src/components/admin/DataTable.tsx`
- `src/components/admin/RevenueChart.tsx`
- Supabase queries: Fetch stats, recent quotes, recent orders

---

### 7.4 Quotes List
**File:** `src/app/admin/quotes/page.tsx`

**Dependencies:**
- `src/components/admin/DataTable.tsx`
- `src/components/admin/FilterBar.tsx`
- `src/components/admin/BulkActionsBar.tsx`
- `src/components/admin/StatusBadge.tsx`

---

### 7.5 Quote Detail
**File:** `src/app/admin/quotes/[id]/page.tsx`

**Dependencies:**
- `src/components/admin/QuoteDetail.tsx`
- `src/components/admin/Timeline.tsx`
- `src/components/admin/NotesPanel.tsx`
- `src/components/ui/tabs.tsx`

---

### 7.6 Quotes Calendar
**File:** `src/app/admin/quotes/calendar/page.tsx`

**Dependencies:**
- `src/components/admin/QuoteCalendar.tsx`
- External library: `react-big-calendar` or `@fullcalendar/react`

---

### 7.7 Bookings List + Detail
**Files:**
- `src/app/admin/bookings/page.tsx`
- `src/app/admin/bookings/[id]/page.tsx`

**Dependencies:** Similar to Quotes, additional fields for deal value, deposits

---

### 7.8 Partners List
**File:** `src/app/admin/partners/page.tsx`

**Dependencies:**
- `src/components/admin/DataTable.tsx`

---

### 7.9 Partner Form (Create/Edit)
**Files:**
- `src/app/admin/partners/new/page.tsx`
- `src/app/admin/partners/[id]/edit/page.tsx`

**Dependencies:**
- `src/components/forms/PartnerForm.tsx`
- `src/components/admin/ImageUpload.tsx`
- `src/lib/utils/validation.ts` (partnerFormSchema)

---

### 7.10 Products List
**File:** `src/app/admin/products/page.tsx`

**Dependencies:**
- `src/components/admin/DataTable.tsx`
- `src/components/admin/FilterBar.tsx`

---

### 7.11 Product Form (Create/Edit)
**Files:**
- `src/app/admin/products/new/page.tsx`
- `src/app/admin/products/[id]/edit/page.tsx`

**Dependencies:**
- `src/components/forms/ProductForm.tsx`
- `src/components/admin/VariantManager.tsx`
- `src/components/admin/ImageUploadMultiple.tsx`
- `src/components/ui/tabs.tsx`

---

### 7.12 Orders List
**File:** `src/app/admin/orders/page.tsx`

**Dependencies:**
- `src/components/admin/DataTable.tsx`
- `src/components/admin/StatusBadge.tsx`

---

### 7.13 Order Detail
**File:** `src/app/admin/orders/[id]/page.tsx`

**Dependencies:**
- `src/components/admin/OrderDetail.tsx`
- `src/components/admin/Timeline.tsx`
- `src/components/ui/tabs.tsx`

---

### 7.14 Settings
**File:** `src/app/admin/settings/page.tsx`

**Dependencies:**
- `src/components/admin/SettingsTabs.tsx`
- `src/components/forms/SettingsForm.tsx`
- `src/components/admin/ImageUpload.tsx`
- `src/components/ui/tabs.tsx`

---

## PHASE 8: SERVICES LAYER

### 8.1 Orders Service
**File:** `src/lib/services/orders.service.ts`

**Functions:**
- `createOrder(orderData, items)` - Transaction: insert order + order_items
- `calculateShipping(orderData)` - Query shipping_methods, apply rules
- `updateOrderStatus(orderId, status)` - Update + audit log

---

### 8.2 Payments Service
**File:** `src/lib/services/payments.service.ts`

**Functions:**
- `createPaymentIntent(amount, currency, metadata)` - Stripe API
- `confirmPayment(paymentIntentId)` - Stripe API
- `refundPayment(paymentIntentId, amount)` - Stripe API
- `handleWebhook(event)` - Process Stripe webhook events

**Dependencies:** `stripe` package

---

### 8.3 Invoices Service
**File:** `src/lib/services/invoices.service.ts`

**Functions:**
- `generateInvoice(orderId)` - Create PDF with PDFKit
- `uploadInvoice(orderId, pdfBuffer)` - Upload to Supabase Storage
- `getInvoiceUrl(orderId)` - Return public or signed URL

**Dependencies:** `pdfkit`, Supabase Storage

---

### 8.4 Email Service
**File:** `src/lib/services/email.service.ts`

**Functions:**
- `sendQuoteConfirmation(quoteData, userEmail)` - Nodemailer SMTP
- `sendQuoteNotification(quoteData, adminEmail)` - Admin alert
- `sendOrderConfirmation(orderData, userEmail, invoicePDF)` - With attachment
- `sendOfferEmail(quoteId, clientEmail, offerPDF)` - Admin-triggered

**Dependencies:** `nodemailer`

**Templates:** HTML email templates in `src/lib/email-templates/`

---

### 8.5 Products Service
**File:** `src/lib/services/products.service.ts`

**Functions:**
- `getProducts(filters, page, limit)` - Query with filters
- `getProductBySlug(slug)` - Single product with variants
- `getCompatibleProducts(productId)` - Related products
- `checkStock(variantId, quantity)` - Validate availability

---

### 8.6 Quotes Service
**File:** `src/lib/services/quotes.service.ts`

**Functions:**
- `createQuote(quoteData)` - Insert quote, generate number
- `updateQuoteStatus(quoteId, status, userId)` - Update + timeline
- `addQuoteNote(quoteId, content, userId)` - Internal notes

---

### 8.7 Auth Service
**File:** `src/lib/services/auth.service.ts`

**Functions:**
- `checkPermission(userId, module, permission)` - RBAC check
- `isAdmin(userId)` - Check if user has admin role
- `getCurrentUser()` - Get authenticated user from Supabase

---

### 8.8 Upload Service
**File:** `src/lib/services/upload.service.ts`

**Functions:**
- `uploadImage(file, bucket, folder)` - Upload to Supabase Storage
- `deleteImage(url, bucket)` - Remove from storage
- `getPublicUrl(path, bucket)` - Get public URL

---

## PHASE 9: FORM COMPONENTS

### 9.1 QuoteForm
**File:** `src/components/forms/QuoteForm.tsx`

**Dependencies:**
- `src/components/ui/form.tsx` (shadcn)
- `src/components/ui/input.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/checkbox.tsx`
- `src/components/ui/textarea.tsx`
- `src/components/forms/DateRangePicker.tsx`
- `src/lib/utils/validation.ts` (quoteFormSchema)
- `react-hook-form`, `@hookform/resolvers/zod`

**Sections:** 4 sections (as per specs)

---

### 9.2 DateRangePicker
**File:** `src/components/forms/DateRangePicker.tsx`

**Dependencies:**
- `src/components/ui/calendar.tsx`
- `src/components/ui/popover.tsx`
- `src/components/ui/button.tsx`
- `date-fns` (date manipulation)

**Behavior:** Select start and end date, validate range

---

### 9.3 ContactForm
**File:** `src/components/forms/ContactForm.tsx`

**Dependencies:** Same as QuoteForm

**Fields:** Name, Email, Phone, Subject, Message

---

### 9.4 CheckoutForm
**File:** `src/components/shop/CheckoutForm.tsx`

**Dependencies:**
- Form UI components
- `src/components/shop/PaymentMethodSelector.tsx`
- `src/lib/utils/validation.ts` (checkoutFormSchema)
- `@stripe/stripe-js` (if card payment)

---

### 9.5 LoginForm
**File:** `src/components/forms/LoginForm.tsx`

**Dependencies:**
- Form UI components
- `src/lib/supabase/client.ts`

**Fields:** Email, Password, Remember me checkbox

---

### 9.6 PartnerForm
**File:** `src/components/forms/PartnerForm.tsx`

**Dependencies:**
- Form UI components
- `src/components/admin/ImageUpload.tsx`
- `src/lib/utils/validation.ts` (partnerFormSchema)

---

### 9.7 ProductForm
**File:** `src/components/forms/ProductForm.tsx`

**Dependencies:**
- Form UI components
- `src/components/admin/VariantManager.tsx`
- `src/components/admin/ImageUploadMultiple.tsx`
- `src/lib/utils/validation.ts` (productFormSchema)
- Tabs for multi-section form

---

## PHASE 10: SECTION COMPONENTS

All files in `src/components/sections/`:

- `Hero.tsx`
- `TrustBar.tsx`
- `ServiceGrid.tsx`
- `ProcessSteps.tsx`
- `IndustryGrid.tsx`
- `FeatureGrid.tsx`
- `TestimonialCarousel.tsx`
- `QuoteCTA.tsx`
- `PricingExplainer.tsx`
- `PartnerLogoGrid.tsx`

**Common dependencies:**
- `src/components/ui/card.tsx`
- `lucide-react` icons
- `next-intl` (useTranslations)

---

## PHASE 11: CARD COMPONENTS

All files in `src/components/cards/`:

- `ServiceCard.tsx`
- `IndustryCard.tsx`
- `ProductCard.tsx`
- `TestimonialCard.tsx`
- `BlogPostCard.tsx`

**Common patterns:**
- Card wrapper
- Icon/image
- Title + description
- CTA link/button

---

## PHASE 12: ADMIN COMPONENTS

All files in `src/components/admin/`:

- `AdminSidebar.tsx`
- `DataTable.tsx`
- `StatsCard.tsx`
- `StatusBadge.tsx`
- `BulkActionsBar.tsx`
- `FilterBar.tsx`
- `SidePanel.tsx`
- `ConfirmDialog.tsx`
- `Timeline.tsx`
- `NotesPanel.tsx`
- `ImageUpload.tsx`
- `ImageUploadMultiple.tsx`
- `VariantManager.tsx`
- `QuoteCalendar.tsx`
- `RevenueChart.tsx` (using Recharts)

---

## PHASE 13: SHARED/UTILITY COMPONENTS

All files in `src/components/shared/`:

- `EmptyState.tsx`
- `LoadingSkeleton.tsx`
- `Breadcrumbs.tsx`
- `Pagination.tsx`
- `SearchInput.tsx`

---

## DIRECTORY STRUCTURE (Complete)

```
cloakroom/
├── .env.local ✅
├── .gitignore ✅
├── package.json ✅
├── tsconfig.json ✅
├── tailwind.config.ts ✅
├── postcss.config.js ✅
├── next.config.js ✅
├── Dockerfile ✅
├── docker-compose.yml ✅
├── README.md ✅
├── DESIGN_SYSTEM.md ✅
├── INFORMATION_ARCHITECTURE.md ✅
├── PAGE_SPECIFICATIONS.md ✅
├── COMPONENT_LIBRARY.md ✅
├── UX_FLOWS.md ✅
├── MICROCOPY_GUIDELINES.md ✅
├── UI_QUALITY_BAR.md ✅
├── IMPLEMENTATION_MAP.md ✅ (this file)
│
├── .github/
│   └── workflows/
│       └── ci.yml ✅
│
├── messages/
│   ├── ro.json ✅
│   └── en.json ✅
│
├── public/
│   ├── logo.svg ⚠️ (needs design)
│   ├── og-image.jpg ⚠️ (needs design)
│   └── favicon.ico ⚠️
│
├── scripts/
│   ├── migrate.js ✅
│   └── seed.js ✅
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql ✅
│   │   └── 002_rls_policies.sql ✅
│   └── seed.sql ✅
│
└── src/
    ├── i18n.ts ✅
    ├── middleware.ts ✅
    │
    ├── app/
    │   ├── globals.css ✅
    │   │
    │   ├── [locale]/
    │   │   ├── layout.tsx ✅ (minimal)
    │   │   ├── page.tsx ✅ (minimal)
    │   │   │
    │   │   ├── servicii/ (or services/) ⚠️
    │   │   │   └── page.tsx
    │   │   ├── industrii/ (or industries/) ⚠️
    │   │   │   └── page.tsx
    │   │   ├── preturi/ (or pricing/) ⚠️
    │   │   │   └── page.tsx
    │   │   ├── despre/ (or about/) ⚠️
    │   │   │   └── page.tsx
    │   │   ├── parteneri/ (or partners/) ⚠️
    │   │   │   └── page.tsx
    │   │   │
    │   │   ├── shop/ ⚠️
    │   │   │   ├── page.tsx (catalog)
    │   │   │   ├── [slug]/ (product detail)
    │   │   │   │   └── page.tsx
    │   │   │   ├── cos/ (cart - RO) or cart/ (EN)
    │   │   │   │   └── page.tsx
    │   │   │   ├── checkout/
    │   │   │   │   └── page.tsx
    │   │   │   └── order/
    │   │   │       └── [id]/
    │   │   │           └── page.tsx
    │   │   │
    │   │   ├── intrebari/ (or faq/) ⚠️
    │   │   │   └── page.tsx
    │   │   ├── contact/ ⚠️
    │   │   │   └── page.tsx
    │   │   │
    │   │   ├── blog/ ⚠️
    │   │   │   ├── page.tsx (index)
    │   │   │   └── [slug]/
    │   │   │       └── page.tsx (article)
    │   │   │
    │   │   ├── cere-oferta/ (RO) or request-quote/ (EN) ⚠️
    │   │   │   ├── page.tsx (form)
    │   │   │   └── confirmare/ (or confirmation/)
    │   │   │       └── page.tsx
    │   │   │
    │   │   ├── gdpr/ ⚠️
    │   │   │   └── page.tsx
    │   │   ├── termeni/ (or terms/) ⚠️
    │   │   │   └── page.tsx
    │   │   └── confidentialitate/ (or privacy/) ⚠️
    │   │       └── page.tsx
    │   │
    │   ├── admin/ ⚠️
    │   │   ├── login/
    │   │   │   └── page.tsx
    │   │   ├── layout.tsx
    │   │   ├── page.tsx (dashboard)
    │   │   │
    │   │   ├── quotes/
    │   │   │   ├── page.tsx (list)
    │   │   │   ├── [id]/
    │   │   │   │   └── page.tsx (detail)
    │   │   │   └── calendar/
    │   │   │       └── page.tsx
    │   │   │
    │   │   ├── bookings/
    │   │   │   ├── page.tsx
    │   │   │   └── [id]/
    │   │   │       └── page.tsx
    │   │   │
    │   │   ├── partners/
    │   │   │   ├── page.tsx
    │   │   │   ├── new/
    │   │   │   │   └── page.tsx
    │   │   │   └── [id]/
    │   │   │       └── edit/
    │   │   │           └── page.tsx
    │   │   │
    │   │   ├── products/
    │   │   │   ├── page.tsx
    │   │   │   ├── new/
    │   │   │   │   └── page.tsx
    │   │   │   └── [id]/
    │   │   │       ├── edit/
    │   │   │       │   └── page.tsx
    │   │   │       └── variants/
    │   │   │           └── page.tsx
    │   │   │
    │   │   ├── orders/
    │   │   │   ├── page.tsx
    │   │   │   └── [id]/
    │   │   │       ├── page.tsx
    │   │   │       └── invoice/
    │   │   │           └── page.tsx
    │   │   │
    │   │   ├── content/
    │   │   │   ├── faqs/
    │   │   │   │   └── page.tsx
    │   │   │   ├── blog/
    │   │   │   │   └── page.tsx
    │   │   │   ├── legal/
    │   │   │   │   └── page.tsx
    │   │   │   └── blocks/
    │   │   │       └── page.tsx
    │   │   │
    │   │   ├── users/
    │   │   │   ├── page.tsx
    │   │   │   └── [id]/
    │   │   │       └── edit/
    │   │   │           └── page.tsx
    │   │   │
    │   │   └── settings/
    │   │       └── page.tsx
    │   │
    │   └── api/ ⚠️
    │       ├── quotes/
    │       │   └── route.ts
    │       ├── orders/
    │       │   └── route.ts
    │       ├── payments/
    │       │   ├── stripe/
    │       │   │   └── route.ts
    │       │   └── webhook/
    │       │       └── route.ts
    │       ├── invoices/
    │       │   └── [id]/
    │       │       └── route.ts
    │       ├── products/
    │       │   └── route.ts
    │       ├── partners/
    │       │   └── route.ts
    │       └── contact/
    │           └── route.ts
    │
    ├── components/
    │   ├── ui/ ⚠️ (shadcn components)
    │   │   ├── button.tsx
    │   │   ├── input.tsx
    │   │   ├── card.tsx
    │   │   ├── ... (20+ components)
    │   │
    │   ├── layout/ ⚠️
    │   │   ├── Header.tsx
    │   │   ├── Footer.tsx
    │   │   ├── LocaleSwitch.tsx
    │   │   ├── Navigation.tsx
    │   │   └── MobileMenu.tsx
    │   │
    │   ├── sections/ ⚠️
    │   │   ├── Hero.tsx
    │   │   ├── TrustBar.tsx
    │   │   ├── ServiceGrid.tsx
    │   │   ├── ProcessSteps.tsx
    │   │   ├── IndustryGrid.tsx
    │   │   ├── FeatureGrid.tsx
    │   │   ├── TestimonialCarousel.tsx
    │   │   ├── QuoteCTA.tsx
    │   │   ├── PricingExplainer.tsx
    │   │   └── PartnerLogoGrid.tsx
    │   │
    │   ├── cards/ ⚠️
    │   │   ├── ServiceCard.tsx
    │   │   ├── IndustryCard.tsx
    │   │   ├── ProductCard.tsx
    │   │   ├── TestimonialCard.tsx
    │   │   └── BlogPostCard.tsx
    │   │
    │   ├── forms/ ⚠️
    │   │   ├── QuoteForm.tsx
    │   │   ├── DateRangePicker.tsx
    │   │   ├── ContactForm.tsx
    │   │   ├── LoginForm.tsx
    │   │   ├── PartnerForm.tsx
    │   │   └── ProductForm.tsx
    │   │
    │   ├── shop/ ⚠️
    │   │   ├── CartDrawer.tsx
    │   │   ├── CartItem.tsx
    │   │   ├── CheckoutForm.tsx
    │   │   ├── OrderSummary.tsx
    │   │   ├── PaymentMethodSelector.tsx
    │   │   └── OrderConfirmation.tsx
    │   │
    │   ├── products/ ⚠️
    │   │   ├── ProductDetail.tsx
    │   │   ├── ProductGrid.tsx
    │   │   ├── ImageGallery.tsx
    │   │   ├── VariantSelector.tsx
    │   │   └── CompatibilityList.tsx
    │   │
    │   ├── admin/ ⚠️
    │   │   ├── AdminSidebar.tsx
    │   │   ├── DataTable.tsx
    │   │   ├── StatsCard.tsx
    │   │   ├── StatusBadge.tsx
    │   │   ├── BulkActionsBar.tsx
    │   │   ├── FilterBar.tsx
    │   │   ├── SidePanel.tsx
    │   │   ├── ConfirmDialog.tsx
    │   │   ├── Timeline.tsx
    │   │   ├── NotesPanel.tsx
    │   │   ├── ImageUpload.tsx
    │   │   ├── ImageUploadMultiple.tsx
    │   │   ├── VariantManager.tsx
    │   │   ├── QuoteCalendar.tsx
    │   │   ├── QuoteDetail.tsx
    │   │   ├── OrderDetail.tsx
    │   │   ├── SettingsTabs.tsx
    │   │   └── RevenueChart.tsx
    │   │
    │   └── shared/ ⚠️
    │       ├── EmptyState.tsx
    │       ├── LoadingSkeleton.tsx
    │       ├── Breadcrumbs.tsx
    │       ├── Pagination.tsx
    │       └── SearchInput.tsx
    │
    └── lib/
        ├── supabase/
        │   ├── client.ts ✅
        │   ├── server.ts ✅
        │   └── types.ts ✅
        │
        ├── utils/
        │   ├── cn.ts ✅
        │   ├── format.ts ✅
        │   ├── validation.ts ✅
        │   └── constants.ts ✅
        │
        ├── services/ ⚠️
        │   ├── orders.service.ts
        │   ├── payments.service.ts
        │   ├── invoices.service.ts
        │   ├── email.service.ts
        │   ├── products.service.ts
        │   ├── quotes.service.ts
        │   ├── auth.service.ts
        │   └── upload.service.ts
        │
        ├── store/ ⚠️
        │   └── cart.store.ts
        │
        └── email-templates/ ⚠️
            ├── quote-confirmation.html
            ├── quote-notification.html
            ├── order-confirmation.html
            └── offer-sent.html
```

---

## IMPLEMENTATION ORDER (RECOMMENDED)

**Sprint 1 (3 days):** Layouts + Homepage
1. Install shadcn components
2. Create Header, Footer, LocaleSwitch
3. Complete Homepage with all sections
4. Test responsive, deploy

**Sprint 2 (2 days):** Public Pages
1. Services, Industries, Pricing, About pages
2. Partners, FAQ, Contact pages
3. Blog index + article template

**Sprint 3 (3 days):** Quote Funnel
1. QuoteForm component
2. DateRangePicker
3. Quote API route
4. Confirmation page
5. Email service (quote emails)

**Sprint 4 (4 days):** Shop - Products
1. Cart store (Zustand)
2. Product catalog page
3. ProductCard, ProductGrid
4. Product detail page
5. VariantSelector, ImageGallery, CompatibilityList

**Sprint 5 (3 days):** Shop - Cart & Checkout
1. Cart page, CartItem component
2. Checkout form
3. PaymentMethodSelector
4. Orders API route
5. Order confirmation page

**Sprint 6 (2 days):** Payments & Invoices
1. Stripe payment integration
2. Webhook handler
3. Invoice generation service (PDFKit)
4. Email service (order emails)

**Sprint 7 (3 days):** Admin - Core
1. Admin login
2. Admin layout + sidebar
3. Dashboard with stats
4. DataTable component (reusable)

**Sprint 8 (3 days):** Admin - Quotes
1. Quotes list page
2. Quote detail page
3. StatusBadge, Timeline, NotesPanel
4. Calendar view

**Sprint 9 (3 days):** Admin - Products & Partners
1. Partners CRUD
2. Products CRUD
3. VariantManager
4. ImageUpload components

**Sprint 10 (3 days):** Admin - Orders & Settings
1. Orders list + detail
2. Settings page (tabs)
3. Shipping methods management
4. Email templates editing

**Sprint 11 (2 days):** Polish & Testing
1. Loading states everywhere
2. Empty states
3. Error handling
4. Accessibility audit

**Sprint 12 (2 days):** Testing & Deployment
1. E2E tests (Playwright)
2. Performance optimization
3. SEO check
4. Production deployment

**Total: 32 days (~6.5 weeks)**

---

## TESTING STRATEGY

### Unit Tests (Jest)
- **Utilities:** `format.ts`, `validation.ts`
- **Services:** Orders calculation, invoice generation
- **Store:** Cart operations

### E2E Tests (Playwright)
- Quote submission flow
- Product purchase flow (full checkout)
- Admin login and quote management
- Admin product CRUD

### Manual Testing
- All forms with validation
- All responsive breakpoints
- All browsers (Chrome, Firefox, Safari)
- Accessibility (keyboard nav, screen reader)

---

## MONITORING & ANALYTICS (Post-Launch)

### Error Tracking
- Sentry or similar

### Analytics
- Google Analytics 4
- Custom events: Quote submitted, Product added to cart, Order placed

### Performance
- Vercel Analytics (if Vercel deployment)
- Lighthouse CI in GitHub Actions

---

## DEPLOYMENT CHECKLIST

Before production launch:

- [ ] All environment variables set in production
- [ ] Database migrations run on production Supabase
- [ ] Seed data added (partners, FAQs, products)
- [ ] Stripe webhook endpoint configured
- [ ] SMTP email tested
- [ ] Domain configured (DNS)
- [ ] SSL certificate active
- [ ] All legal pages published (GDPR, Terms, Privacy)
- [ ] Sitemap.xml generated
- [ ] robots.txt configured
- [ ] 404/500 error pages tested
- [ ] Performance: Lighthouse score > 90
- [ ] Accessibility: WCAG 2.1 AA compliance
- [ ] SEO: All meta tags, OG images set
- [ ] Backup strategy in place (database, storage)
- [ ] Monitoring active (Sentry, Analytics)

---

**End of Implementation Map**

All design specifications are now mapped to concrete Next.js file structure. Follow the implementation order for systematic development. Refer to other design documents (PAGE_SPECIFICATIONS.md, COMPONENT_LIBRARY.md, etc.) for detailed component requirements.
