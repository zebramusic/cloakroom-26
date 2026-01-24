import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { hasPermission } from '@/lib/auth/permissions';
import connectDB from '@/lib/mongodb';
import { CompanySettings } from '@/lib/models/site';
import { revalidateTag } from 'next/cache';

// GET - Fetch company settings
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !hasPermission(session.user.role, 'site.read')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const settings = await CompanySettings.findOne({ key: 'main' }).lean();

    console.log('[CompanySettings] GET - Found settings:', settings ? 'Yes' : 'No', settings?._id);

    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error('GET /api/admin/site/company-settings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PATCH - Update company settings
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !hasPermission(session.user.role, 'site.write')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { localeData, socialNetworks, legalInfo, logo } = body;

    console.log('[CompanySettings] Saving settings:', { localeData, socialNetworks, legalInfo });

    await connectDB();

    // Upsert (update or create)
    const settings = await CompanySettings.findOneAndUpdate(
      { key: 'main' },
      {
        key: 'main',
        localeData,
        socialNetworks,
        legalInfo,
        logo,
        updatedBy: session.user.id,
      },
      { 
        new: true, 
        upsert: true,
        runValidators: true 
      }
    );

    console.log('[CompanySettings] Settings saved successfully:', settings._id);

    // Revalidate cache
    revalidateTag('company-settings');

    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error('PATCH /api/admin/site/company-settings error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
