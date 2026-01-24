import connectDB from '@/lib/mongodb';
import { HeroSettings } from '@/lib/models/site';
import { unstable_cache } from 'next/cache';

export async function getHeroSettings(pageKey: string, locale: 'ro' | 'en') {
  const settings = await unstable_cache(
    async () => {
      await connectDB();
      const result = await HeroSettings.findOne({ pageKey }).lean();
      return result;
    },
    [`hero-settings-${pageKey}`],
    {
      tags: ['hero-settings', `hero-settings-${pageKey}`],
      revalidate: 3600,
    }
  )();

  if (!settings) {
    return null;
  }

  const localeData = settings.localeData[locale];

  return {
    title: localeData.title,
    subtitle: localeData.subtitle,
    primaryCTA: localeData.primaryCtaText && localeData.primaryCtaLink
      ? {
          label: localeData.primaryCtaText,
          href: localeData.primaryCtaLink,
        }
      : undefined,
    secondaryCTA: localeData.secondaryCtaText && localeData.secondaryCtaLink
      ? {
          label: localeData.secondaryCtaText,
          href: localeData.secondaryCtaLink,
        }
      : undefined,
    backgroundImage: settings.backgroundImage,
  };
}
