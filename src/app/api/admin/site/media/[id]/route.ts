import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { hasPermission } from '@/lib/auth/permissions';
import connectDB from '@/lib/mongodb';
import { MediaAsset } from '@/lib/models/site';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import mongoose from 'mongoose';

// PATCH - Update media metadata
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !hasPermission(session.user.role, 'site.media')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await connectDB();

    const body = await request.json();
    const { altText, caption, tags } = body;

    const asset = await MediaAsset.findByIdAndUpdate(
      id,
      { altText, caption, tags },
      { new: true, runValidators: true }
    );

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    return NextResponse.json({ asset });
  } catch (error: any) {
    console.error('PATCH /api/admin/site/media/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update media' },
      { status: 500 }
    );
  }
}

// DELETE - Delete media asset
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !hasPermission(session.user.role, 'site.media')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await connectDB();

    const asset = await MediaAsset.findById(id);
    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    // Delete file from filesystem
    const filepath = path.join(process.cwd(), 'public', asset.url);
    if (existsSync(filepath)) {
      await unlink(filepath);
    }

    // Delete from database
    await asset.deleteOne();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE /api/admin/site/media/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    );
  }
}
