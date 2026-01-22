import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { hasPermission } from '@/lib/auth/permissions';
import connectDB from '@/lib/mongodb';
import { SiteNavigation, AuditLog } from '@/lib/models/site';

// GET - List navigation configs (all versions or just published)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !hasPermission(session.user.role, 'site.read')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key') || 'main';
    const status = searchParams.get('status'); // 'draft' | 'published' | null (all)

    const query: any = { key };
    if (status) {
      query.status = status;
    }

    const items = await SiteNavigation.find(query)
      .sort({ version: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error('GET /api/admin/site/navigation error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch navigation' },
      { status: 500 }
    );
  }
}

// POST - Create new navigation config (draft)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !hasPermission(session.user.role, 'site.write')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { key = 'main', localeData } = body;

    // Validate structure
    if (!localeData?.ro?.items || !localeData?.en?.items) {
      return NextResponse.json(
        { error: 'Invalid navigation structure' },
        { status: 400 }
      );
    }

    // Get latest version for this key
    const latest = await SiteNavigation.findOne({ key }).sort({ version: -1 });
    const nextVersion = latest ? latest.version + 1 : 1;

    const navigation = await SiteNavigation.create({
      key,
      localeData,
      status: 'draft',
      version: nextVersion,
      createdBy: session.user.id,
    });

    // Audit log
    await AuditLog.create({
      entityType: 'siteNavigation',
      entityId: navigation._id,
      entityKey: key,
      action: 'create',
      userId: session.user.id,
      userName: session.user.name || session.user.email || 'Unknown',
      userRole: session.user.role,
      after: navigation.toObject(),
    });

    return NextResponse.json({ navigation });
  } catch (error: any) {
    console.error('POST /api/admin/site/navigation error:', error);
    return NextResponse.json(
      { error: 'Failed to create navigation' },
      { status: 500 }
    );
  }
}
