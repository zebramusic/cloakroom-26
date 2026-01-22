import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { hasPermission } from '@/lib/auth/permissions';
import connectDB from '@/lib/mongodb';
import { SitePage, AuditLog } from '@/lib/models/site';

// GET - List pages (all versions or just published)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !hasPermission(session.user.role, 'site.read')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'draft' | 'published' | null (all)
    const key = searchParams.get('key'); // filter by specific page key

    const query: any = {};
    if (status) query.status = status;
    if (key) query.key = key;

    const pages = await SitePage.find(query)
      .sort({ key: 1, version: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ pages });
  } catch (error: any) {
    console.error('GET /api/admin/site/pages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}

// POST - Create new page version (draft)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !hasPermission(session.user.role, 'site.write')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { key, slug, localeData } = body;

    // Validate structure
    if (!key || !slug || !localeData?.ro || !localeData?.en) {
      return NextResponse.json(
        { error: 'Invalid page structure' },
        { status: 400 }
      );
    }

    // Get latest version for this key
    const latest = await SitePage.findOne({ key }).sort({ version: -1 });
    const nextVersion = latest ? latest.version + 1 : 1;

    const page = await SitePage.create({
      key,
      slug,
      localeData,
      status: 'draft',
      version: nextVersion,
      createdBy: session.user.id,
    });

    // Audit log
    await AuditLog.create({
      entityType: 'sitePage',
      entityId: page._id,
      entityKey: key,
      action: 'create',
      userId: session.user.id,
      userName: session.user.name || session.user.email || 'Unknown',
      userRole: session.user.role,
      after: page.toObject(),
    });

    return NextResponse.json({ page });
  } catch (error: any) {
    console.error('POST /api/admin/site/pages error:', error);
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    );
  }
}
