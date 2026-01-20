# UI Quality Bar & Acceptance Criteria

## ACCESSIBILITY (A11Y)

### Contrast Ratios (WCAG 2.1 AA)
- [ ] Normal text (16px+): Minimum 4.5:1 contrast ratio
- [ ] Large text (24px+): Minimum 3:1 contrast ratio
- [ ] UI components (buttons, inputs): Minimum 3:1 contrast ratio
- [ ] Focus indicators: Minimum 3:1 contrast ratio against background

**Testing Tools:**
- Chrome DevTools Lighthouse
- WebAIM Contrast Checker
- axe DevTools extension

**Critical Checks:**
- [ ] Primary button text on primary background
- [ ] Secondary text (muted-foreground) on card backgrounds
- [ ] Badge text on badge backgrounds (status colors)
- [ ] Link text on page background

---

### Keyboard Navigation
- [ ] All interactive elements reachable via Tab key
- [ ] Tab order follows visual/logical flow (top to bottom, left to right)
- [ ] Focus indicators clearly visible (2px outline, primary color)
- [ ] No keyboard traps (can escape modals, dropdowns with Esc)
- [ ] Skip to main content link (hidden, appears on Tab)
- [ ] Arrow keys navigate dropdowns, select options
- [ ] Enter/Space activate buttons, checkboxes
- [ ] Esc closes modals, dropdowns, sheets

**Focus Order Examples:**
- **Header:** Logo → Nav links → Locale switch → Cart → CTA button
- **Form:** Fields in reading order → Submit button
- **Modal:** Close button → Form fields → Action buttons

---

### Screen Reader Support
- [ ] All images have descriptive `alt` text (or `alt=""` if decorative)
- [ ] Form inputs have associated `<label>` elements (or `aria-label`)
- [ ] Buttons have descriptive text or `aria-label` (icon-only buttons)
- [ ] Status messages announced via `aria-live` regions
- [ ] Modal dialogs have `role="dialog"` and `aria-labelledby`
- [ ] Loading states announced: "Loading products..."
- [ ] Error messages associated with inputs via `aria-describedby`
- [ ] Headings used semantically (H1 → H6, hierarchical)

**ARIA Labels Examples:**
```tsx
// Icon-only button
<button aria-label="Close dialog">
  <X className="w-4 h-4" />
</button>

// Loading state
<div role="status" aria-live="polite">
  Loading products...
</div>

// Form error
<input 
  aria-invalid="true" 
  aria-describedby="email-error" 
/>
<span id="email-error">Invalid email format</span>
```

---

### Color Independence
- [ ] Information NOT conveyed by color alone
- [ ] Status indicated by icon + color (e.g., badge has text + color)
- [ ] Form errors have icon + message, not just red border
- [ ] Charts have patterns or labels, not just color coding
- [ ] Links distinguishable from text (underline or sufficient contrast)

**Example:**
```tsx
// Good: Icon + color
<Badge variant="success">
  <CheckCircle className="w-3 h-3" />
  <span>Plătit</span>
</Badge>

// Bad: Color only
<Badge className="bg-green-500">Plătit</Badge>
```

---

### Text & Typography
- [ ] Minimum font size: 14px (0.875rem) for body text
- [ ] Line height: Minimum 1.5 for body text
- [ ] Text can be zoomed to 200% without horizontal scroll
- [ ] Paragraphs have max-width for readability (75ch, ~750px)
- [ ] Link text is descriptive ("Read more about services" not "Click here")
- [ ] No text in images (except logos)

---

## RESPONSIVE BEHAVIOR

### Breakpoints
- [ ] **Mobile (< 640px):** Single column, stacked elements, touch-friendly
- [ ] **Tablet (640px - 1023px):** 2 columns, reduced padding
- [ ] **Desktop (1024px+):** Full layout, all columns visible
- [ ] **Wide (1280px+):** Max-width containers, centered content

### Mobile-Specific
- [ ] Touch targets minimum 44x44px (buttons, links, inputs)
- [ ] No hover-only interactions (provide tap alternative)
- [ ] Navigation collapses to hamburger menu
- [ ] Tables scroll horizontally or reformat to cards
- [ ] Modals/sheets fill screen (or 90% height)
- [ ] Forms: Full-width inputs, stacked fields
- [ ] Images: Scaled to fit, maintain aspect ratio
- [ ] Font sizes scale appropriately (base 16px → 14px on mobile acceptable)

**Example Responsive Grid:**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
  {/* Cards */}
</div>
```

### Tablet-Specific
- [ ] 2-column layouts where applicable
- [ ] Sidebar nav can collapse to icons
- [ ] Tables: Show essential columns, hide secondary
- [ ] Admin: Reduced padding, smaller font sizes

### Touch Interactions
- [ ] Swipe gestures where appropriate (carousels, cart items)
- [ ] Pull-to-refresh on lists (optional enhancement)
- [ ] No double-tap required (all actions single tap)
- [ ] Long press for context menus (optional)

---

## SPACING CONSISTENCY

### Vertical Rhythm
- [ ] Consistent spacing between sections: 48px (12) desktop, 32px (8) mobile
- [ ] Card padding: 24px (6) desktop, 16px (4) mobile
- [ ] Form field spacing: 16px (4) between fields
- [ ] Button padding: 12px 24px (3 6) for primary, 8px 16px (2 4) for secondary
- [ ] Section inner padding: 80px (20) desktop, 40px (10) mobile

### Horizontal Spacing
- [ ] Container max-width: 1280px (7xl)
- [ ] Container padding: 32px (8) desktop, 16px (4) mobile
- [ ] Grid gaps: 24px (6) desktop, 16px (4) mobile
- [ ] Icon-text gap: 8px (2)
- [ ] Button icon gap: 8px (2)

**Grid System:**
```tsx
// Consistent gap usage
<div className="space-y-6"> {/* Vertical spacing */}
<div className="flex gap-2 items-center"> {/* Icon + text */}
<div className="grid grid-cols-3 gap-6"> {/* Grid */}
```

---

## PERFORMANCE

### Core Web Vitals Targets
- [ ] **LCP (Largest Contentful Paint):** < 2.5s
  - Hero image/text should render quickly
  - Use Next.js Image optimization
  - Preload critical fonts
- [ ] **FID (First Input Delay):** < 100ms
  - Minimize JavaScript execution
  - Use React Server Components where possible
- [ ] **CLS (Cumulative Layout Shift):** < 0.1
  - Reserve space for images (width/height attributes)
  - Avoid layout shifts during loading
  - Use skeleton loaders with correct dimensions

### Loading States
- [ ] All data fetching shows loading indicator (spinner or skeleton)
- [ ] Skeleton loaders match final content shape
- [ ] Images show placeholder before load (blur-up effect)
- [ ] Buttons show loading state on click (spinner + disabled)
- [ ] Forms disable during submission
- [ ] Pagination/infinite scroll shows loading for next page

**Skeleton Example:**
```tsx
{loading ? (
  <div className="grid grid-cols-3 gap-6">
    {Array(9).fill(0).map((_, i) => <SkeletonCard key={i} />)}
  </div>
) : (
  <ProductGrid products={products} />
)}
```

### Image Optimization
- [ ] Use Next.js `<Image>` component
- [ ] Provide width and height attributes
- [ ] Use appropriate formats (WebP with JPEG fallback)
- [ ] Lazy load below-fold images
- [ ] Compress images (80-85% quality)
- [ ] Use Supabase image transformations for thumbnails

---

## FORM USABILITY

### Field Design
- [ ] Labels always visible (not placeholder-only)
- [ ] Placeholder text provides example, not instruction
- [ ] Required fields marked with * (and stated in legend)
- [ ] Optional fields marked "(optional)"
- [ ] Input size appropriate for expected content
  - Name: 320px
  - Email: 320px
  - Phone: 200px
  - Address: Full width
  - City: 200px
- [ ] Help text below field (small, muted color)
- [ ] Icons in inputs (search icon, calendar icon) left-aligned

### Validation
- [ ] Inline validation on blur (not on every keystroke)
- [ ] Errors shown below field with icon
- [ ] Error message specific ("Email format invalid" not "Error")
- [ ] Success state optional (green border + checkmark)
- [ ] Submit button disabled if form invalid
- [ ] Summary error alert at top if submission fails
- [ ] Scroll to first error on submit

**Validation Example:**
```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email*</Label>
  <Input 
    id="email" 
    type="email" 
    aria-invalid={!!error}
    aria-describedby={error ? "email-error" : undefined}
  />
  {error && (
    <p id="email-error" className="text-sm text-error flex items-center gap-1">
      <AlertCircle className="w-4 h-4" />
      {error.message}
    </p>
  )}
</div>
```

### Form Behavior
- [ ] Autocomplete attributes for common fields
  - `name="email" autoComplete="email"`
  - `name="phone" autoComplete="tel"`
  - `name="address" autoComplete="street-address"`
- [ ] Enter key submits form (unless textarea focused)
- [ ] Unsaved changes warning if user navigates away
- [ ] Form persists on error (don't clear fields)
- [ ] Show character count for textareas with limits

---

## ADMIN DENSITY

### Table Design
- [ ] Sticky header on scroll
- [ ] Sortable columns indicated (caret icon)
- [ ] Row hover highlights (subtle background change)
- [ ] Clickable rows (cursor pointer, navigate to detail)
- [ ] Checkbox column for bulk selection (left-most)
- [ ] Actions column (right-most, dropdown menu)
- [ ] Compact row height: 48px
- [ ] Font size: 14px (text-sm)
- [ ] Pagination at bottom

**Table Features:**
- [ ] Column visibility toggle (optional advanced feature)
- [ ] Saved views (filter presets) - optional
- [ ] Export to CSV button
- [ ] Bulk actions bar appears when items selected

### Dashboard Density
- [ ] Stats cards: 4 columns desktop, 2 tablet, 1 mobile
- [ ] Charts: Minimum 300px height
- [ ] Data tables: Show 10 rows per page by default
- [ ] Compact spacing: 16px gaps between widgets
- [ ] Side panel for quick view (800px max width)

### Admin Forms
- [ ] Two-column layouts where logical (desktop only)
- [ ] Tabs for multi-section forms (Settings page)
- [ ] Inline editing in tables (optional enhancement)
- [ ] Auto-save drafts (optional)

---

## STATE MANAGEMENT

### Loading States
- [ ] Button: Spinner + "Se procesează..." text
- [ ] Page: Full-page spinner or skeleton layout
- [ ] List: Skeleton cards (6-12)
- [ ] Image: Blur placeholder
- [ ] Infinite scroll: Spinner at bottom

### Empty States
- [ ] Icon (large, muted)
- [ ] Heading (H3, clear message)
- [ ] Description (optional, 1-2 lines)
- [ ] Action button (optional, "Add first item")
- [ ] Illustration (optional SVG)

**Empty State Example:**
```tsx
<EmptyState
  icon={Package}
  title="Niciun produs în stoc"
  description="Adaugă produse pentru a le afișa clienților"
  action={{
    label: "+ Adaugă produs",
    onClick: () => router.push('/admin/products/new')
  }}
/>
```

### Error States
- [ ] Inline errors (form fields): Below field, red text + icon
- [ ] Page errors (404, 500): Centered layout, clear message, CTA home
- [ ] Toast errors: Red background, error icon, auto-dismiss 5s
- [ ] API errors: Retry button provided

**Error Boundaries:**
- [ ] Catch React errors at page/component level
- [ ] Show fallback UI: "Something went wrong. Refresh to try again."

### Success States
- [ ] Toast notifications (green, checkmark icon, 3s dismiss)
- [ ] Inline success messages (optional, e.g., "Saved!" after form)
- [ ] Confirmation pages (quote, order)
- [ ] Checkmark animations for major actions

---

## BROWSER COMPATIBILITY

### Supported Browsers
- [ ] Chrome/Edge: Last 2 versions
- [ ] Firefox: Last 2 versions
- [ ] Safari: Last 2 versions (iOS 14+)
- [ ] No IE11 support (graceful degradation message if detected)

### Progressive Enhancement
- [ ] Core functionality works without JavaScript (forms submit)
- [ ] CSS Grid with flexbox fallback
- [ ] Modern features with fallbacks (e.g., `gap` property)

---

## SECURITY UI

### Password Fields
- [ ] Type="password" (masked by default)
- [ ] Show/hide toggle (eye icon)
- [ ] Password strength indicator (optional, sign-up only)

### Sensitive Data
- [ ] Credit card numbers masked except last 4 digits
- [ ] CVV never displayed or logged
- [ ] Admin: Mask sensitive user data (emails partially: j***@example.com)

### HTTPS Indicators
- [ ] Stripe badge: "Secured by Stripe" on checkout
- [ ] Lock icon on payment page (browser default)

---

## SEO REQUIREMENTS

### Meta Tags
- [ ] Every page has unique `<title>` (50-60 chars)
- [ ] Every page has `<meta name="description">` (150-160 chars)
- [ ] Open Graph tags for social sharing:
  - `og:title`
  - `og:description`
  - `og:image` (1200x630px)
  - `og:url`
- [ ] Twitter Card tags
- [ ] Canonical URL set

**Example:**
```tsx
export const metadata = {
  title: 'Garderobă profesională | Sisteme cloakroom pentru evenimente',
  description: 'Soluții complete de garderobă pentru festivaluri, conferințe și evenimente corporate. Token-uri, echipamente, instalare.',
  openGraph: {
    title: 'Garderobă profesională',
    description: 'Sisteme cloakroom complete pentru evenimente',
    images: ['/og-image.jpg'],
  },
}
```

### Structured Data (Schema.org)
- [ ] Homepage: Organization schema
- [ ] Homepage: LocalBusiness schema
- [ ] Product pages: Product schema
- [ ] Blog articles: Article schema

**Example Organization Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Garderobă profesională",
  "url": "https://cloakroom.ro",
  "logo": "https://cloakroom.ro/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+40-700-000-000",
    "contactType": "Customer Service"
  }
}
```

### URL Structure
- [ ] Clean URLs (no .html, no query params for navigation)
- [ ] Kebab-case slugs: `/shop/token-uri-numerotate`
- [ ] Locale in URL: `/ro/shop` and `/en/shop`
- [ ] Canonical tags prevent duplicate content

### Sitemap & Robots
- [ ] `sitemap.xml` generated dynamically (Next.js)
- [ ] `robots.txt` allows all public pages
- [ ] Disallow admin pages: `Disallow: /admin`

---

## TESTING CHECKLIST

### Manual Testing
- [ ] Test all forms (quote, contact, checkout) with valid/invalid data
- [ ] Test responsive breakpoints (mobile 375px, tablet 768px, desktop 1280px)
- [ ] Test keyboard navigation (Tab through all pages)
- [ ] Test screen reader (VoiceOver on iOS, TalkBack on Android)
- [ ] Test color contrast (WebAIM checker)
- [ ] Test print styles (invoices, legal pages)

### Automated Testing
- [ ] Unit tests for critical functions (validation, formatters)
- [ ] E2E tests for key flows (quote submission, checkout)
- [ ] Lighthouse audit score > 90 (performance, accessibility, SEO)
- [ ] No console errors in production

### Browser/Device Matrix
- [ ] iPhone (Safari iOS 14+)
- [ ] Android (Chrome)
- [ ] Desktop: Chrome, Firefox, Safari, Edge
- [ ] Tablet: iPad (Safari), Android tablet

---

## ACCEPTANCE CHECKLIST (Per Page)

Before marking a page "complete", verify:

- [ ] Page renders correctly on mobile, tablet, desktop
- [ ] All links work (no 404s)
- [ ] All images load (with alt text)
- [ ] Loading states implemented
- [ ] Empty states implemented (if applicable)
- [ ] Error states handled
- [ ] Forms validate correctly
- [ ] Success/confirmation messages shown
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader announces content
- [ ] Contrast ratios pass WCAG AA
- [ ] Performance: LCP < 2.5s, CLS < 0.1
- [ ] SEO: Title, description, OG tags set
- [ ] No console errors/warnings
- [ ] Code follows project conventions
- [ ] Comments added for complex logic
- [ ] TypeScript types defined (no `any`)

---

## DEFINITION OF DONE (Feature)

A feature is considered "done" when:

1. **Functionality:** Works as specified, all user stories completed
2. **Design:** Matches design specs (colors, spacing, typography)
3. **Responsive:** Works on all breakpoints
4. **Accessible:** Passes WCAG 2.1 AA (keyboard, screen reader, contrast)
5. **Performance:** Passes Core Web Vitals targets
6. **Tested:** Manual testing complete, E2E tests written (for critical flows)
7. **Documented:** Code comments, README updated if needed
8. **Reviewed:** Code review approved
9. **Deployed:** Live in production environment
10. **Monitored:** No errors in production logs after 24h

---

## PRIORITY LEVELS

### P0 (Critical - Must Fix Before Launch)
- Broken functionality (can't submit form, payment fails)
- Accessibility blockers (keyboard trap, no screen reader support)
- Major contrast violations (2:1 ratio)
- Critical performance issues (LCP > 4s)
- Security vulnerabilities

### P1 (High - Fix Soon)
- Minor accessibility issues (missing alt text on decorative image)
- Performance issues (LCP 2.5-4s)
- Responsive issues on common devices
- Form usability issues (poor validation messages)

### P2 (Medium - Fix Eventually)
- Nice-to-have features (column visibility toggle in admin)
- Minor design inconsistencies (spacing off by 4px)
- Optional enhancements (saved filter views)

### P3 (Low - Backlog)
- Future features (advanced analytics)
- Edge case handling (IE11 support - not doing)
- Optimizations (reduce bundle size by 10KB)
