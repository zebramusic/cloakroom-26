# Hero Image Upload Guide

## Current Implementation ✅

The hero section image upload functionality is **already fully implemented** in the site builder. Here's how to use it:

## How to Upload Hero Image

### Step 1: Access Site Builder
1. Login as admin at: https://cloakroom-26.vercel.app/admin/login
2. Navigate to **Site Builder**: `/admin/site`
3. Click on **Pages** module

### Step 2: Edit Home Page
1. Find "Home" page in the list
2. Click "Edit" button
3. If no home page exists, create one with key "home"

### Step 3: Edit Hero Block
1. In the page editor, find or add a **Hero Block**
2. The hero block editor includes:
   - Headline
   - Subheadline
   - Primary CTA (text + link)
   - Secondary CTA (text + link)
   - Alignment (left/center/right)
   - **Background Image** field ← This is where you upload!

### Step 4: Upload Image
Two ways to set background image:

**Option A: Upload New Image**
1. Click the Upload button (📤 icon) next to "Background Image" field
2. Select an image file (JPG, PNG, WebP)
3. Image will be uploaded to `/uploads/site/general/`
4. URL will automatically populate in the field

**Option B: Use Existing Image**
1. Manually enter image path in the "Background Image" field
2. Use format: `/uploads/site/general/your-image.jpg`
3. Or use external URL: `https://example.com/image.jpg`

### Step 5: Preview
- Image preview appears below the field
- Click "Preview" button to see full page preview
- Remove image by clicking X button

### Step 6: Publish
1. Click "Publish" button to make changes live
2. Home page will now display with your hero image

## Technical Details

### Files Involved
- **Upload Handler**: `/src/components/admin/site/BlockEditor.tsx` (line 54-87)
- **API Route**: `/api/admin/site/media` (handles image uploads)
- **Block Renderer**: `/src/components/site/blocks/HeroBlock.tsx`
- **Model**: `/src/lib/models/site.ts` (SitePage schema)

### Storage
- **Development**: `public/uploads/site/general/`
- **Production**: Vercel Blob storage (automatically switches based on NODE_ENV)

### Image Processing
- Uploaded images are stored as-is (no automatic resizing for hero)
- Supported formats: JPG, PNG, WebP, GIF
- Recommended size: 1920x1080px or larger for high-quality display
- File size limit: 8MB (configurable in upload API)

### CSS Rendering
The hero block applies background image with:
```css
background-image: url(${data.backgroundImage})
background-size: cover
background-position: center
```

Plus a dark overlay (`bg-black/50`) for text readability.

## Example Usage

### Creating a New Hero Block
1. Go to `/admin/site/pages`
2. Edit "Home" page
3. Click "Add Block" → Select "Hero"
4. Fill in:
   - **Headline**: "Garderobă Profesională pentru Evenimente"
   - **Subheadline**: "Soluții complete de garderobă pentru evenimente..."
   - **Primary CTA Text**: "Cere Ofertă"
   - **Primary CTA Link**: "/ro/cere-oferta"
   - **Background Image**: Upload your hero image
5. Save and Publish

### Result
Your home page (`/` or `/ro`) will display:
- Full-width hero section
- Your uploaded image as background
- Dark overlay for contrast
- White text (headline + subheadline)
- CTA buttons

## Troubleshooting

### Image Not Showing
1. Check that home page is **Published** (not just Draft)
2. Verify image URL is correct (starts with `/uploads/` or `https://`)
3. Check browser console for 404 errors
4. Ensure image uploaded successfully (check Media Library)

### Image Quality Issues
- Use high-resolution images (min 1920px wide)
- Optimize images before upload (use tools like TinyPNG)
- Avoid images >2MB for faster loading

### Can't Upload Images
1. Verify you have `site.media` permission
2. Check BLOB_READ_WRITE_TOKEN is set in Vercel (for production)
3. Check file size is under limit
4. Try different image format (JPG instead of PNG)

## Alternative: Use Media Library

You can also:
1. Go to `/admin/site/media`
2. Upload images to Media Library first
3. Copy the URL
4. Paste URL into hero block's "Background Image" field

This allows reusing images across multiple blocks/pages.

## Current Status

✅ Hero image upload functionality fully working
✅ Image preview in admin panel
✅ Automatic Blob storage in production
✅ Manual URL entry supported
✅ Remove image button
✅ Live preview available

No code changes needed - feature is production-ready!
