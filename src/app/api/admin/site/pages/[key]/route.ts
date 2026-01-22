import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { hasPermission } from '@/lib/auth/permissions';
import connectDB from '@/lib/mongodb';
import { SitePage, AuditLog } from '@/lib/models/site';

// GET - Get page by key (latest draft or published)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const session = await auth();
    if (!session || !hasPermission(session.user.role, 'site.read')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { key } = await params;
    await connectDB();

    // Get latest draft or published version
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'draft';

    const page = await SitePage.findOne({ key, status })
      .sort({ version: -1 })
      .lean();

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ page });
  } catch (error: any) {
    console.error('GET /api/admin/site/pages/[key] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}

// PATCH - Update page (only drafts)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const session = await auth();
    if (!session || !hasPermission(session.user.role, 'site.write')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { key } = await params;
    await connectDB();

    // Get latest draft
    const existing = await SitePage.findOne({ key, status: 'draft' })
      .sort({ version: -1 });

    if (!existing) {
      return NextResponse.json(
        { error: 'No draft version found. Create a new draft first.' },
        { status: 404 }
      );
    }

    const before = existing.toObject();
    const body = await request.json();
    const { localeData } = body;

    // Update the draft
    existing.localeData = localeData;
    await existing.save();

    // Audit log
    await AuditLog.create({
      entityType: 'sitePage',
      entityId: existing._id,
      entityKey: key,
      action: 'update',
      userId: session.user.id,
      userName: session.user.name || session.user.email || 'Unknown',
      userRole: session.user.role,
      before,
      after: existing.toObject(),
    });

    return NextResponse.json({ page: existing });
  } catch (error: any) {
    console.error('PATCH /api/admin/site/pages/[key] error:', error);
    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    );
  }
}
