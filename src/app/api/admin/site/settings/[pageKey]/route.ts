import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { hasPermission } from '@/lib/auth/permissions';
import connectDB from '@/lib/mongodb';
import { HeroSettings } from '@/lib/models/site';
import { revalidateTag } from 'next/cache';

// GET - Fetch single page hero settings
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ pageKey: string }> }
) {
  try {
    const { pageKey } = await context.params;
    const session = await auth();
    
    if (!session || !hasPermission(session.user.role, 'site.read')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const settings = await HeroSettings.findOne({ pageKey }).lean();

    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error('GET /api/admin/site/settings/[pageKey] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PATCH - Update hero settings for a page
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ pageKey: string }> }
) {
  try {
    const { pageKey } = await context.params;
    const session = await auth();
    
    if (!session || !hasPermission(session.user.role, 'site.write')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { localeData, backgroundImage } = body;

    await connectDB();

    // Upsert (update or create)
    const settings = await HeroSettings.findOneAndUpdate(
      { pageKey },
      {
        pageKey,
        localeData,
        backgroundImage,
        updatedBy: session.user.id,
      },
      { 
        new: true, 
        upsert: true,
        runValidators: true 
      }
    );
// Revalidate the cache for this page's hero settings
    revalidateTag('hero-settings');
    revalidateTag(`hero-settings-${pageKey}`);

    
    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error('PATCH /api/admin/site/settings/[pageKey] error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
