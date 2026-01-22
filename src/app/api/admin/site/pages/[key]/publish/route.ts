import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { hasPermission } from '@/lib/auth/permissions';
import connectDB from '@/lib/mongodb';
import { SitePage, AuditLog } from '@/lib/models/site';
import { revalidateTag } from 'next/cache';

// POST - Publish page (set status to published, unpublish others)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const session = await auth();
    if (!session || !hasPermission(session.user.role, 'site.publish')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { key } = await params;
    await connectDB();

    // Get latest draft
    const draft = await SitePage.findOne({ key, status: 'draft' })
      .sort({ version: -1 });

    if (!draft) {
      return NextResponse.json(
        { error: 'No draft version to publish' },
        { status: 404 }
      );
    }

    // Unpublish current published version
    await SitePage.updateMany(
      { key, status: 'published' },
      { status: 'draft' }
    );

    // Publish this version
    draft.status = 'published';
    draft.publishedAt = new Date();
    draft.publishedBy = session.user.id as any;
    await draft.save();

    // Audit log
    await AuditLog.create({
      entityType: 'sitePage',
      entityId: draft._id,
      entityKey: key,
      action: 'publish',
      userId: session.user.id,
      userName: session.user.name || session.user.email || 'Unknown',
      userRole: session.user.role,
      after: draft.toObject(),
      metadata: { publishedVersion: draft.version },
    });

    // Invalidate cache
    revalidateTag('site-pages');
    revalidateTag(`site-page-${key}`);

    return NextResponse.json({ page: draft });
  } catch (error: any) {
    console.error('POST /api/admin/site/pages/[key]/publish error:', error);
    return NextResponse.json(
      { error: 'Failed to publish page' },
      { status: 500 }
    );
  }
}
