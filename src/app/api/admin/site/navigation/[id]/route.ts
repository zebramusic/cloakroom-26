import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { hasPermission } from '@/lib/auth/permissions';
import connectDB from '@/lib/mongodb';
import { SiteNavigation, AuditLog } from '@/lib/models/site';
import mongoose from 'mongoose';

// GET - Get single navigation config
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !hasPermission(session.user.role, 'site.read')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await connectDB();

    const navigation = await SiteNavigation.findById(id).lean();
    if (!navigation) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ navigation });
  } catch (error: any) {
    console.error('GET /api/admin/site/navigation/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch navigation' },
      { status: 500 }
    );
  }
}

// PATCH - Update navigation config
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !hasPermission(session.user.role, 'site.write')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await connectDB();

    const before = await SiteNavigation.findById(id).lean();
    if (!before) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Only drafts can be edited
    if (before.status === 'published') {
      return NextResponse.json(
        { error: 'Cannot edit published version. Create a new draft instead.' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { localeData } = body;

    const navigation = await SiteNavigation.findByIdAndUpdate(
      id,
      { localeData },
      { new: true, runValidators: true }
    );

    // Audit log
    await AuditLog.create({
      entityType: 'siteNavigation',
      entityId: navigation!._id,
      entityKey: navigation!.key,
      action: 'update',
      userId: session.user.id,
      userName: session.user.name || session.user.email || 'Unknown',
      userRole: session.user.role,
      before,
      after: navigation!.toObject(),
    });

    return NextResponse.json({ navigation });
  } catch (error: any) {
    console.error('PATCH /api/admin/site/navigation/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update navigation' },
      { status: 500 }
    );
  }
}

// DELETE - Delete navigation config
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !hasPermission(session.user.role, 'site.write')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await connectDB();

    const navigation = await SiteNavigation.findById(id);
    if (!navigation) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Cannot delete published version
    if (navigation.status === 'published') {
      return NextResponse.json(
        { error: 'Cannot delete published version' },
        { status: 400 }
      );
    }

    await navigation.deleteOne();

    // Audit log
    await AuditLog.create({
      entityType: 'siteNavigation',
      entityId: navigation._id,
      entityKey: navigation.key,
      action: 'delete',
      userId: session.user.id,
      userName: session.user.name || session.user.email || 'Unknown',
      userRole: session.user.role,
      before: navigation.toObject(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE /api/admin/site/navigation/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete navigation' },
      { status: 500 }
    );
  }
}
