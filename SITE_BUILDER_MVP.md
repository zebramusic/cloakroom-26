# Site Builder MVP - Implementation Status

## Scope: Simplified MVP

**What's Included:**
- ✅ Database models (Navigation, Footer, Pages, Media, AuditLog)
- ✅ RBAC permissions (site.read, site.write, site.publish, site.media, site.rollback)
- ✅ Block validation schemas (Hero, Features Grid, CTA only)
- ⏳ API Routes (15 files needed)
- ⏳ Admin UI (20 components needed)
- ⏳ Public Rendering (5 components needed)
- ⏳ Seed Script
- ⏳ i18n Translations

## Files Structure

```
src/
├── lib/
│   ├── models/
│   │   └── site.ts ✅ (Navigation, Footer, Pages, Media, Audit)
│   ├── validations/
│   │   └── blocks.ts ✅ (Hero, FeatureGrid, CTA)
│   └── auth/
│       └── permissions.ts ✅ (Added site.* permissions)
│
├── app/
│   ├── admin/
│   │   └── site/
│   │       ├── page.tsx ⏳ Dashboard
│   │       ├── navigation/
│   │       │   └── page.tsx ⏳ Navigation Editor
│   │       ├── footer/
│   │       │   └── page.tsx ⏳ Footer Editor
│   │       ├── pages/
│   │       │   ├── page.tsx ⏳ Pages List
│   │       │   └── [key]/page.tsx ⏳ Page Editor
│   │       └── media/
│   │           └── page.tsx ⏳ Media Library
│   │
│   └── api/
│       └── admin/
│           └── site/
│               ├── navigation/
│               │   ├── route.ts ⏳ GET/POST
│               │   ├── [id]/route.ts ⏳ PATCH/DELETE
│               │   └── publish/route.ts ⏳ Publish
│               ├── footer/
│               │   ├── route.ts ⏳ GET/POST
│               │   ├── [id]/route.ts ⏳ PATCH/DELETE
│               │   └── publish/route.ts ⏳ Publish
│               ├── pages/
│               │   ├── route.ts ⏳ GET/POST
│               │   ├── [key]/route.ts ⏳ GET/PATCH
│               │   └── [key]/publish/route.ts ⏳ Publish
│               └── media/
│                   ├── route.ts ⏳ Upload/List
│                   └── [id]/route.ts ⏳ Update/Delete
│
├── components/
│   ├── admin/
│   │   └── site/
│   │       ├── NavigationEditor.tsx ⏳
│   │       ├── FooterEditor.tsx ⏳
│   │       ├── PageEditor.tsx ⏳
│   │       ├── BlockEditor.tsx ⏳
│   │       ├── blocks/
│   │       │   ├── HeroBlockEditor.tsx ⏳
│   │       │   ├── FeatureGridBlockEditor.tsx ⏳
│   │       │   └── CTABlockEditor.tsx ⏳
│   │       ├── MediaLibrary.tsx ⏳
│   │       └── MediaPicker.tsx ⏳
│   │
│   └── site/
│       ├── DynamicHeader.tsx ⏳ (reads from DB)
│       ├── DynamicFooter.tsx ⏳ (reads from DB)
│       └── blocks/
│           ├── HeroBlock.tsx ⏳
│           ├── FeatureGridBlock.tsx ⏳
│           ├── CTABlock.tsx ⏳
│           └── BlockRenderer.tsx ⏳
│
└── scripts/
    └── seed-site.js ⏳
```

## Implementation Priority

### Phase 1: API Foundation (Required First)
1. **Navigation API** - `/api/admin/site/navigation/*`
2. **Pages API** - `/api/admin/site/pages/*` 
3. **Media API** - `/api/admin/site/media/*`

### Phase 2: Admin UI
4. **Navigation Editor** - Basic CRUD
5. **Page Editor** - Block management
6. **Block Editors** - Hero, Features, CTA
7. **Media Library** - Upload & browse

### Phase 3: Public Rendering
8. **Block Renderers** - Display blocks on public site
9. **Dynamic Header/Footer** - Read from DB (cached)
10. **Cache Invalidation** - Revalidate on publish

### Phase 4: Polish
11. **Seed Script** - Default navigation + home page
12. **i18n** - Translation keys
13. **Publish Workflow** - Draft/Published states

## Key Decisions

### Versioning Strategy
- Each save creates new version (v1, v2, v3...)
- Only one "published" version active at a time
- Draft edits don't affect live site
- "Publish" button swaps published version

### Caching Strategy
```typescript
// After publish, invalidate cache
revalidateTag('site-navigation');
revalidateTag('site-footer');
revalidateTag(`site-page-${pageKey}`);
```

### Block Data Structure
```typescript
{
  id: "block-1",
  type: "hero",
  visibility: "public",
  orderIndex: 0,
  data: {
    headline: "Welcome",
    subheadline: "Professional cloakroom services",
    primaryCta: { text: "Get Started", href: "/cere-oferta" },
    backgroundImage: "/uploads/site/hero-bg.jpg",
    alignment: "center"
  }
}
```

### Media Storage
- Dev: Local filesystem `/public/uploads/site/`
- Prod: S3-compatible storage
- URL format: `/uploads/site/filename.jpg`

## Next Steps

Given this is still 30+ files, I recommend:

**Option 1**: I continue implementing in batches:
- Batch 1: Navigation API + Editor (5-6 files)
- Batch 2: Pages API + Block Editors (8-10 files)
- Batch 3: Public rendering + Seed (8-10 files)

**Option 2**: I create a minimal "Hello World" version:
- Just Home page with 1 Hero block
- Basic admin form to edit hero text
- No versioning, just direct edit
- ~10 files total

**Option 3**: I scaffold everything with TODOs:
- Create all file stubs
- Implement core logic only
- Leave UI as placeholders
- You fill in details

Which approach would you prefer?
