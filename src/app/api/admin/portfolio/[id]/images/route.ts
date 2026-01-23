import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { PortfolioItem, PortfolioImage } from '@/lib/models';
import { hasPermission } from '@/lib/auth/permissions';
import mongoose from 'mongoose';
import { writeFile } from 'fs/promises';
import path from 'path';
import { generateImageVariants } from '@/lib/utils/image-processor';

// GET /api/admin/portfolio/[id]/images - List images for item
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await auth();
  
  if (!session || !hasPermission(session.user.role, 'portfolio.view')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const images = await PortfolioImage.find({ portfolioItemId: id })
      .sort({ orderIndex: 1 })
      .lean();

    return NextResponse.json({ images });
  } catch (error: any) {
    console.error('Portfolio images list error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/admin/portfolio/[id]/images - Upload new image
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await auth();
  
  if (!session || !hasPermission(session.user.role, 'portfolio.update')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    // Verify item exists
    const item = await PortfolioItem.findById(id);
    if (!item) {
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 });
    }

    // Count existing images (limit 20)
    const count = await PortfolioImage.countDocuments({ portfolioItemId: id });
    if (count >= 20) {
      return NextResponse.json(
        { error: 'Maximum 20 images per item' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const altTextRo = formData.get('altText.ro') as string || '';
    const altTextEn = formData.get('altText.en') as string || '';
    const captionRo = formData.get('caption.ro') as string || '';
    const captionEn = formData.get('caption.en') as string || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only JPEG, PNG, and WebP images are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (8MB max)
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 8MB' },
        { status: 400 }
      );
    }

    // Save to temp location first
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Use /tmp directory in Vercel (writable in serverless)
    const tempDir = '/tmp';
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const tempPath = path.join(tempDir, `${timestamp}-${sanitizedName}`);
    
    await writeFile(tempPath, buffer);

    // Generate variants
    const variants = await generateImageVariants(tempPath, id, sanitizedName);

    // Get next orderIndex
    const lastImage = await PortfolioImage.findOne({ portfolioItemId: id })
      .sort({ orderIndex: -1 })
      .lean();
    const nextOrderIndex = (lastImage?.orderIndex || 0) + 1;

    // Create image record
    const image = await PortfolioImage.create({
      portfolioItemId: id,
      variants,
      width: variants.width,
      height: variants.height,
      altText: {
        ro: altTextRo,
        en: altTextEn,
      },
      caption: {
        ro: captionRo,
        en: captionEn,
      },
      orderIndex: nextOrderIndex,
    });

    // If this is the first image, set as cover
    if (count === 0) {
      await PortfolioItem.findByIdAndUpdate(id, {
        $set: { coverImageId: image._id },
      });
    }

    // Clean up temp file
    const fs = require('fs').promises;
    try {
      await fs.unlink(tempPath);
    } catch (e) {
      // Ignore cleanup errors
    }

    return NextResponse.json({ image }, { status: 201 });
  } catch (error: any) {
    console.error('Portfolio image upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
