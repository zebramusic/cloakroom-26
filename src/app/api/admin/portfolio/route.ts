import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { PortfolioItem } from '@/lib/models';
import { hasPermission } from '@/lib/auth/permissions';

// GET /api/admin/portfolio - List all portfolio items
export async function GET(request: Request) {
  const session = await auth();
  
  if (!session || !hasPermission(session.user.role, 'portfolio.view')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const status = searchParams.get('status'); // 'published', 'draft', 'all'
  const featured = searchParams.get('featured');
  const search = searchParams.get('search');

  const skip = (page - 1) * limit;
  
  // Build query
  const query: any = {};
  
  if (status === 'published') {
    query.isPublished = true;
  } else if (status === 'draft') {
    query.isPublished = false;
  }
  
  if (featured === 'true') {
    query.isFeatured = true;
  }
  
  if (search) {
    query.$text = { $search: search };
  }

  try {
    const [items, total] = await Promise.all([
      PortfolioItem.find(query)
        .sort({ orderIndex: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      PortfolioItem.countDocuments(query),
    ]);

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Portfolio list error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/admin/portfolio - Create new portfolio item
export async function POST(request: Request) {
  const session = await auth();
  
  if (!session || !hasPermission(session.user.role, 'portfolio.create')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.slug || !data.localeContent?.ro?.title) {
      return NextResponse.json(
        { error: 'Slug and Romanian title are required' },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await PortfolioItem.findOne({ slug: data.slug }).lean();
    if (existing) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 409 }
      );
    }

    // Get next orderIndex
    const lastItem = await PortfolioItem.findOne()
      .sort({ orderIndex: -1 })
      .lean();
    const nextOrderIndex = (lastItem?.orderIndex || 0) + 1;

    const item = await PortfolioItem.create({
      ...data,
      orderIndex: nextOrderIndex,
      publishedAt: data.isPublished ? new Date() : undefined,
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error: any) {
    console.error('Portfolio create error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
