import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { PortfolioItem, PortfolioImage } from '@/lib/models';

// GET /api/portfolio - Public list of portfolio items
export async function GET(request: Request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const featured = searchParams.get('featured');
  const limit = parseInt(searchParams.get('limit') || '20');
  const tag = searchParams.get('tag');
  const year = searchParams.get('year');
  const eventType = searchParams.get('eventType');

  const query: any = { isPublished: true };

  if (featured === 'true') {
    query.isFeatured = true;
  }

  if (tag) {
    query.tags = tag;
  }

  if (year) {
    const startYear = new Date(`${year}-01-01`);
    const endYear = new Date(`${year}-12-31`);
    query['eventMeta.startsAt'] = { $gte: startYear, $lte: endYear };
  }

  if (eventType) {
    query['eventMeta.eventType'] = eventType;
  }

  try {
    const items = await PortfolioItem.find(query)
      .sort({ isFeatured: -1, orderIndex: 1, publishedAt: -1 })
      .limit(limit)
      .lean();

    // Get cover images for each item
    const itemsWithImages = await Promise.all(
      items.map(async (item) => {
        if (item.coverImageId) {
          const coverImage = await PortfolioImage.findById(item.coverImageId)
            .select('variants altText')
            .lean();
          return { ...item, coverImage };
        }
        return item;
      })
    );

    return NextResponse.json({ items: itemsWithImages });
  } catch (error: any) {
    console.error('Portfolio public list error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
