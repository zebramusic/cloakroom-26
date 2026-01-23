# Hero Background Image

## Required Image

**Filename:** `hero-cloakroom.jpg`  
**Location:** Place in `/public/images/`  
**Full path:** `/public/images/hero-cloakroom.jpg`

## Image Specifications

- **Recommended size:** 1920x1080px (Full HD) or higher
- **Format:** JPG or WebP
- **File size:** Optimized, ideally under 500KB
- **Aspect ratio:** 16:9 (landscape)
- **Subject:** Event cloakroom, festival crowd, or coat check area
- **Lighting:** Well-lit image that works with dark overlay

## Image Sources

You can find suitable images from:
- **Unsplash:** https://unsplash.com/s/photos/cloakroom
- **Pexels:** https://www.pexels.com/search/festival-crowd/
- **Pixabay:** https://pixabay.com/images/search/event/
- Or use your own professional photos from events

## Alternative Images

If you want to use a different image, update the `backgroundImage` prop in:
`src/app/[locale]/page.tsx` (line ~102)

Example:
```tsx
backgroundImage="/images/your-custom-image.jpg"
```

## Notes

- The Hero component automatically adds a dark overlay (50-70% opacity) for text readability
- White text with drop shadow is used when background image is present
- Image is loaded with `priority` flag for faster initial page load
- Supports responsive sizing and optimal quality
