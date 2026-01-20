# UX Flows & User Journeys

## FLOW 1: PUBLIC VISITOR → QUOTE REQUEST

**User Goal:** Request a quote for an upcoming event

**Entry Points:**
- Homepage hero CTA: "Cere ofertă gratuită"
- Header navigation button (always visible)
- Footer links
- End of Services/Industries pages
- Floating CTA on mobile

**Flow Steps:**

### Step 1: Landing (Homepage or other)
**Screen:** Any public page  
**User sees:**
- Clear value proposition
- Partner logos (trust signals)
- CTA button prominently placed

**Actions:**
- Clicks "Cere ofertă" button
- **Navigates to:** `/cere-oferta`

### Step 2: Quote Request Form
**Screen:** `/cere-oferta`  
**User sees:**
- Single-page form with 4 sections
- Progress indicator (optional scroll-based)
- Clear field labels (RO/EN)
- Inline help text for complex fields

**Actions:**
1. **Despre Eveniment section:**
   - Selects event type from dropdown
   - Chooses date range via DateRangePicker
   - Enters estimated attendee count (slider + input)
   - Enters location (city/venue)
   - Optionally adds event description

2. **Servicii Necesare section:**
   - Checks desired services (multi-select checkboxes)
   - If "Altele" checked, text input appears

3. **Datele Tale section:**
   - Fills personal info (name, email, phone)
   - Optionally adds company name and role
   - (Honeypot field remains empty - hidden from user)

4. **Preferințe section (optional):**
   - Selects budget range (or "Prefer să nu specific")
   - Selects referral source

**Validation:**
- Real-time validation on blur
- Required fields marked with *
- Errors shown inline below fields
- If form invalid on submit, scroll to first error

**Actions:**
- Clicks "Trimite cererea" button
- **Submits to:** POST `/api/quotes`

### Step 3: Processing
**Screen:** Loading state (spinner on button or full-screen)  
**Backend actions:**
1. Validates all fields server-side
2. Checks honeypot (if filled, reject silently)
3. Inserts quote to database (quotes table)
4. Sends confirmation email to user
5. Sends notification email to admin
6. Returns success response

**Error handling:**
- If validation fails: Show errors, user corrects
- If server error: Toast "A apărut o eroare. Te rugăm să încerci din nou."
- User can retry without losing data (form persists)

### Step 4: Confirmation
**Screen:** `/cere-ofertă/confirmare`  
**User sees:**
- Large success icon (animated checkmark)
- Heading: "Cererea ta a fost primită!"
- Message: "Îți vom trimite o ofertă personalizată în maximum 24 de ore la {email}"
- Numbered list of next steps
- CTA options: "Înapoi la Home" or "Explorează Shop-ul"

**User feels:** Confident that request was received, knows what happens next

**Exit actions:**
- Navigates to homepage or shop
- Checks email for confirmation (immediate)
- Waits for offer (within 24h)

---

## FLOW 2: QUOTE LIFECYCLE (ADMIN PERSPECTIVE)

**Admin Goal:** Convert quote request into confirmed booking

### Step 1: New Quote Alert
**Trigger:** User submits quote form  
**Admin receives:** Email notification "Cerere nouă de ofertă #QT-2026-123"

**Actions:**
- Clicks email link → `/admin/quotes/[id]`
- Or checks admin dashboard → sees new quote in "Cereri recente"

### Step 2: Quote Review
**Screen:** `/admin/quotes/[id]`  
**Admin sees:**
- All quote details (event info, services, client contact)
- Status: "New" (blue badge)
- Timeline: Single entry "Created"
- Empty notes section

**Actions:**
1. Reviews event requirements
2. Checks availability (calendar view)
3. Calculates pricing (external tool or mentally)
4. Changes status to "In Review" via dropdown
5. Adds internal note: "Verificat disponibilitate - OK"

**Status update:**
- Modal appears: "Schimbă status la..."
- Selects "In Review"
- Optionally adds reason
- Clicks "Actualizează"
- Timeline updates with new entry

### Step 3: Send Offer
**Admin actions:**
1. Prepares offer document (PDF) externally or in system (future)
2. Changes status to "Offer Sent"
3. Sends email to client with offer attached
   - Uses "Trimite ofertă" button in admin
   - Email template pre-filled with client name, quote number
   - Admin can customize message
   - Attaches PDF
4. Timeline updates: "Offer sent by {admin_name}"

**Client receives:** Email with offer details, pricing, terms

### Step 4: Negotiation (if needed)
**Client responds:** Emails back with questions or requests changes

**Admin actions:**
1. Updates status to "Negotiation"
2. Adds note with client feedback: "Client solicită reducere 10%"
3. Discusses internally
4. Sends revised offer
5. Continues email communication

**Status remains:** "Negotiation" until client accepts

### Step 5: Booking Confirmation
**Client accepts:** Emails confirmation or signs contract

**Admin actions:**
1. Changes status to "Booked" (green badge)
2. Creates booking entry (converts quote → booking)
   - `/admin/bookings/new` (pre-filled from quote)
   - Adds deal value, deposit amount, terms
3. Sends confirmation email to client
4. Plans logistics (assigns staff, schedules delivery)

**Database:**
- Quote status: "Booked"
- New booking record created (linked to quote)
- Timeline: "Booking confirmed"

### Step 6: Event Execution & Completion
**After event:**
1. Admin changes booking status to "Completed"
2. Invoice generated (if not already)
3. Optionally requests testimonial from client
4. Quote/booking archived

**Quote lifecycle complete**

---

## FLOW 3: SHOP PURCHASE (END-TO-END)

**User Goal:** Buy cloakroom equipment (B2B purchase)

### Step 1: Product Discovery
**Entry points:**
- Homepage: "Explorează Shop-ul" CTA
- Header navigation: "Shop" link
- Services page: "Vezi produse" links

**Screen:** `/shop`  
**User sees:**
- Product grid (3 columns)
- Filters sidebar (category, price, stock)
- Sort dropdown

**Actions:**
1. Browses products
2. Applies filters (e.g., "Token-uri" category)
3. Clicks product card → `/shop/[slug]`

### Step 2: Product Detail Review
**Screen:** `/shop/token-uri-numerotate`  
**User sees:**
- Product images (gallery)
- Product name, SKU, price
- Stock status: "În stoc"
- Variant selector (e.g., color dropdown: "Roșu - 100 buc")
- Description tabs (Descriere, Specificații, Compatibilitate)
- Related products

**Actions:**
1. Selects variant: "Albastru - 500 buc"
   - Price updates to variant price
2. Checks compatibility: "Compatibil cu Imprimantă Thermala X200"
3. Sets quantity: 2 packs
4. Clicks "Adaugă în coș"

**System response:**
- Toast: "Produs adăugat în coș" (success)
- Cart icon badge updates: Shows "2 produse"
- User stays on product page (can continue shopping)

### Step 3: Continue Shopping or View Cart
**Option A:** Continue shopping
- User clicks "Shop" in header
- Repeats Steps 1-2 for another product

**Option B:** View cart
- User clicks cart icon in header
- **Navigates to:** `/shop/cos`

### Step 4: Cart Review
**Screen:** `/shop/cos`  
**User sees:**
- List of cart items (2 products)
  - Each item: image, name, variant, quantity selector, price, subtotal
- Order summary (right column):
  - Subtotal: 1.298 RON
  - Shipping: "Calculat la checkout"
  - Total: 1.298 RON (before shipping)
- CTA: "Finalizează comanda"

**Actions:**
1. Reviews items
2. Updates quantity of one item (- button, changes from 2 to 1)
   - Price recalculates immediately
3. Removes one item (trash icon)
   - Confirmation dialog: "Sigur vrei să ștergi?"
   - Clicks "Da"
   - Item removed, totals update
4. Clicks "Finalizează comanda"
   - **Navigates to:** `/shop/checkout`

### Step 5: Checkout
**Screen:** `/shop/checkout`  
**User sees:**
- Left column: Multi-section form
- Right column: Order summary (sticky)

**Actions:**
1. **Date de facturare:**
   - Toggles "Firmă" radio button (B2B user)
   - Fills: Nume firmă*, CUI*, Reg Com*, Adresă*, Contact name*, Email*, Phone*
2. **Adresă de livrare:**
   - Checks "☑ Aceeași cu adresa de facturare"
3. **Metodă de livrare:**
   - Selects "Curier rapid (2-3 zile) - 49 RON"
   - Order summary updates: Shipping = 49 RON, Total = 698 RON
4. **Metodă de plată:**
   - Selects "💳 Card bancar (Stripe)"
   - Stripe Elements card input appears
   - Enters card details (test mode: 4242 4242 4242 4242, 12/34, 123)
5. **Notă comandă (optional):**
   - Adds: "Vă rog livrați între 9-12"
6. **Terms acceptance:**
   - Checks "☐ Accept Termenii și condițiile*"
7. Clicks "Plasează comanda"

**Validation:**
- All required fields validated
- Card validation via Stripe
- If invalid: Inline errors shown, button remains enabled

### Step 6: Payment Processing
**Loading state:** Button shows spinner "Se procesează..."

**Backend actions:**
1. Creates order in database (orders + order_items tables)
2. Creates Stripe PaymentIntent
3. Confirms payment via Stripe API
4. On success: Updates order.payment_status = 'paid'
5. Sends order confirmation email (with invoice PDF)
6. Returns order_id

**Error handling:**
- Payment declined: Toast "Card refuzat. Verifică datele și încearcă din nou."
- User can retry with same or different card
- Server error: Toast with support contact

### Step 7: Order Confirmation
**Screen:** `/shop/order/[id]`  
**User sees:**
- Success icon (animated)
- Heading: "Comanda ta a fost plasată!"
- Order summary card:
  - Order number: ORD-2026-456
  - Date: 20 ianuarie 2026
  - Total: 698 RON
  - Payment status: "Plătit" (green badge)
  - Shipping status: "În pregătire" (yellow badge)
- Order items list
- Billing & shipping addresses
- Next steps:
  - "Comanda este în pregătire"
  - "Vei primi email cu AWB în 24h"
  - "Livrare estimată: 22-23 ianuarie"
- CTAs:
  - "Descarcă factură" → PDF download
  - "Înapoi la Shop"

**Email sent:** Order confirmation with invoice attached

**User feels:** Confident order is processed, knows delivery timeline

### Step 8: Post-Purchase
**After order placed:**
1. Admin processes order (admin flow, not shown)
2. Admin updates shipping status, adds tracking number
3. Customer receives email: "Comanda ta a fost expediată - Track: ABC123XYZ"
4. Customer clicks tracking link (external courier site)
5. Receives package
6. Admin marks order as "Delivered"
7. Optionally, customer receives feedback request email

---

## FLOW 4: ADMIN PARTNER MANAGEMENT

**Admin Goal:** Add a new festival partner to showcase on homepage

### Step 1: Navigate to Partners
**Screen:** `/admin`  
**Actions:**
- Clicks "Parteneri" in sidebar
- **Navigates to:** `/admin/partners`

### Step 2: Partners List
**Screen:** `/admin/partners`  
**Admin sees:**
- Table of existing partners (logo thumbnail, name, type, status)
- Button: "+ Adaugă partener"

**Actions:**
- Clicks "+ Adaugă partener"
- **Navigates to:** `/admin/partners/new`

### Step 3: Create Partner Form
**Screen:** `/admin/partners/new`  
**Admin sees:** Form with fields

**Actions:**
1. **Logo upload:**
   - Drags & drops logo file (PNG, 500KB)
   - Preview appears
   - Upload completes → URL saved
2. **Fills fields:**
   - Name: "Festival Electric Castle"
   - Partner type: "Festival" (dropdown)
   - Description: "Festival internațional de muzică și arte"
   - Website: "https://electriccastle.ro"
3. **Toggles:**
   - ☑ Is featured (will show on homepage)
   - ☑ Is published
4. Clicks "Salvează"

**Validation:**
- Name required
- Logo required
- Partner type required
- Website must be valid URL

**Backend:**
- Inserts to `partners` table
- Revalidates homepage cache (if using ISR)

### Step 4: Success & Verification
**After save:**
- Toast: "Partener adăugat cu succes"
- Redirects to `/admin/partners` (list view)
- New partner appears in table

**Admin verifies:**
- Opens homepage (in new tab)
- Scrolls to "Au încredere în noi" section
- Sees new partner logo (grayscale, hovers → color)

**Partner now public** on homepage

### Step 5: Edit Partner (if needed)
**Actions:**
- From partners list, clicks "Edit" icon
- **Navigates to:** `/admin/partners/[id]/edit`
- Makes changes (e.g., updates logo, changes description)
- Clicks "Salvează"
- Changes reflected on frontend

**Delete Partner:**
- From list, clicks "Delete" icon
- Confirmation dialog: "Sigur vrei să ștergi? Această acțiune este permanentă."
- Clicks "Da, șterge"
- Partner removed from database and homepage

---

## FLOW 5: PAYMENT FAILURE & RECOVERY

**Scenario:** User's card is declined during checkout

### Failure Point: Step 6 of Shop Purchase Flow
**Screen:** `/shop/checkout`  
**User clicks:** "Plasează comanda"

**System attempts:**
- Creates order (status: 'pending')
- Creates Stripe PaymentIntent
- Stripe returns error: "Card declined - insufficient funds"

**User sees:**
- Button stops spinning
- Alert (red) appears at top of form:
  - "Plata a eșuat: Card refuzat - fonduri insuficiente"
  - "Te rugăm să verifici datele cardului sau să folosești o altă metodă de plată."

**Actions:**
1. **Option A: Retry with same card**
   - User double-checks card details
   - Clicks "Plasează comanda" again
   - If still fails: Same error shown

2. **Option B: Change payment method**
   - User selects "📦 Ramburs (COD)" radio button
   - Stripe card input disappears
   - COD fee added (+15 RON)
   - Order total updates
   - Clicks "Plasează comanda"
   - **Success:** Order created with payment_method = 'cod', payment_status = 'pending'
   - Redirects to confirmation page

3. **Option C: Change card**
   - User enters different card number
   - Clicks "Plasează comanda"
   - **If approved:** Payment succeeds, order confirmed

**Abandoned Order:**
- If user leaves checkout page, order remains in 'pending' status (not completed)
- Admin can see abandoned orders in dashboard (optional feature)
- Follow-up email could be sent after 24h: "Ai uitat ceva în coșul tău?"

---

## EDGE CASES & FALLBACKS

### Empty States

**No Products in Shop:**
- Message: "Momentan nu avem produse disponibile. Revino în curând!"
- CTA: "Contactează-ne pentru comenzi speciale"

**No Partners:**
- Homepage trust bar hidden (conditional render)

**No Quotes in Admin:**
- Empty state: "Nicio cerere de ofertă încă"
- CTA: "Promovează pagina Cere ofertă"

**No Orders in Admin:**
- Empty state: "Nicio comandă încă"
- CTA: "Promovează shop-ul"

### Shipping Not Configured

**Scenario:** Admin hasn't set up shipping methods yet

**Checkout page:**
- Shipping method section shows:
  - "Metodele de livrare nu sunt configurate momentan."
  - "Te rugăm să ne contactezi la {COMPANY_EMAIL} sau {COMPANY_PHONE} pentru a finaliza comanda."
- Checkout button disabled
- Alternative: Shows only "Ridicare personală - Gratuit" option

### Stripe Not Configured

**Scenario:** `ENABLE_STRIPE_PAYMENTS=false` in env

**Checkout page:**
- Payment methods available:
  - 📦 Ramburs (COD)
  - 🏦 Transfer bancar
- Stripe option hidden

### Out of Stock Product

**Product detail page:**
- Stock badge: "Stoc epuizat" (red)
- "Adaugă în coș" button replaced with "Anunță-mă când e disponibil"
- Click opens dialog: "Lasă-ne email-ul tău și te anunțăm când produsul revine în stoc"

### Session Expiration (Admin)

**Scenario:** Admin token expires while working

**Any admin page:**
- API call returns 401 Unauthorized
- Middleware redirects to `/admin/login`
- After login, redirects back to original page

---

## SUCCESS METRICS

**Quote Funnel:**
- Conversion rate: Visitors → Quote requests (target: 5-10%)
- Form completion time: Average < 3 minutes
- Abandonment rate: < 30%

**Shop:**
- Add to cart rate: 15-20% of product views
- Cart abandonment: < 60%
- Checkout completion: > 70% of users who start checkout

**Admin Efficiency:**
- Time to review quote: < 5 minutes
- Time to update status: < 30 seconds
- Orders processed per hour: > 10
