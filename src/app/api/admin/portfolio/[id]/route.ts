import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { PortfolioItem, PortfolioImage } from '@/lib/models';
import { hasPermission } from '@/lib/auth/permissions';
import mongoose from 'mongoose';
import { deleteImageVariants } from '@/lib/utils/image-processor';

// GET /api/admin/portfolio/[id] - Get single portfolio item
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  
  if (!session || !hasPermission(session.user.role, 'portfolio.read')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const item = await PortfolioItem.findById(params.id).lean();
    
    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Get images
    const images = await PortfolioImage.find({ portfolioItemId: params.id })
      .sort({ orderIndex: 1 })
      .lean();

    return NextResponse.json({ item, images });
  } catch (error: any) {
    console.error('Portfolio get error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/admin/portfolio/[id] - Update portfolio item
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  
  if (!session || !hasPermission(session.user.role, 'portfolio.write')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const data = await request.json();
    
    // If slug changed, check uniqueness
    if (data.slug) {
      const existing = await PortfolioItem.findOne({
        slug: data.slug,
        _id: { $ne: params.id },
      }).lean();
      
      if (existing) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 409 }
        );
      }
    }

    // If publishing for first time, set publishedAt
    const item = await PortfolioItem.findById(params.id);
    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (data.isPublished && !item.isPublished && !item.publishedAt) {
      data.publishedAt = new Date();
    }

    const updated = await PortfolioItem.findByIdAndUpdate(
      params.id,
      { $set: data },
      { new: true, runValidators: true }
    ).lean();

    return NextResponse.json({ item: updated });
  } catch (error: any) {
    console.error('Portfolio update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/portfolio/[id] - Delete portfolio item
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  
  if (!session || !hasPermission(session.user.role, 'portfolio.delete')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    // Get all images
    const images = await PortfolioImage.find({ portfolioItemId: params.id }).lean();
    
    // Delete image files
    for (const image of images) {
      await deleteImageVariants(image.variants);
    }
    
    // Delete images from DB
    await PortfolioImage.deleteMany({ portfolioItemId: params.id });
    
    // Delete item
    const deleted = await PortfolioItem.findByIdAndDelete(params.id);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Portfolio delete error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
