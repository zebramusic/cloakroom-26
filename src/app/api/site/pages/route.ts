import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { SitePage } from '@/lib/models/site';
import { unstable_cache } from 'next/cache';

// GET - Get published page for public use
async function getPublishedPage(key: string, locale: string) {
  return unstable_cache(
    async () => {
      await connectDB();
      const page = await SitePage.findOne({
        key,
        status: 'published',
      })
        .sort({ publishedAt: -1 })
        .lean();

      if (!page) {
        return null;
      }

      // Return only the locale-specific data
      const localeData = locale === 'en' && page.localeData.en
        ? page.localeData.en
        : page.localeData.ro;

      return {
        key: page.key,
        slug: page.slug,
        ...localeData,
        version: page.version,
      };
    },
    [`site-page-${key}-${locale}`],
    {
      tags: ['site-pages', `site-page-${key}`],
      revalidate: 3600, // 1 hour
    }
  )();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const locale = searchParams.get('locale') || 'ro';

    if (!key) {
      return NextResponse.json(
        { error: 'Page key required' },
        { status: 400 }
      );
    }

    const page = await getPublishedPage(key, locale);

    if (!page) {
      return NextResponse.json(
        { error: 'No published page found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ page });
  } catch (error: any) {
    console.error('GET /api/site/pages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}
