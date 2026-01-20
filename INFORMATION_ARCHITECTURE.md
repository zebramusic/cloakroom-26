# Information Architecture - Garderobă profesională

## 1. COMPLETE SITEMAP

### A. PUBLIC SITE
```
/ (Home - RO default)
├── /ro (Romanian - explicit)
│   ├── /servicii (Services)
│   ├── /industrii (Industries/Use Cases)
│   ├── /preturi (Pricing - explanatory)
│   ├── /despre (About)
│   ├── /parteneri (Partners)
│   ├── /shop (Shop)
│   │   ├── /shop/[category] (Category pages)
│   │   ├── /shop/[slug] (Product detail)
│   │   ├── /shop/cos (Cart)
│   │   ├── /shop/checkout (Checkout)
│   │   └── /shop/order/[id] (Order confirmation)
│   ├── /intrebari (FAQs)
│   ├── /contact (Contact)
│   ├── /blog (Blog index)
│   │   └── /blog/[slug] (Blog article)
│   ├── /cere-oferta (Quote request funnel)
│   │   └── /cere-oferta/confirmare (Quote confirmation)
│   ├── /gdpr (GDPR Policy)
│   ├── /termeni (Terms & Conditions)
│   └── /confidentialitate (Privacy Policy)
│
└── /en (English)
    ├── /services
    ├── /industries
    ├── /pricing
    ├── /about
    ├── /partners
    ├── /shop
    │   ├── /shop/[category]
    │   ├── /shop/[slug]
    │   ├── /shop/cart
    │   ├── /shop/checkout
    │   └── /shop/order/[id]
    ├── /faq
    ├── /contact
    ├── /blog
    │   └── /blog/[slug]
    ├── /request-quote
    │   └── /request-quote/confirmation
    ├── /gdpr
    ├── /terms
    └── /privacy
```

### B. ADMIN PANEL
```
/admin (Protected - requires authentication)
├── /admin/login (Login page - public)
├── /admin (Dashboard)
├── /admin/quotes
│   ├── /admin/quotes (List view with filters)
│   ├── /admin/quotes/calendar (Calendar view)
│   └── /admin/quotes/[id] (Quote detail)
├── /admin/bookings
│   ├── /admin/bookings (List view)
│   └── /admin/bookings/[id] (Booking detail with deal terms)
├── /admin/partners
│   ├── /admin/partners (List view)
│   ├── /admin/partners/new (Create partner)
│   └── /admin/partners/[id]/edit (Edit partner)
├── /admin/products
│   ├── /admin/products (List view)
│   ├── /admin/products/new (Create product)
│   ├── /admin/products/[id]/edit (Edit product)
│   └── /admin/products/[id]/variants (Manage variants)
├── /admin/orders
│   ├── /admin/orders (List view)
│   ├── /admin/orders/[id] (Order detail)
│   └── /admin/orders/[id]/invoice (Invoice view/download)
├── /admin/content
│   ├── /admin/content/faqs (FAQs management)
│   ├── /admin/content/blog (Blog posts)
│   ├── /admin/content/legal (Legal pages)
│   └── /admin/content/blocks (Content blocks for home)
├── /admin/users
│   ├── /admin/users (User list)
│   └── /admin/users/[id]/edit (Edit user & roles)
└── /admin/settings
    ├── /admin/settings/company (Company identity)
    ├── /admin/settings/shipping (Shipping methods)
    ├── /admin/settings/tax (Tax configuration)
    ├── /admin/settings/email (Email templates)
    └── /admin/settings/integrations (Stripe, SMTP)
```

### C. API ROUTES
```
/api
├── /api/quotes
│   ├── POST /api/quotes (Create quote)
│   ├── GET /api/quotes (List - admin)
│   ├── GET /api/quotes/[id] (Get quote)
│   └── PATCH /api/quotes/[id] (Update status)
├── /api/orders
│   ├── POST /api/orders (Create order)
│   ├── GET /api/orders (List - admin)
│   └── GET /api/orders/[id] (Get order)
├── /api/payments
│   ├── POST /api/payments/stripe (Create payment intent)
│   └── POST /api/payments/webhook (Stripe webhook)
├── /api/invoices
│   └── GET /api/invoices/[id] (Generate/download PDF)
├── /api/products
│   └── GET /api/products (Public list with filters)
├── /api/partners
│   └── GET /api/partners (Public list)
└── /api/contact
    └── POST /api/contact (Contact form submission)
```

---

## 2. NAVIGATION STRUCTURES

### A. PUBLIC HEADER NAVIGATION

#### Desktop (>1024px)
```
[LOGO] Servicii | Industrii | Prețuri | Despre | Parteneri | Shop | FAQ | Contact | Blog
                                                              [RO/EN] [Cere ofertă →]
```

#### Mobile (<1024px)
```
[☰ Menu] [LOGO]                                     [RO/EN] [Cart Icon]

Mobile Menu (Sheet):
- Cere ofertă (CTA highlighted)
- Servicii
- Industrii  
- Prețuri
- Shop
- FAQ
- Despre
- Parteneri
- Contact
- Blog
- [Separator]
- GDPR
- Termeni
- Confidențialitate
```

**Structure:**
- **Logo:** Left-aligned, links to home
- **Main nav:** Center (desktop) / Drawer (mobile)
- **Actions:** Right-aligned
  - Locale switch (RO/EN dropdown)
  - Cart icon with badge (count)
  - "Cere ofertă" button (primary CTA)

**States:**
- Active page: Underline or bold weight
- Hover: Text color transition to primary
- Mobile: Full-height sheet overlay

**Component:** `<Header />`

---

### B. PUBLIC FOOTER

#### Layout (4 columns on desktop, stacked on mobile)

**Column 1: Brand**
- Logo
- Tagline: "Soluții profesionale de garderobă pentru evenimente"
- Social links (LinkedIn, Facebook, Instagram icons)

**Column 2: Servicii**
- Servicii
- Industrii
- Prețuri
- Cere ofertă

**Column 3: Companie**
- Despre noi
- Parteneri
- Blog
- Contact

**Column 4: Legal & Shop**
- Shop
- FAQ
- GDPR
- Termeni și condiții
- Confidențialitate

**Bottom Bar:**
```
© 2026 Garderobă profesională. CUI: RO12345678 | Toate drepturile rezervate.
```

**Component:** `<Footer />`

---

### C. ADMIN SIDEBAR NAVIGATION

#### Sidebar (Collapsible, left-side)

**Structure:**
```
[Company Logo/Name]

PRINCIPAL
📊 Dashboard                    /admin

VÂNZĂRI
📋 Cereri ofertă               /admin/quotes
  ├─ Listă                    /admin/quotes
  └─ Calendar                 /admin/quotes/calendar
📅 Rezervări                   /admin/bookings
🛒 Comenzi                     /admin/orders

CATALOG
🏢 Parteneri                   /admin/partners
📦 Produse                     /admin/products

CONȚINUT
📝 FAQs                        /admin/content/faqs
✍️ Blog                        /admin/content/blog
⚖️ Pagini legale              /admin/content/legal
🧩 Blocuri conținut           /admin/content/blocks

SISTEM
👥 Utilizatori                 /admin/users
⚙️ Setări                      /admin/settings

[Separator]

👤 [User Avatar]
   [User Name]
   [User Role]
   └─ Profil
   └─ Deconectare
```

**Behavior:**
- Collapsed state: Show icons only (64px width)
- Expanded state: Show icons + text (240px width)
- Active page: Highlighted background + primary text color
- Sub-items: Indent + smaller font
- Sticky scroll position
- Mobile: Overlay drawer (hamburger trigger)

**Component:** `<AdminSidebar />`

---

### D. BREADCRUMBS

**Usage:** Admin pages + Shop + Blog detail pages

**Format:**
```
Home / Shop / Sisteme cloakroom / Token-uri numerotate pentru garderobă
[Icon] [Link] / [Link] / [Link] / [Current Page - no link]
```

**Behavior:**
- Max 4 levels, truncate middle if exceeded
- Mobile: Show only parent + current
- Color: `text-muted-foreground` for links, `text-foreground` for current

**Component:** `<Breadcrumbs />`

---

### E. LOCALE SWITCHER

**Component:** `<LocaleSwitch />`

**Variants:**

**1. Dropdown (Desktop)**
```
[🌐 RO ▼]
  ├─ 🇷🇴 Română (RO)
  └─ 🇬🇧 English (EN)
```

**2. Toggle (Mobile)**
```
[RO | EN]  (segmented control style)
```

**Behavior:**
- Persists route structure (e.g., `/ro/shop` → `/en/shop`)
- Stores preference in cookie
- Shows current language as active
- Minimal, non-intrusive design

---

## 3. URL STRUCTURE RULES

### Conventions
- **Locale prefix:** `/ro/` (default, optional) and `/en/` (required)
- **Slugs:** kebab-case, URL-safe, transliterated
- **IDs:** UUIDs for resources (quotes, orders, products)
- **Pagination:** `?page=2` query param
- **Filters:** `?category=sisteme-cloakroom&sort=price-asc`

### SEO-Friendly Patterns
- Product: `/shop/token-uri-numerotate-garderoba`
- Blog: `/blog/ghid-organizare-eveniment-sigur`
- Category: `/shop/imprimante-termice`

### Admin Patterns
- List: `/admin/quotes`
- Detail: `/admin/quotes/123e4567-e89b-12d3-a456-426614174000`
- Edit: `/admin/products/[id]/edit`
- Create: `/admin/partners/new`

---

## 4. MOBILE NAVIGATION PATTERNS

### Bottom Navigation (Mobile Shop - optional enhancement)
```
[🏠 Home] [🛍️ Shop] [📋 Quote] [👤 Account]
```
- Visible on: Shop pages only
- Fixed bottom position
- Icon + label
- Active state highlighted

### Pull-to-Refresh
- Enabled on: Admin lists, shop catalog, blog index
- Shows loading spinner at top
- Refreshes data without full page reload

### Swipe Gestures
- **Admin cards:** Swipe left reveals quick actions (Edit, Delete, Status)
- **Cart items:** Swipe left to remove
- **Gallery images:** Swipe left/right to navigate
