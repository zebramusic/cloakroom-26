import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { PortfolioItem, PortfolioImage } from '@/lib/models';

// GET /api/portfolio/[slug] - Public portfolio item detail
export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  await connectDB();

  try {
    const item = await PortfolioItem.findOne({
      slug,
      isPublished: true,
    }).lean();

    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Get all images for this item
    const images = await PortfolioImage.find({ portfolioItemId: item._id })
      .sort({ orderIndex: 1 })
      .lean();

    return NextResponse.json({ item, images });
  } catch (error: any) {
    console.error('Portfolio public detail error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
