import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { PortfolioItem } from '@/lib/models';
import { hasPermission } from '@/lib/auth/permissions';

// POST /api/admin/portfolio/reorder - Bulk reorder items
export async function POST(request: Request) {
  const session = await auth();
  
  if (!session || !hasPermission(session.user.role, 'portfolio.update')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  try {
    const { items } = await request.json();
    
    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Items must be an array' },
        { status: 400 }
      );
    }

    // Update each item's orderIndex
    const operations = items.map((item: { id: string; orderIndex: number }, index) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { orderIndex: index } },
      },
    }));

    await PortfolioItem.bulkWrite(operations);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Portfolio reorder error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
