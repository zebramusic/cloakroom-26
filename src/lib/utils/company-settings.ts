import { unstable_cache } from 'next/cache';
import connectDB from '@/lib/mongodb';
import { CompanySettings } from '@/lib/models/site';

export async function getCompanySettings(locale: 'ro' | 'en') {
  const fetchSettings = unstable_cache(
    async () => {
      await connectDB();
      const settings = await CompanySettings.findOne({ key: 'main' }).lean();
      return settings;
    },
    ['company-settings'],
    {
      tags: ['company-settings'],
      revalidate: 3600, // 1 hour
    }
  );

  const settings = await fetchSettings();

  if (!settings) {
    return null;
  }

  const localeData = settings.localeData[locale];

  return {
    companyName: localeData.companyName,
    tagline: localeData.tagline,
    description: localeData.description,
    address: localeData.address,
    phone: localeData.phone,
    email: localeData.email,
    businessHours: localeData.businessHours,
    socialNetworks: settings.socialNetworks,
    legalInfo: settings.legalInfo,
    logo: settings.logo,
  };
}
