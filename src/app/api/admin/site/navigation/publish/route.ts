import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { hasPermission } from '@/lib/auth/permissions';
import connectDB from '@/lib/mongodb';
import { SiteNavigation, AuditLog } from '@/lib/models/site';
import { revalidateTag } from 'next/cache';

// POST - Publish navigation (set status to published, unpublish others)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !hasPermission(session.user.role, 'site.publish')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id, key } = await request.json();

    if (!id || !key) {
      return NextResponse.json(
        { error: 'ID and key required' },
        { status: 400 }
      );
    }

    // Unpublish current published version
    await SiteNavigation.updateMany(
      { key, status: 'published' },
      { status: 'draft' }
    );

    // Publish this version
    const navigation = await SiteNavigation.findByIdAndUpdate(
      id,
      {
        status: 'published',
        publishedAt: new Date(),
        publishedBy: session.user.id,
      },
      { new: true }
    );

    if (!navigation) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Audit log
    await AuditLog.create({
      entityType: 'siteNavigation',
      entityId: navigation._id,
      entityKey: key,
      action: 'publish',
      userId: session.user.id,
      userName: session.user.name || session.user.email || 'Unknown',
      userRole: session.user.role,
      after: navigation.toObject(),
      metadata: { publishedVersion: navigation.version },
    });

    // Invalidate cache
    revalidateTag('site-navigation');
    revalidateTag(`site-navigation-${key}`);

    return NextResponse.json({ navigation });
  } catch (error: any) {
    console.error('POST /api/admin/site/navigation/publish error:', error);
    return NextResponse.json(
      { error: 'Failed to publish navigation' },
      { status: 500 }
    );
  }
}
