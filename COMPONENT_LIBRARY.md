# Component Library Specification

## PUBLIC COMPONENTS

### Header
**Path:** `src/components/layout/Header.tsx`

**Props:**
```typescript
interface HeaderProps {
  locale: 'ro' | 'en';
  transparent?: boolean; // For hero overlays
}
```

**Variants:**
- `default`: White background, shadow
- `transparent`: Transparent, becomes solid on scroll

**Structure:**
- Logo (left)
- Navigation links (center desktop, drawer mobile)
- Locale switch + Cart icon + CTA button (right)

**Mobile:** Hamburger menu → full-height Sheet

---

### Footer
**Path:** `src/components/layout/Footer.tsx`

**Structure:** 4-column grid (responsive: stack on mobile)

**Columns:**
1. Brand (logo + tagline + social icons)
2. Servicii links
3. Companie links
4. Legal & Shop links

**Bottom:** Copyright bar

---

### LocaleSwitch
**Path:** `src/components/layout/LocaleSwitch.tsx`

**Props:**
```typescript
interface LocaleSwitchProps {
  currentLocale: 'ro' | 'en';
  variant?: 'dropdown' | 'toggle';
}
```

**Variants:**
- `dropdown`: Desktop (DropdownMenu with flags)
- `toggle`: Mobile (Segmented control RO|EN)

**Behavior:** Updates URL, stores cookie, maintains route

---

### Hero
**Path:** `src/components/sections/Hero.tsx`

**Props:**
```typescript
interface HeroProps {
  title: string;
  subtitle?: string;
  primaryCTA?: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
  image?: string; // SVG or image URL
  variant?: 'home' | 'page';
}
```

**Variants:**
- `home`: Full height gradient, centered, both CTAs
- `page`: Shorter, simple title + subtitle

**Background:** Gradient primary → secondary

---

### FeatureGrid
**Path:** `src/components/sections/FeatureGrid.tsx`

**Props:**
```typescript
interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeatureGridProps {
  features: Feature[];
  columns?: 2 | 3 | 4;
  variant?: 'icon-top' | 'icon-left';
}
```

**Variants:**
- `icon-top`: Icon above text, centered
- `icon-left`: Icon left, text right

**Layout:** Grid with responsive columns

---

### TrustBar (PartnerLogoGrid compact)
**Path:** `src/components/sections/TrustBar.tsx`

**Props:**
```typescript
interface TrustBarProps {
  partners: Partner[];
  autoScroll?: boolean;
}
```

**Layout:** Horizontal scrolling logos, grayscale → color on hover

**Mobile:** Auto-scrolling carousel

---

### TestimonialCard
**Path:** `src/components/cards/TestimonialCard.tsx`

**Props:**
```typescript
interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
}
```

**Layout:**
- Quote text (prose)
- Author info (name + role + company)
- Avatar (optional, circular)

**Styling:** Card with light background, border

---

### TestimonialCarousel
**Path:** `src/components/sections/TestimonialCarousel.tsx`

**Props:**
```typescript
interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoAdvance?: boolean;
  interval?: number; // ms
}
```

**Features:**
- Single card visible
- Dots navigation
- Prev/next arrows
- Auto-advance (optional)

**Component:** Use shadcn Carousel or custom

---

### ServiceCard
**Path:** `src/components/cards/ServiceCard.tsx`

**Props:**
```typescript
interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  ctaLabel?: string;
}
```

**Layout:**
- Icon (large, top)
- Title (h3)
- Description (2-3 lines)
- CTA link

**States:** Hover elevates card

---

### IndustryCard
**Path:** `src/components/cards/IndustryCard.tsx`

**Props:**
```typescript
interface IndustryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
}
```

**Layout:** Similar to ServiceCard, optional image background

**States:** Hover shows overlay with "Află mai mult"

---

### PartnerLogoGrid
**Path:** `src/components/sections/PartnerLogoGrid.tsx`

**Props:**
```typescript
interface PartnerLogoGridProps {
  partners: Partner[];
  variant?: 'grid' | 'carousel';
  showDetails?: boolean; // Show name + description
}
```

**Variants:**
- `grid`: Static grid layout (3-4 cols)
- `carousel`: Horizontal scroll (for homepage)

**showDetails:** If true, show name + short description below logo

---

### QuoteCTA
**Path:** `src/components/sections/QuoteCTA.tsx`

**Props:**
```typescript
interface QuoteCTAProps {
  variant?: 'inline' | 'full-width' | 'sticky';
  heading?: string;
  description?: string;
}
```

**Variants:**
- `inline`: Normal section with padding
- `full-width`: Edge-to-edge gradient background
- `sticky`: Fixed bottom bar (mobile)

**Layout:** Heading + description + large CTA button

---

### ProcessSteps
**Path:** `src/components/sections/ProcessSteps.tsx`

**Props:**
```typescript
interface Step {
  icon: LucideIcon;
  title: string;
  description?: string;
}

interface ProcessStepsProps {
  steps: Step[];
  orientation?: 'horizontal' | 'vertical';
}
```

**Layout:**
- Horizontal: Timeline with dotted line connecting icons
- Vertical: Stacked with left border line

**Responsive:** Horizontal becomes vertical on mobile

---

### DateRangePicker
**Path:** `src/components/forms/DateRangePicker.tsx`

**Props:**
```typescript
interface DateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onChange: (start: Date, end: Date) => void;
  minDate?: Date;
  disabled?: boolean;
}
```

**Component:** Use shadcn Calendar + Popover, custom range selection logic

**Validation:** End date must be >= start date

---

### PricingExplainer
**Path:** `src/components/sections/PricingExplainer.tsx`

**Props:**
```typescript
interface ExplainerBlock {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface PricingExplainerProps {
  blocks: ExplainerBlock[];
}
```

**Layout:** Grid of cards, icon + title + description

**Purpose:** Explain pricing factors WITHOUT showing prices

---

## SHOP COMPONENTS

### ProductCard
**Path:** `src/components/cards/ProductCard.tsx`

**Props:**
```typescript
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    image_url?: string;
    category: string;
    variant_count: number;
    price_from: number;
    stock_status: 'in_stock' | 'pre_order' | 'out_of_stock';
  };
  variant?: 'grid' | 'list';
}
```

**Variants:**
- `grid`: Vertical card (default)
- `list`: Horizontal card (admin or mobile)

**Layout:**
- Image (with fallback)
- Category badge
- Product name
- Variant info
- Stock badge
- CTA: "Vezi detalii"

**States:** Hover elevates, image scales slightly

---

### ProductGrid
**Path:** `src/components/sections/ProductGrid.tsx`

**Props:**
```typescript
interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  loading?: boolean;
}
```

**Features:**
- Responsive columns
- Skeleton loading state (12 cards)
- Empty state component

---

### VariantSelector
**Path:** `src/components/products/VariantSelector.tsx`

**Props:**
```typescript
interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedId?: string;
  onChange: (variantId: string) => void;
  showPrice?: boolean;
}
```

**Layout:**
- If color variants: Color swatches (circular buttons)
- If size/pack variants: Dropdown or radio buttons
- Shows price change when selected

**Validation:** One variant must be selected before add to cart

---

### CompatibilityList
**Path:** `src/components/products/CompatibilityList.tsx`

**Props:**
```typescript
interface CompatibilityListProps {
  compatibleProducts: Product[];
}
```

**Layout:**
- Heading: "Compatibil cu:"
- List of linked product cards (mini)
- Each card: Image + name + link

**Empty:** "Nicio compatibilitate specificată"

---

### ImageGallery
**Path:** `src/components/products/ImageGallery.tsx`

**Props:**
```typescript
interface ImageGalleryProps {
  images: string[];
  alt: string;
}
```

**Features:**
- Main image (large)
- Thumbnail strip (4-6 visible, scroll if more)
- Click thumbnail → updates main
- Click main → opens lightbox (full screen)

**Component:** Use shadcn Dialog for lightbox

---

### CartDrawer
**Path:** `src/components/shop/CartDrawer.tsx`

**Props:**
```typescript
interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}
```

**Component:** shadcn Sheet (right side)

**Content:**
- Header: "Coșul tău" + close button
- Cart items list (scrollable)
- Footer: Subtotal + CTA "Vezi coșul" / "Checkout"

**Trigger:** Cart icon in header (with badge count)

---

### CartItem
**Path:** `src/components/shop/CartItem.tsx`

**Props:**
```typescript
interface CartItemProps {
  item: {
    product_id: string;
    variant_id: string;
    name: string;
    variant_name: string;
    image_url?: string;
    price: number;
    quantity: number;
  };
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  variant?: 'drawer' | 'page';
}
```

**Variants:**
- `drawer`: Compact layout for drawer
- `page`: Expanded layout for cart page

**Layout:**
- Image (small)
- Name + variant
- Quantity selector (- input +)
- Price x quantity = subtotal
- Remove button

---

### CheckoutForm
**Path:** `src/components/shop/CheckoutForm.tsx`

**Props:**
```typescript
interface CheckoutFormProps {
  cartItems: CartItem[];
  onSubmit: (data: CheckoutData) => Promise<void>;
}
```

**Sections:**
1. Billing details (with Firmă/PF toggle)
2. Shipping address (with "Same as billing" checkbox)
3. Shipping method (radio)
4. Payment method (radio)
5. Order notes (textarea)
6. Terms checkbox

**Validation:** Use Zod schema from `validation.ts`

**Submit:** Creates order via API, handles payment flow

**Component:** Uses shadcn Form components

---

### OrderSummary
**Path:** `src/components/shop/OrderSummary.tsx`

**Props:**
```typescript
interface OrderSummaryProps {
  items: CartItem[];
  shipping?: number;
  tax?: number;
  variant?: 'cart' | 'checkout';
}
```

**Layout:**
- Items list (if variant="checkout", compact)
- Subtotal
- Shipping
- Tax (TVA 19%)
- **Total** (bold, large)
- CTA button (varies by context)

**Sticky:** On checkout page, sticks to viewport on scroll

---

### PaymentMethodSelector
**Path:** `src/components/shop/PaymentMethodSelector.tsx`

**Props:**
```typescript
interface PaymentMethod {
  id: 'card' | 'cod' | 'bank_transfer';
  label: string;
  description: string;
  icon: LucideIcon;
  fee?: number;
}

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[];
  selected?: string;
  onChange: (methodId: string) => void;
}
```

**Layout:** Radio buttons with icon, label, description, fee

**Conditional Content:**
- If `card` selected: Show Stripe Elements
- If `bank_transfer` selected: Show bank details

---

## FORM COMPONENTS

### QuoteForm
**Path:** `src/components/forms/QuoteForm.tsx`

**Props:**
```typescript
interface QuoteFormProps {
  onSuccess?: () => void;
}
```

**Sections:** (as specified in PAGE_SPECIFICATIONS.md)
1. Despre eveniment
2. Servicii necesare
3. Datele tale
4. Preferințe

**Validation:** Zod schema from `validation.ts`

**Submit:** POST `/api/quotes`, redirect to confirmation

**Component:** shadcn Form + Input/Select/Textarea/Checkbox

---

### ContactForm
**Path:** `src/components/forms/ContactForm.tsx`

**Props:**
```typescript
interface ContactFormProps {
  onSuccess?: () => void;
}
```

**Fields:** Name, Email, Phone, Subject (dropdown), Message

**Validation:** Zod schema

**Submit:** POST `/api/contact`, show toast success

---

## ADMIN COMPONENTS

### AdminSidebar
**Path:** `src/components/admin/AdminSidebar.tsx`

**Props:**
```typescript
interface AdminSidebarProps {
  currentPath: string;
  user: User;
}
```

**Structure:**
- Logo
- Navigation items (grouped)
- User profile section (bottom)

**States:**
- Expanded (240px) / Collapsed (64px) - toggle button
- Active page highlighted

**Mobile:** Overlay Sheet

---

### DataTable
**Path:** `src/components/admin/DataTable.tsx`

**Props:**
```typescript
interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  onRowClick?: (row: any) => void;
  selectable?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
  loading?: boolean;
  emptyMessage?: string;
}
```

**Features:**
- Sortable columns (click header)
- Checkbox selection (if selectable)
- Row click navigation
- Loading skeleton
- Empty state
- Sticky header on scroll

**Component:** Use shadcn Table + custom logic

---

### StatusBadge
**Path:** `src/components/admin/StatusBadge.tsx`

**Props:**
```typescript
interface StatusBadgeProps {
  status: QuoteStatus | OrderStatus | PaymentStatus;
  variant?: 'default' | 'outline';
}
```

**Colors:** Mapped from status (success, warning, error, info, etc.)

**Component:** shadcn Badge with custom colors

---

### BulkActionsBar
**Path:** `src/components/admin/BulkActionsBar.tsx`

**Props:**
```typescript
interface BulkActionsBarProps {
  selectedCount: number;
  actions: {
    label: string;
    icon?: LucideIcon;
    onClick: () => void;
    variant?: 'default' | 'destructive';
  }[];
  onClearSelection: () => void;
}
```

**Layout:** Fixed top bar (appears when items selected)
- "X selectate" text
- Action buttons
- Clear selection button

**Component:** Card with shadow + border

---

### SidePanel
**Path:** `src/components/admin/SidePanel.tsx`

**Props:**
```typescript
interface SidePanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg';
}
```

**Component:** shadcn Sheet (right side)

**Purpose:** View details without leaving list page

**Widths:** sm=400px, md=600px, lg=800px

---

### ConfirmDialog
**Path:** `src/components/admin/ConfirmDialog.tsx`

**Props:**
```typescript
interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  variant?: 'default' | 'destructive';
  confirmLabel?: string;
  cancelLabel?: string;
}
```

**Component:** shadcn AlertDialog

**Variants:**
- `default`: Normal confirmation
- `destructive`: Red confirm button (for delete)

---

### EmptyState
**Path:** `src/components/shared/EmptyState.tsx`

**Props:**
```typescript
interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**Layout:**
- Icon (large, muted color)
- Title (h3)
- Description (text-muted)
- Action button (optional)

**Usage:** No data states in tables, empty carts, no search results

---

### Timeline
**Path:** `src/components/admin/Timeline.tsx`

**Props:**
```typescript
interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp: Date;
  user?: string;
  icon?: LucideIcon;
}

interface TimelineProps {
  events: TimelineEvent[];
  variant?: 'vertical' | 'horizontal';
}
```

**Layout:** Vertical list with left border line, icons at each node

**Purpose:** Show history of status changes, actions

---

### NotesPanel
**Path:** `src/components/admin/NotesPanel.tsx`

**Props:**
```typescript
interface Note {
  id: string;
  content: string;
  created_at: Date;
  user: string;
}

interface NotesPanelProps {
  notes: Note[];
  onAddNote: (content: string) => Promise<void>;
}
```

**Layout:**
- Textarea: "Adaugă notă" + submit button
- Notes list (reverse chronological)
  - Each note: content + timestamp + user

---

### FilterBar
**Path:** `src/components/admin/FilterBar.tsx`

**Props:**
```typescript
interface Filter {
  key: string;
  label: string;
  type: 'select' | 'daterange' | 'search';
  options?: { label: string; value: string }[];
}

interface FilterBarProps {
  filters: Filter[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onReset: () => void;
}
```

**Layout:** Horizontal row of filter inputs

**Features:**
- Select dropdowns (status, category, etc.)
- Date range picker
- Search input
- "Reset filters" button

---

### StatsCard
**Path:** `src/components/admin/StatsCard.tsx`

**Props:**
```typescript
interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: {
    direction: 'up' | 'down';
    value: string;
  };
  icon?: LucideIcon;
}
```

**Layout:**
- Icon (top-right, muted)
- Title (small, muted)
- Value (large, bold)
- Trend (with arrow icon + colored text)

**Component:** Card with padding

---

### ImageUpload
**Path:** `src/components/admin/ImageUpload.tsx`

**Props:**
```typescript
interface ImageUploadProps {
  value?: string; // URL
  onChange: (url: string) => void;
  onDelete?: () => void;
  bucket: 'public-assets' | 'private-files';
  maxSize?: number; // MB
}
```

**Features:**
- Drag & drop zone
- File input fallback
- Image preview
- Delete button
- Progress indicator during upload
- Validation: file type, size

**Component:** Custom with shadcn Card styling

---

### ImageUploadMultiple
**Path:** `src/components/admin/ImageUploadMultiple.tsx`

**Props:**
```typescript
interface ImageUploadMultipleProps {
  images: string[]; // URLs
  onChange: (images: string[]) => void;
  maxImages?: number;
  bucket: 'public-assets' | 'private-files';
}
```

**Features:**
- Upload multiple
- Drag to reorder
- Set primary (first image)
- Delete individual images

---

### RichTextEditor
**Path:** `src/components/admin/RichTextEditor.tsx`

**Props:**
```typescript
interface RichTextEditorProps {
  value: string; // HTML or Markdown
  onChange: (value: string) => void;
  placeholder?: string;
}
```

**Component:** Use a library (TipTap, Quill, or simple textarea for MVP)

**Toolbar:** Bold, Italic, Heading, List, Link

---

### Notification (Toast)
**Path:** Uses shadcn Sonner or Toast

**Usage:**
```typescript
import { toast } from 'sonner';

toast.success('Produsul a fost adăugat în coș');
toast.error('A apărut o eroare. Încearcă din nou.');
toast.info('Funcție în dezvoltare');
```

**Variants:** success, error, warning, info

**Position:** Top-right (desktop), top-center (mobile)

---

## SHARED/UTILITY COMPONENTS

### LoadingSkeleton
**Path:** `src/components/shared/LoadingSkeleton.tsx`

**Variants:**
- `<SkeletonCard />` - Product card shape
- `<SkeletonTable />` - Table rows
- `<SkeletonText />` - Text lines
- `<SkeletonAvatar />` - Circle

**Component:** Uses shadcn Skeleton + custom shapes

---

### Breadcrumbs
**Path:** `src/components/shared/Breadcrumbs.tsx`

**Props:**
```typescript
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}
```

**Layout:** Home / Link / Link / Current (no link)

**Component:** Custom with separators (/)

---

### Pagination
**Path:** `src/components/shared/Pagination.tsx`

**Props:**
```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
```

**Component:** shadcn Pagination

**Layout:** Prev button, page numbers (max 7 visible), Next button

---

### SearchInput
**Path:** `src/components/shared/SearchInput.tsx`

**Props:**
```typescript
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounce?: number; // ms
}
```

**Features:**
- Search icon (left)
- Clear button (right, when value present)
- Debounced onChange

**Component:** shadcn Input with icons

---

## SHADCN/UI COMPONENTS TO INSTALL

Required shadcn components:
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add accordion
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add table
npx shadcn-ui@latest add form
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add pagination
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add alert-dialog
```

---

## COMPONENT USAGE EXAMPLES

### Example: Using ProductCard
```tsx
<ProductCard
  product={{
    id: '123',
    name: 'Token-uri numerotate',
    slug: 'token-uri-numerotate',
    image_url: '/images/tokens.jpg',
    category: 'Sisteme cloakroom',
    variant_count: 5,
    price_from: 49.99,
    stock_status: 'in_stock'
  }}
  variant="grid"
/>
```

### Example: Using DataTable
```tsx
<DataTable
  columns={[
    { key: 'id', label: 'ID', sortable: true },
    { key: 'client', label: 'Client', sortable: true },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
  ]}
  data={quotes}
  selectable
  onSelectionChange={(ids) => setSelectedIds(ids)}
  onRowClick={(row) => router.push(`/admin/quotes/${row.id}`)}
/>
```

### Example: Using StatusBadge
```tsx
<StatusBadge status="offer_sent" variant="outline" />
// Renders: Purple badge with "Ofertă trimisă"
```
