import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { PortfolioImage, PortfolioItem } from '@/lib/models';
import { hasPermission } from '@/lib/auth/permissions';
import mongoose from 'mongoose';
import { deleteImageVariants } from '@/lib/utils/image-processor';

// PATCH /api/admin/portfolio/[id]/images/[imageId] - Update image metadata
export async function PATCH(
  request: Request,
  { params }: { params: { id: string; imageId: string } }
) {
  const session = await auth();
  
  if (!session || !hasPermission(session.user.role, 'portfolio.write')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(params.imageId)) {
    return NextResponse.json({ error: 'Invalid image ID' }, { status: 400 });
  }

  try {
    const data = await request.json();
    
    const updated = await PortfolioImage.findByIdAndUpdate(
      params.imageId,
      { $set: data },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    return NextResponse.json({ image: updated });
  } catch (error: any) {
    console.error('Portfolio image update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/portfolio/[id]/images/[imageId] - Delete image
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; imageId: string } }
) {
  const session = await auth();
  
  if (!session || !hasPermission(session.user.role, 'portfolio.delete')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(params.imageId)) {
    return NextResponse.json({ error: 'Invalid image ID' }, { status: 400 });
  }

  try {
    const image = await PortfolioImage.findById(params.imageId).lean();
    
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Delete image files
    await deleteImageVariants(image.variants);
    
    // Delete from DB
    await PortfolioImage.findByIdAndDelete(params.imageId);

    // If this was the cover image, unset it
    await PortfolioItem.updateOne(
      { _id: params.id, coverImageId: params.imageId },
      { $unset: { coverImageId: 1 } }
    );

    // If there are remaining images, optionally set first as cover
    const remainingImages = await PortfolioImage.find({ portfolioItemId: params.id })
      .sort({ orderIndex: 1 })
      .limit(1)
      .lean();
    
    if (remainingImages.length > 0) {
      const item = await PortfolioItem.findById(params.id).lean();
      if (!item?.coverImageId) {
        await PortfolioItem.findByIdAndUpdate(params.id, {
          $set: { coverImageId: remainingImages[0]._id },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Portfolio image delete error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
