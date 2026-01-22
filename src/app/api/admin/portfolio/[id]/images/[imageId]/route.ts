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
  context: { params: Promise<{ id: string; imageId: string }> }
) {
  const { id, imageId } = await context.params;
  const session = await auth();
  
  if (!session || !hasPermission(session.user.role, 'portfolio.update')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(imageId)) {
    return NextResponse.json({ error: 'Invalid image ID' }, { status: 400 });
  }

  try {
    const data = await request.json();
    
    const updated = await PortfolioImage.findByIdAndUpdate(
      imageId,
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
  context: { params: Promise<{ id: string; imageId: string }> }
) {
  const { id, imageId } = await context.params;
  const session = await auth();
  
  if (!session || !hasPermission(session.user.role, 'portfolio.delete')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(imageId)) {
    return NextResponse.json({ error: 'Invalid image ID' }, { status: 400 });
  }

  try {
    const image = await PortfolioImage.findById(imageId).lean();
    
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Delete image files
    await deleteImageVariants(image.variants);
    
    // Delete from DB
    await PortfolioImage.findByIdAndDelete(imageId);

    // If this was the cover image, unset it
    await PortfolioItem.updateOne(
      { _id: id, coverImageId: imageId },
      { $unset: { coverImageId: 1 } }
    );

    // If there are remaining images, optionally set first as cover
    const remainingImages = await PortfolioImage.find({ portfolioItemId: id })
      .sort({ orderIndex: 1 })
      .limit(1)
      .lean();
    
    if (remainingImages.length > 0) {
      const item = await PortfolioItem.findById(id).lean();
      if (!item?.coverImageId) {
        await PortfolioItem.findByIdAndUpdate(id, {
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
