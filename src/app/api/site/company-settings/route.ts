import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { CompanySettings } from "@/lib/models/site";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const localeParam = searchParams.get("locale");
    const locale = localeParam === "en" ? "en" : "ro";

    await connectDB();

    const settings = await CompanySettings.findOne({ key: "main" }).lean();

    if (!settings) {
      return NextResponse.json({ settings: null });
    }

    const localeData = settings.localeData?.[locale];

    return NextResponse.json({
      settings: {
        companyName: localeData?.companyName || "",
        tagline: localeData?.tagline || "",
        description: localeData?.description || "",
        address: localeData?.address || "",
        phone: localeData?.phone || "",
        email: localeData?.email || "",
        businessHours: localeData?.businessHours || "",
        socialNetworks: settings.socialNetworks || {},
        legalInfo: settings.legalInfo || {},
        logo: settings.logo,
      },
    });
  } catch (error: any) {
    console.error("GET /api/site/company-settings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch company settings" },
      { status: 500 },
    );
  }
}
