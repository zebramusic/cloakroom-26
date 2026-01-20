# Design System - Garderobă profesională

## A. DESIGN TOKENS

### Color Palette

#### Base Colors (Neutral Business)
| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--background` | `#FFFFFF` | `#09090B` | Page background |
| `--foreground` | `#09090B` | `#FAFAFA` | Primary text |
| `--muted` | `#F4F4F5` | `#27272A` | Subtle backgrounds |
| `--muted-foreground` | `#71717A` | `#A1A1AA` | Secondary text |
| `--border` | `#E4E4E7` | `#27272A` | Component borders |
| `--input` | `#E4E4E7` | `#27272A` | Input borders |
| `--card` | `#FFFFFF` | `#18181B` | Card backgrounds |
| `--card-foreground` | `#09090B` | `#FAFAFA` | Card text |

#### Festival Energy Accents (Brand)
| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--primary` | `#7C3AED` | `#A78BFA` | CTAs, links, primary actions |
| `--primary-foreground` | `#FFFFFF` | `#18181B` | Text on primary |
| `--secondary` | `#F97316` | `#FB923C` | Secondary actions, highlights |
| `--secondary-foreground` | `#FFFFFF` | `#18181B` | Text on secondary |
| `--accent` | `#06B6D4` | `#22D3EE` | Tertiary accents, badges |
| `--accent-foreground` | `#FFFFFF` | `#18181B` | Text on accent |

#### Semantic Colors
| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--success` | `#10B981` | `#34D399` | Success states, confirmations |
| `--success-foreground` | `#FFFFFF` | `#064E3B` | Text on success |
| `--warning` | `#F59E0B` | `#FBBF24` | Warnings, pending states |
| `--warning-foreground` | `#FFFFFF` | `#78350F` | Text on warning |
| `--error` | `#EF4444` | `#F87171` | Errors, destructive actions |
| `--error-foreground` | `#FFFFFF` | `#7F1D1D` | Text on error |
| `--info` | `#3B82F6` | `#60A5FA` | Information, tips |
| `--info-foreground` | `#FFFFFF` | `#1E3A8A` | Text on info |

#### Status Colors (Admin)
| Token | Color | Usage |
|-------|-------|-------|
| `--status-new` | `#3B82F6` | New quotes/orders |
| `--status-in-review` | `#F59E0B` | Under review |
| `--status-offer-sent` | `#8B5CF6` | Offer sent to client |
| `--status-negotiation` | `#EC4899` | In negotiation |
| `--status-booked` | `#10B981` | Confirmed booking |
| `--status-completed` | `#6B7280` | Completed/archived |
| `--status-cancelled` | `#EF4444` | Cancelled |

### Typography Scale

#### Font Families
```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif
--font-mono: 'JetBrains Mono', 'Fira Code', monospace
```

#### Type Scale
| Element | Size | Line Height | Weight | Tailwind Class |
|---------|------|-------------|--------|----------------|
| **H1** | 48px / 3rem | 1.1 | 700 | `text-5xl font-bold` |
| **H2** | 36px / 2.25rem | 1.2 | 600 | `text-4xl font-semibold` |
| **H3** | 30px / 1.875rem | 1.2 | 600 | `text-3xl font-semibold` |
| **H4** | 24px / 1.5rem | 1.3 | 600 | `text-2xl font-semibold` |
| **H5** | 20px / 1.25rem | 1.4 | 600 | `text-xl font-semibold` |
| **H6** | 16px / 1rem | 1.4 | 600 | `text-base font-semibold` |
| **Body Large** | 18px / 1.125rem | 1.6 | 400 | `text-lg` |
| **Body** | 16px / 1rem | 1.5 | 400 | `text-base` |
| **Body Small** | 14px / 0.875rem | 1.5 | 400 | `text-sm` |
| **Caption** | 12px / 0.75rem | 1.4 | 400 | `text-xs` |
| **Overline** | 12px / 0.75rem | 1.4 | 600 | `text-xs font-semibold uppercase tracking-wider` |

#### Font Weights
| Weight | Value | Tailwind Class | Usage |
|--------|-------|----------------|-------|
| Regular | 400 | `font-normal` | Body text, descriptions |
| Medium | 500 | `font-medium` | Emphasis, labels |
| Semibold | 600 | `font-semibold` | Headings, buttons |
| Bold | 700 | `font-bold` | Hero text, key CTAs |

### Tailwind Config Recommendations

```javascript
// tailwind.config.ts additions
module.exports = {
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        error: {
          DEFAULT: 'hsl(var(--error))',
          foreground: 'hsl(var(--error-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
}
```

### Dark Mode Strategy
- Use `class` strategy: `darkMode: 'class'` in Tailwind config
- Toggle via `<html class="dark">` attribute
- All tokens defined in `:root` and `.dark` variants in globals.css
- Automatic OS preference detection with manual override
- Persisted to localStorage

---

## B. SPACING, GRID & VISUAL ELEMENTS

### Spacing System
| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `xs` | 4px | `1` | Tight spacing, icon gaps |
| `sm` | 8px | `2` | Form element gaps |
| `md` | 12px | `3` | Small component padding |
| `base` | 16px | `4` | Default spacing |
| `lg` | 20px | `5` | Section spacing |
| `xl` | 24px | `6` | Card padding |
| `2xl` | 32px | `8` | Section padding |
| `3xl` | 40px | `10` | Large section gaps |
| `4xl` | 48px | `12` | Hero spacing |
| `5xl` | 64px | `16` | Major section breaks |
| `6xl` | 80px | `20` | Page section spacing |

### Grid System
- **12-column grid** (Tailwind default)
- Gutters: 16px mobile, 24px tablet, 32px desktop
- Max width: 1280px (`max-w-7xl`)
- Content width: 1024px (`max-w-5xl`) for reading
- Narrow: 768px (`max-w-3xl`) for forms

### Breakpoints
| Name | Min Width | Tailwind | Target |
|------|-----------|----------|--------|
| Mobile | - | Default | < 640px |
| Tablet | 640px | `sm:` | 640px - 1023px |
| Desktop | 1024px | `lg:` | 1024px - 1279px |
| Wide | 1280px | `xl:` | ≥ 1280px |
| Ultra | 1536px | `2xl:` | ≥ 1536px |

**Admin Density Override:** Use `2xl:max-w-screen-2xl` for admin tables to maximize screen usage.

### Border Radius
| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `radius-sm` | 4px | `rounded-sm` | Tags, badges |
| `radius` | 8px | `rounded-md` | Buttons, inputs |
| `radius-lg` | 12px | `rounded-lg` | Cards, modals |
| `radius-xl` | 16px | `rounded-xl` | Hero images, large cards |
| `radius-full` | 9999px | `rounded-full` | Pills, avatars |

### Shadows
| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `shadow-xs` | `0 1px 2px rgba(0,0,0,0.05)` | `shadow-sm` | Subtle elevation |
| `shadow-sm` | `0 2px 4px rgba(0,0,0,0.06)` | `shadow` | Inputs, cards |
| `shadow` | `0 4px 6px rgba(0,0,0,0.07)` | `shadow-md` | Dropdowns, popovers |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | `shadow-lg` | Modals, sheets |
| `shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | `shadow-xl` | Major overlays |

### Borders
| Style | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| Width | 1px | `border` | Default borders |
| Width | 2px | `border-2` | Focus states, emphasis |
| Style | solid | Default | Standard borders |
| Style | dashed | `border-dashed` | Drag zones, placeholders |

### Elevation Levels
| Level | Shadow | Z-index | Usage |
|-------|--------|---------|-------|
| Base | `shadow-sm` | 0 | Page content |
| Raised | `shadow` | 10 | Cards, buttons |
| Overlay | `shadow-lg` | 40 | Dropdowns, tooltips |
| Modal | `shadow-xl` | 50 | Dialogs, sheets |
| Toast | `shadow-xl` | 100 | Notifications |

### Iconography (Lucide)
- **Default size:** 20px (`w-5 h-5`)
- **Small:** 16px (`w-4 h-4`) for inline text
- **Large:** 24px (`w-6 h-6`) for emphasis
- **Hero:** 48px (`w-12 h-12`) for feature icons
- **Stroke width:** 2px (default), 1.5px for thin icons
- **Color:** Inherit text color, use `text-muted-foreground` for secondary icons

**Icon Naming Convention:**
```tsx
import { Calendar, ShoppingCart, Users, Settings } from 'lucide-react'
```

**Usage Rules:**
- Always provide aria-label for icon-only buttons
- Use 16px spacing (`gap-2`) between icon and text
- Align icons vertically centered with text
- Use primary color for interactive icons, muted for decorative
