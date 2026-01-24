import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { hasPermission } from '@/lib/auth/permissions';
import connectDB from '@/lib/mongodb';
import { HeroSettings } from '@/lib/models/site';

// GET - Fetch all hero settings
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !hasPermission(session.user.role, 'site.read')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const settings = await HeroSettings.find({}).sort({ pageKey: 1 }).lean();

    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error('GET /api/admin/site/settings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}
