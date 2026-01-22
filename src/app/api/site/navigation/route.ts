import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { SiteNavigation } from '@/lib/models/site';
import { unstable_cache } from 'next/cache';

// GET - Get published navigation for public use
async function getPublishedNavigation(key: string, locale: string) {
  return unstable_cache(
    async () => {
      await connectDB();
      const navigation = await SiteNavigation.findOne({
        key,
        status: 'published',
      })
        .sort({ publishedAt: -1 })
        .lean();

      if (!navigation) {
        return null;
      }

      // Return only the locale-specific data
      const items = locale === 'en' && navigation.localeData.en?.items
        ? navigation.localeData.en.items
        : navigation.localeData.ro.items;

      return {
        key: navigation.key,
        items,
        version: navigation.version,
      };
    },
    [`site-navigation-${key}-${locale}`],
    {
      tags: ['site-navigation', `site-navigation-${key}`],
      revalidate: 3600, // 1 hour
    }
  )();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key') || 'main';
    const locale = searchParams.get('locale') || 'ro';

    const navigation = await getPublishedNavigation(key, locale);

    if (!navigation) {
      return NextResponse.json(
        { error: 'No published navigation found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ navigation });
  } catch (error: any) {
    console.error('GET /api/site/navigation error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch navigation' },
      { status: 500 }
    );
  }
}
