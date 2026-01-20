# Page Specifications - Garderobă profesională

## PUBLIC PAGES

### 1. HOME PAGE (`/`)

**Objective:** Convert visitors to quote requests within 30 seconds. Establish trust through partners and clarity.

**Layout Structure:**
1. **Hero Section** (above fold)
2. **Trust Bar** (partner logos)
3. **Services Grid** (3 core services)
4. **How It Works** (3-step process)
5. **Industries We Serve** (6 use cases)
6. **Safety & Features** (3 differentiators)
7. **Testimonials** (carousel)
8. **Final CTA**
9. **Footer**

**Component Breakdown:**

#### Hero Section
- **Components:** `<Hero variant="home" />`
- **Layout:** Full-width gradient background (primary → secondary), centered content
- **Content:**
  - **H1 (RO):** "Garderobă profesională pentru evenimente de până la 12.000 de participanți"
  - **H1 (EN):** "Professional cloakroom solutions for events up to 12,000 attendees"
  - **Subtitle (RO):** "Sistem complet, rapid și sigur pentru festivaluri, conferințe și evenimente corporate"
  - **Subtitle (EN):** "Complete, fast, and secure system for festivals, conferences, and corporate events"
  - **Primary CTA:** "Cere ofertă gratuită" / "Request Free Quote" → `/cere-oferta`
  - **Secondary CTA:** "Explorează Shop-ul" / "Browse Shop" → `/shop`
  - **Visual:** Hero illustration (SVG) of cloakroom system or event crowd
- **Mobile:** Stack CTAs vertically, reduce heading size
- **States:** CTA buttons have hover scale + shadow

#### Trust Bar (Partner Logos)
- **Components:** `<PartnerLogoGrid variant="compact" />`
- **Content:** 
  - **Heading (RO):** "Au încredere în noi"
  - **Heading (EN):** "Trusted by"
- **Layout:** Horizontal scrolling logos (6-8 partners), grayscale with color on hover
- **Data source:** Fetch from `partners` table where `is_featured = true`
- **Mobile:** Auto-scroll carousel

#### Services Grid
- **Components:** `<ServiceCard />` x3
- **Heading (RO):** "Servicii principale"
- **Heading (EN):** "Core Services"
- **Cards:**
  1. **Garderobă Evenimente** (Event Cloakroom)
     - Icon: `Luggage`
     - Description: "Sisteme complete pentru 100-12.000 participanți"
     - CTA: "Detalii" → `/servicii#garderoba`
  2. **Shop B2B** (B2B Shop)
     - Icon: `ShoppingCart`
     - Description: "Token-uri, echipamente, imprimante termice"
     - CTA: "Vezi produse" → `/shop`
  3. **Consultanță și Setup** (Consulting & Setup)
     - Icon: `Users`
     - Description: "Planificare, instalare, training staff"
     - CTA: "Află mai mult" → `/servicii#consultanta`
- **Layout:** 3 columns desktop, stack mobile
- **States:** Card hover elevates, CTA underlines

#### How It Works (3-Step Process)
- **Components:** `<ProcessSteps steps={3} />`
- **Heading (RO):** "Cum funcționează"
- **Heading (EN):** "How It Works"
- **Steps:**
  1. **Icon:** `Calendar` → "Ceri ofertă" / "Request Quote"
  2. **Icon:** `CheckCircle` → "Primești propunere" / "Receive Proposal"
  3. **Icon:** `Truck` → "Livrăm și instalăm" / "We Deliver & Setup"
- **Layout:** Horizontal timeline on desktop, vertical on mobile
- **Visual:** Dotted line connecting steps

#### Industries We Serve
- **Components:** `<IndustryCard />` x6
- **Heading (RO):** "Industrii deservite"
- **Heading (EN):** "Industries We Serve"
- **Cards:** (2 rows x 3 columns)
  1. Festivaluri (Festivals) - Icon: `Music`
  2. Conferințe (Conferences) - Icon: `Presentation`
  3. Evenimente Corporate (Corporate Events) - Icon: `Briefcase`
  4. Evenimente Sportive (Sports Events) - Icon: `Trophy`
  5. Expoziții (Exhibitions) - Icon: `Building`
  6. Evenimente Private (Private Events) - Icon: `Users`
- **Layout:** Grid 3 columns → 2 columns tablet → 1 column mobile
- **States:** Hover shows "Află mai mult" overlay

#### Safety & Features (Differentiators)
- **Components:** `<FeatureGrid variant="icon-left" />`
- **Heading (RO):** "De ce Garderobă profesională?"
- **Heading (EN):** "Why Choose Us?"
- **Features:**
  1. **Icon:** `Zap` **Compact** - "Soluții compacte, fără spațiu pierdut"
  2. **Icon:** `Clock` **Speed** - "Check-in și retrieval sub 30 secunde"
  3. **Icon:** `Shield` **Safety** - "Sistem numerotare dual + asigurare"
- **Layout:** 3 columns with large icons, stack on mobile

#### Testimonials
- **Components:** `<TestimonialCarousel />`
- **Data:** Fetch from `testimonials` table where `is_published = true`
- **Card Content:**
  - Quote text
  - Author name + role
  - Company/Event name
  - Avatar (optional)
- **Layout:** Carousel with 1 visible card, auto-advance 5s
- **Navigation:** Dots indicator, prev/next arrows

#### Final CTA Section
- **Components:** `<QuoteCTA variant="full-width" />`
- **Background:** Gradient accent
- **Heading (RO):** "Pregătit să începi?"
- **Heading (EN):** "Ready to Get Started?"
- **Description:** "Cere o ofertă personalizată în mai puțin de 2 minute"
- **CTA:** Large button "Cere ofertă acum" → `/cere-oferta`

**Responsive Behavior:**
- Desktop: All sections visible, grids multi-column
- Tablet: 2-column grids, hero stacks
- Mobile: Single column, compact spacing, sticky CTA button

**Loading States:**
- Skeleton for partner logos
- Placeholder cards for services/industries
- Shimmer effect for testimonials

**Empty States:**
- If no partners: Hide trust bar
- If no testimonials: Show generic trust message

**SEO:**
- Title: "Garderobă profesională | Sisteme cloakroom pentru evenimente"
- Description: "Soluții complete de garderobă pentru festivaluri, conferințe și evenimente. Token-uri, echipamente, instalare. Cere ofertă gratuită."
- Schema.org: Organization + LocalBusiness markup

---

### 2. SERVICES PAGE (`/servicii` | `/services`)

**Objective:** Detail service offerings, build confidence in expertise, drive to quote form.

**Layout Structure:**
1. Page Hero (H1 + intro)
2. Service Details (3 main services expanded)
3. Service Packages (Optional tiers without prices)
4. Process Timeline
5. Add-ons Grid
6. CTA

**Service Details (Accordion or Tabs):**

**Tab 1: Garderobă Evenimente**
- **Icon:** `Luggage`
- **Description:** Complete cloakroom systems for 100-12,000 attendees
- **Includes:**
  - Numbered token system (dual-number security)
  - Staff training
  - Mobile counters
  - Hangers and racks
  - Insurance coordination
- **Best for:** Festivals, conferences, sports events
- **CTA:** "Configurează pentru evenimentul tău"

**Tab 2: Shop B2B**
- **Icon:** `ShoppingCart`
- **Products:**
  - Numbered tokens (5 colors)
  - Thermal printers
  - Label rolls
  - Barriers and racks
- **Delivery:** 2-5 days Romania-wide
- **CTA:** "Explorează catalogul"

**Tab 3: Consultanță**
- **Icon:** `Users`
- **Services:**
  - Space planning
  - Workflow optimization
  - Staff scheduling
  - Risk assessment
- **CTA:** "Rezervă consultanță"

**Component:** `<Tabs>` from shadcn/ui with rich content per tab

**Responsive:** Tabs become accordion on mobile

---

### 3. INDUSTRIES PAGE (`/industrii` | `/industries`)

**Objective:** Show relevance to specific event types, provide social proof.

**Layout:**
1. Hero: "Experiență în toate tipurile de evenimente"
2. Industry Cards (6) with case study snippets
3. CTA

**Industry Cards:**
- Image placeholder (event type illustration)
- Industry name
- Brief description (2-3 lines)
- "Tipic 500-5000 participanți" range
- Link: "Vezi detalii" → expands inline or navigates to anchor

**Data:** Static content or from `content_blocks` table

---

### 4. PRICING PAGE (`/preturi` | `/pricing`)

**Objective:** Explain pricing model WITHOUT showing numbers. Set expectation that pricing is custom.

**Layout:**
1. Hero: "Prețuri transparente, adaptate evenimentului tău"
2. Pricing Explainer Blocks (3)
3. What Influences Price (Accordion)
4. CTA: "Cere ofertă personalizată"

**Explainer Blocks:**
1. **Dimensiune eveniment** - Icon: `Users`
   - "De la 100 la 12.000 participanți"
2. **Servicii incluse** - Icon: `Package`
   - "Token-uri, staff, echipamente, training"
3. **Durată și logistică** - Icon: `Clock`
   - "Eventos de o zi sau multi-zi, livrare setup"

**What Influences Price (Accordion):**
- Număr de participanți așteptați
- Durata evenimentului
- Distanța de livrare
- Servicii suplimentare (VIP lounge, bag check)
- Asigurare bagaje

**Component:** `<AccordionItem />` from shadcn/ui

---

### 5. ABOUT PAGE (`/despre` | `/about`)

**Objective:** Build trust through company story, values, team (optional).

**Layout:**
1. Hero: Company mission statement
2. Story blocks (timeline or prose)
3. Values grid (3-4 values)
4. Team section (optional, can be generic)
5. CTA

**Microcopy:**
- **RO:** "Suntem o echipă de profesioniști dedicați siguranței și eficienței la evenimente"
- **EN:** "We're a team of professionals dedicated to safety and efficiency at events"

---

### 6. PARTNERS PAGE (`/parteneri` | `/partners`)

**Objective:** Showcase social proof, build credibility.

**Layout:**
1. Hero: "Partenerii noștri"
2. Partner Grid (logo + name + description)
3. Stats (optional): "50+ evenimente", "100,000+ participanți serviți"
4. CTA: "Devino partener"

**Partner Card:**
- Logo (from `partners.logo_url`)
- Name
- Type (festival, venue, corporate)
- Short description
- Website link (external)

**Data:** Fetch from `partners` table, filterable by `partner_type`

**Empty State:** "Adăugăm în curând parteneri noi"

---

### 7. FAQ PAGE (`/intrebari` | `/faq`)

**Objective:** Answer common questions, reduce friction to quote request.

**Layout:**
1. Hero: "Întrebări frecvente"
2. Search box (filters accordions)
3. Accordion list (categories: General, Prețuri, Livrare, Siguranță)

**Data:** Fetch from `faqs` table where `is_published = true`, grouped by `category`

**Component:** `<Accordion type="single" collapsible />`

**Empty State:** "Momentan nu avem întrebări. Contactează-ne direct."

---

### 8. CONTACT PAGE (`/contact`)

**Objective:** Provide multiple contact methods, capture leads via form.

**Layout:**
1. Hero: "Contactează-ne"
2. Two columns:
   - **Left:** Contact form
   - **Right:** Contact info (phone, email, address) + Map embed (optional)

**Contact Form Fields:**
- Nume complet* (Full name)
- Email*
- Telefon* (Phone)
- Subiect (Subject) - dropdown
- Mesaj* (Message) - textarea
- [Submit] "Trimite mesaj"

**Validation:**
- Email format
- Phone format (RO: +40...)
- Min message length: 10 chars

**Success:** Toast + form reset + "Vă vom răspunde în 24h"
**Error:** Inline field errors + toast

**Component:** `<ContactForm />`

---

### 9. BLOG INDEX (`/blog`)

**Objective:** SEO content, thought leadership.

**Layout:**
1. Hero: "Blog & Resurse"
2. Featured post (large card)
3. Grid of recent posts (3 columns)
4. Pagination

**Post Card:**
- Thumbnail image
- Category badge
- Title
- Excerpt (2 lines)
- Date + read time
- Author (optional)
- Link: "Citește mai mult"

**Data:** Fetch from `blog_posts` table where `is_published = true`, ordered by `published_at DESC`

**Empty State:** "Articole în curând"

---

### 10. BLOG ARTICLE (`/blog/[slug]`)

**Layout:**
1. Hero: Title + meta (date, author, category)
2. Featured image
3. Article content (prose styling)
4. Related articles (3)
5. CTA: "Cere ofertă" sticky bottom bar

**Content Rendering:** Use `.prose-custom` class for rich text

**SEO:** 
- Dynamic title: "{article.title} | Blog"
- Description: {article.excerpt}
- Schema.org: Article markup

---

### 11. LEGAL PAGES (`/gdpr`, `/termeni`, `/confidentialitate`)

**Layout:**
1. Hero: Page title
2. Last updated date
3. Prose content (long-form text)
4. Table of contents (sticky sidebar desktop)

**Data:** Fetch from `legal_pages` table by `slug`

**Styling:** Use `.prose-custom` with max-width 768px

---

## QUOTE FUNNEL

### 12. QUOTE REQUEST PAGE (`/cere-oferta` | `/request-quote`)

**Decision: SINGLE PAGE FORM (justified below)**

**Objective:** Capture qualified leads with minimal friction. Collect enough info to provide accurate quote.

**Why Single Page vs. Stepper:**
- **Pros Single Page:**
  - Lower abandonment (no multi-step commitment perception)
  - Faster completion (all fields visible, can skip around)
  - Mobile-friendly (no state management between steps)
  - Easier validation (see all errors at once)
- **Cons Stepper:**
  - More dev complexity (state management)
  - Potential abandonment between steps
  - Harder to correct previous step info

**Layout:**
1. Hero: "Cere ofertă gratuită"
2. Form (single page, grouped sections)
3. Progress indicator (optional: scroll-based)

**Form Sections:**

#### Section 1: Despre Eveniment (Event Details)
- **Tip eveniment*** (Event type) - Select dropdown
  - Opțiuni: Festival, Conferință, Corporate, Sportiv, Expoziție, Privat, Altele
- **Data eveniment*** - DateRangePicker component
  - Start date + end date
- **Număr estimat participanți*** - Number input with range slider
  - Slider: 100 - 12,000
- **Locație*** - Text input (city/venue)
- **Descriere eveniment** - Textarea (optional, 500 chars max)

#### Section 2: Servicii Necesare (Services Needed)
- **Checkboxes** (multi-select):
  - ☐ Garderobă standard
  - ☐ VIP Lounge cloakroom
  - ☐ Backstage storage
  - ☐ Bag check & screening
  - ☐ Lost & Found management
  - ☐ Instalare și training staff
  - ☐ Altele (free text input appears)

#### Section 3: Datele Tale (Contact Info)
- **Nume complet*** - Text input
- **Email*** - Email input
- **Telefon*** - Phone input (format: +40...)
- **Companie** - Text input (optional)
- **Funcție** - Text input (optional, e.g., "Event Manager")
- **Honeypot field** (hidden, spam protection)

#### Section 4: Preferințe (Preferences - optional)
- **Buget estimativ** - Select
  - Sub 5.000 RON
  - 5.000 - 15.000 RON
  - 15.000 - 30.000 RON
  - Peste 30.000 RON
  - Prefer să nu specific
- **Cum ai auzit de noi?** - Select (referral tracking)
  - Google, Facebook, Recomandare, Partener, Altele

**Submit Button:** "Trimite cererea" (large, primary)

**Validation:**
- Real-time on blur for each field
- Summary error alert at top if submission fails
- Required fields marked with *
- Honeypot check (if filled, reject silently)

**Success Flow:**
1. Form submits → POST `/api/quotes`
2. Redirect to `/cere-oferta/confirmare`
3. Email sent to user (confirmation) and admin (new quote alert)

**Component:** `<QuoteForm />`

---

### 13. QUOTE CONFIRMATION PAGE (`/cere-oferta/confirmare`)

**Layout:**
1. Success icon (CheckCircle, large, animated)
2. Heading: "Cererea ta a fost primită!"
3. Message: "Îți vom trimite o ofertă personalizată în maximum 24 de ore la {email}"
4. Next steps (numbered list)
5. CTA: "Înapoi la Home" or "Explorează Shop-ul"

**Next Steps:**
1. Verifică email-ul pentru confirmare
2. Așteptă oferta noastră (max 24h)
3. Aprobă oferta și confirmă rezervarea

**Microcopy (EN):**
- Heading: "Your quote request has been received!"
- Message: "We'll send you a personalized quote within 24 hours at {email}"

---

## SHOP PAGES

### 14. SHOP CATALOG (`/shop`)

**Objective:** B2B product discovery, quick add to cart, filter by compatibility.

**Layout:**
1. Hero: "Shop produse garderobă"
2. Filters sidebar (left, collapsible on mobile)
3. Product grid (right, 3 columns desktop)
4. Pagination

**Filters:**
- **Categorie** (Category) - Checkboxes
  - Token-uri
  - Imprimante
  - Accesorii
  - Rack-uri
  - Bariere
- **Disponibilitate** - Radio
  - În stoc
  - Pre-comandă
- **Preț** - Range slider (RON)
- **Sortare** - Dropdown
  - Cele mai noi
  - Preț crescător
  - Preț descrescător
  - Nume A-Z

**Product Card:**
- Image (fallback to placeholder)
- Category badge
- Product name
- Variant info: "3 variante" or "De la X RON"
- Stock badge: "În stoc" (green) or "La comandă" (warning)
- Quick view button (eye icon) → opens product modal
- CTA: "Vezi detalii"

**Responsive:**
- Mobile: Filters in bottom sheet (icon trigger)
- Product grid: 3 cols → 2 cols → 1 col

**Empty State:**
- "Niciun produs nu corespunde filtrelor tale"
- Clear filters button

**Loading:** Skeleton cards (12)

**Component:** `<ProductGrid />`, `<ProductCard />`

---

### 15. PRODUCT DETAIL PAGE (`/shop/[slug]`)

**Objective:** Show all product info, variants, compatibility, drive add to cart.

**Layout:**
1. Breadcrumbs
2. Two columns:
   - **Left:** Image gallery (main + thumbnails)
   - **Right:** Product info + variant selector + CTA
3. Full-width tabs:
   - Descriere (Description)
   - Specificații (Specs)
   - Compatibilitate (Compatibility)
   - Livrare (Shipping info)

**Product Info (Right Column):**
- Category badge
- Product name (H1)
- SKU: "SKU: TOK-001"
- Price (changes with variant)
- Stock status badge
- Variant selector (dropdown or radio buttons for color/size/pack)
- Quantity input (number, min 1)
- **CTAs:**
  - "Adaugă în coș" (primary) → adds to cart + toast
  - "Cumpără acum" (secondary) → add to cart + redirect to checkout

**Image Gallery:**
- Main image (large, zoomable on hover)
- Thumbnail strip (4-6 images) below
- Lightbox on click

**Tabs Content:**

**Descriere:**
- Full product description (prose)
- Features list (bullets)

**Specificații:**
- Table: Material, Dimensiuni, Greutate, etc.

**Compatibilitate:**
- List of compatible products (links)
- E.g., "Compatibil cu: Imprimantă Thermala X200"

**Livrare:**
- Shipping methods (from settings)
- Estimated delivery time
- Free shipping threshold info

**Responsive:**
- Mobile: Stack columns (gallery top, info below)
- Tabs become accordion

**Related Products:** Below tabs, "Produse similare" (4 cards)

**Component:** `<ProductDetail />`, `<VariantSelector />`, `<ImageGallery />`

---

### 16. CART PAGE (`/shop/cos` | `/shop/cart`)

**Objective:** Review items, update quantities, proceed to checkout.

**Layout:**
1. Heading: "Coșul tău"
2. Two columns:
   - **Left:** Cart items list
   - **Right:** Order summary (sticky)

**Cart Item Card:**
- Product image (small)
- Product name + variant
- SKU
- Unit price
- Quantity selector (- [input] +)
- Subtotal
- Remove button (X icon or trash icon)

**Order Summary (Right):**
- Subtotal: X RON
- Shipping: "Calculat la checkout" or amount
- Tax (TVA 19%): X RON
- **Total: X RON** (bold, large)
- CTA: "Finalizează comanda" → `/shop/checkout`
- Link: "Continuă cumpărăturile" → `/shop`

**Empty Cart State:**
- Icon: Empty shopping bag
- Message: "Coșul tău este gol"
- CTA: "Explorează produsele"

**Responsive:** Stack columns on mobile (summary at bottom)

**Component:** `<CartPage />`, `<CartItem />`, `<OrderSummary />`

---

### 17. CHECKOUT PAGE (`/shop/checkout`)

**Objective:** Collect billing/shipping, select payment, place order.

**Layout:**
1. Breadcrumbs: Shop / Cart / Checkout
2. Two columns:
   - **Left:** Checkout form (multi-section)
   - **Right:** Order summary (sticky, matches cart)

**Checkout Form Sections:**

#### 1. Date de facturare (Billing Details)
- **Firmă sau persoană fizică?** - Radio toggle
  - Firmă → show CUI, Nume firmă, Reg Com
  - Persoană fizică → show CNP
- **Nume complet*** - Text
- **Email*** - Email
- **Telefon*** - Phone
- **Adresă*** - Text
- **Oraș*** - Text
- **Județ*** - Select dropdown
- **Cod poștal*** - Text

#### 2. Adresă de livrare (Shipping Address)
- Checkbox: "☑ Aceeași cu adresa de facturare"
- If unchecked, repeat address fields

#### 3. Metodă de livrare (Shipping Method)
- Radio buttons:
  - Curier rapid (2-3 zile) - X RON
  - Curier standard (3-5 zile) - Y RON
  - Ridicare personală - Gratuit
- If eligible for free shipping: Badge "Livrare gratuită!"

#### 4. Metodă de plată (Payment Method)
- Radio buttons:
  - 💳 Card bancar (Stripe) - "Securizat prin Stripe"
  - 📦 Ramburs (Cash on Delivery) - "+15 RON"
  - 🏦 Transfer bancar (Bank Transfer) - "Confirmare în 1-2 zile"

**If Stripe selected:**
- Stripe Elements embed (card input)
- Powered by Stripe badge

**If Bank Transfer selected:**
- Show bank details (IBAN, SWIFT, recipient)
- "Detalii plată în email de confirmare"

#### 5. Notă comandă (Order Notes - optional)
- Textarea: "Instrucțiuni speciale de livrare"

**Submit Button:** "Plasează comanda" (large, primary, disabled until validation passes)

**Terms Checkbox:** "☐ Accept Termenii și condițiile*"

**Validation:**
- Real-time per field
- Payment method required
- Terms acceptance required
- If Stripe: Card validation from Stripe Elements

**Success Flow:**
1. POST `/api/orders` (creates order + payment intent if card)
2. If Stripe: Confirm payment → redirect on success
3. If COD/Bank: Create order immediately
4. Redirect to `/shop/order/[id]` confirmation page

**Error Handling:**
- Payment failure: Show alert, allow retry
- Validation errors: Scroll to first error, highlight fields

**Component:** `<CheckoutForm />`, `<PaymentMethodSelector />`

---

### 18. ORDER CONFIRMATION PAGE (`/shop/order/[id]`)

**Objective:** Confirm order placed, provide order details, next steps.

**Layout:**
1. Success icon + heading: "Comanda ta a fost plasată!"
2. Order summary card:
   - Order number: "ORD-2026-123"
   - Date: "20 ianuarie 2026"
   - Total: X RON
   - Payment status: Badge (Plătit / În așteptare / Confirmare)
   - Shipping status: Badge (În pregătire)
3. Order items list (products ordered)
4. Billing & shipping info
5. Next steps
6. CTAs: "Descarcă factură" (if available), "Înapoi la Shop"

**Next Steps (varies by payment method):**
- **Card:** "Comanda este în pregătire. Vei primi email cu tracking."
- **COD:** "Plată la livrare. Pregătește suma de X RON."
- **Bank Transfer:** "Transferă suma de X RON la IBAN: ... Vei primi confirmare după recepționarea plății."

**Component:** `<OrderConfirmation />`

---

## ADMIN PAGES

### 19. ADMIN LOGIN PAGE (`/admin/login`)

**Objective:** Secure authentication for admin users.

**Layout:**
1. Centered card (max-width 400px)
2. Logo + heading: "Autentificare Admin"
3. Login form:
   - Email*
   - Parolă* (with show/hide toggle)
   - Checkbox: "Ține-mă minte"
   - Submit: "Autentifică-te"
4. Link: "Ai uitat parola?" (optional, future)

**Validation:**
- Email format
- Password min 8 chars

**Auth Flow:**
- POST to Supabase Auth
- On success: Redirect to `/admin`
- On error: Show "Email sau parolă incorectă"

**Component:** `<LoginForm />`

---

### 20. ADMIN DASHBOARD (`/admin`)

**Objective:** High-level overview, quick access to key metrics and actions.

**Layout:**
1. Page heading: "Dashboard"
2. Stats cards row (4 cards)
3. Two columns:
   - **Left (60%):** Recent quotes table + Recent orders table
   - **Right (40%):** Charts (revenue, quote statuses)

**Stats Cards:**
1. **Cereri ofertă noi** - Count (last 7 days) + trend arrow
2. **Comenzi astăzi** - Count + total value
3. **Venit luna curentă** - Sum (RON)
4. **Rate conversie quotes** - Percentage (booked / total)

**Recent Quotes Table:**
- Columns: ID, Client, Eveniment, Data, Status, Acțiuni
- Show 5 most recent
- Status badge colored
- Actions: View icon → `/admin/quotes/[id]`
- Link: "Vezi toate" → `/admin/quotes`

**Recent Orders Table:**
- Columns: Număr, Client, Total, Status, Data
- Show 5 most recent
- Link: "Vezi toate" → `/admin/orders`

**Charts (Recharts):**
- **Revenue Chart:** Line chart, last 30 days
- **Quote Status Distribution:** Pie chart

**Component:** `<StatsCard />`, `<DataTable variant="compact" />`, `<RevenueChart />`

---

### 21. ADMIN QUOTES LIST (`/admin/quotes`)

**Objective:** Manage all quote requests, filter, sort, bulk actions.

**Layout:**
1. Page heading: "Cereri ofertă"
2. Action bar:
   - Search input (by client name, email)
   - Filters: Status dropdown, Date range
   - View toggle: [List] [Calendar]
   - Export button: "Exportă CSV"
3. Data table (sortable columns)
4. Pagination

**Table Columns:**
- Checkbox (select for bulk)
- ID (clickable → detail page)
- Client (name + email)
- Eveniment (type + date)
- Participanți (count)
- Status (badge)
- Created (date)
- Acțiuni (dropdown menu)

**Actions Dropdown:**
- 👁 Vezi detalii
- ✏️ Schimbă status
- 📧 Trimite email
- 🗑️ Șterge

**Bulk Actions Bar (appears when items selected):**
- "X selectate"
- Dropdown: "Schimbă status la..."
- Button: "Șterge selectate"

**Filters:**
- Status: All, New, In Review, Offer Sent, Negotiation, Booked, Cancelled
- Date range: Last 7 days, Last 30 days, Custom range

**Empty State:** "Nicio cerere de ofertă încă"

**Component:** `<DataTable />`, `<BulkActionsBar />`, `<FilterBar />`

---

### 22. ADMIN QUOTE DETAIL (`/admin/quotes/[id]`)

**Objective:** View full quote info, update status, add notes, send offer.

**Layout:**
1. Breadcrumbs
2. Heading: "Cerere ofertă #QT-2026-001"
3. Status badge + action buttons row:
   - "Schimbă status" dropdown
   - "Trimite ofertă" button (email)
   - "Generează PDF" button (future)
4. Two columns:
   - **Left (60%):** Quote details tabs
   - **Right (40%):** Timeline + Notes

**Quote Details Tabs:**

**Tab 1: Detalii eveniment**
- Event type
- Date range
- Estimated attendees
- Location
- Description

**Tab 2: Servicii solicitate**
- List of selected services (checkboxes, read-only)

**Tab 3: Date client**
- Full name
- Email (with mailto link)
- Phone (with tel link)
- Company (if provided)
- Role

**Tab 4: Preferințe**
- Budget range
- Referral source

**Timeline (Right Column):**
- Vertical timeline of status changes
- E.g., "Created → In Review → Offer Sent"
- Each entry: timestamp + user who made change

**Notes Section:**
- Textarea: "Adaugă notă internă"
- Submit button
- List of previous notes (by user, timestamp)

**Status Update Modal:**
- Dropdown: Select new status
- Textarea: "Motiv schimbare (opțional)"
- Submit: "Actualizează"

**Component:** `<QuoteDetail />`, `<Timeline />`, `<NotesPanel />`

---

### 23. ADMIN QUOTES CALENDAR VIEW (`/admin/quotes/calendar`)

**Objective:** Visual calendar of all quote event dates.

**Layout:**
1. Calendar header (month/year nav)
2. Full calendar (month view)
3. Legend: Status colors

**Calendar Implementation:**
- Use a library (e.g., FullCalendar, react-big-calendar)
- Each quote appears on its event_date
- Color-coded by status
- Click event → opens quote detail in side panel or navigates to detail page

**Component:** `<QuoteCalendar />`

---

### 24. ADMIN BOOKINGS LIST + DETAIL

**Similar to Quotes**, but focused on confirmed bookings (deal terms, deposits, final invoices).

**Additional fields in Booking Detail:**
- Deal value (RON)
- Deposit amount
- Deposit status
- Final invoice link

---

### 25. ADMIN PARTNERS CRUD

**List View (`/admin/partners`):**
- Table: Logo thumbnail, Name, Type, Website, Status, Actions
- Actions: Edit, Delete
- Button: "+ Adaugă partener"

**Create/Edit Form (`/admin/partners/new` or `/admin/partners/[id]/edit`):**
- Logo upload (Supabase Storage)
- Name*
- Partner type* (Festival, Venue, Corporate, Other)
- Description (textarea)
- Website URL
- Is featured (checkbox - shows on homepage)
- Is published (checkbox)
- Submit: "Salvează"

**Component:** `<PartnerForm />`, `<ImageUpload />`

---

### 26. ADMIN PRODUCTS CRUD

**List View (`/admin/products`):**
- Table: Image, Name, Category, Variants count, Stock status, Actions
- Filters: Category, Stock status
- Button: "+ Adaugă produs"

**Create/Edit Form (`/admin/products/new` or `/admin/products/[id]/edit`):**

**Tab 1: Informații de bază**
- Name*
- Slug (auto-generated, editable)
- Category* (dropdown)
- Description (rich text editor)
- Features (bullet list)
- Is published (toggle)

**Tab 2: Variante (`/admin/products/[id]/variants`)**
- Variants table: SKU, Name, Price, Stock, Actions
- Button: "+ Adaugă variantă"
- Variant form (inline or modal):
  - SKU*
  - Variant name* (e.g., "Roșu - 100 buc")
  - Price* (RON)
  - Stock quantity
  - Is available (toggle)

**Tab 3: Imagini**
- Image upload (multiple)
- Drag-and-drop reorder
- Set primary image

**Tab 4: Compatibilități**
- Multi-select: Other products this product is compatible with

**Tab 5: SEO**
- Meta title
- Meta description

**Component:** `<ProductForm />`, `<VariantManager />`, `<ImageUploadMultiple />`

---

### 27. ADMIN ORDERS LIST + DETAIL

**List View (`/admin/orders`):**
- Table: Order number, Client, Total, Payment status, Order status, Date, Actions
- Filters: Payment status, Order status, Date range
- Export: CSV

**Order Detail (`/admin/orders/[id]`):**

**Layout:**
- Order number + status badges (payment + fulfillment)
- Action buttons: "Schimbă status", "Generează factură", "Trimite email"

**Tabs:**
1. **Produse comandate** - Items table (product, variant, qty, price, subtotal)
2. **Date client** - Billing info + shipping info
3. **Plată** - Payment method, transaction ID, amount, status
4. **Livrare** - Shipping method, tracking number (editable), status
5. **Factură** - Link to invoice PDF (if generated), button "Generează factură"

**Timeline:** Status changes log

**Component:** `<OrderDetail />`, `<InvoiceViewer />`

---

### 28. ADMIN SETTINGS (`/admin/settings`)

**Layout:** Tabs (multi-tab page)

**Tab 1: Identitate companie**
- Company name
- CUI, Reg Com
- Address
- Phone, Email
- Logo upload
- Save button

**Tab 2: Metode de livrare**
- Table: Name, Description, Cost, Free threshold, Is active
- Actions: Edit, Delete
- Button: "+ Adaugă metodă"

**Tab 3: Taxe**
- Default tax rate (%)
- Tax included in prices (toggle)

**Tab 4: Email templates**
- List of templates: Quote confirmation, Order confirmation, Offer sent
- Click to edit: Subject + body (with variables {{name}}, {{orderNumber}})

**Tab 5: Integrări**
- Stripe: API keys, Webhook secret
- SMTP: Host, Port, User, Pass
- Test buttons for each integration

**Component:** `<SettingsTabs />`, `<SettingsForm />`

---

*Continued in next file: COMPONENT_LIBRARY.md*
