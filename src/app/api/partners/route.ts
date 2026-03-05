import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { hasPermission } from "@/lib/auth/permissions";
import connectDB from "@/lib/mongodb";
import { Partner } from "@/lib/models";

function isValidUploadedPartnerLogo(logo?: string) {
  if (!logo) return true;
  if (logo.startsWith("http://") || logo.startsWith("https://")) {
    try {
      const url = new URL(logo);
      return (
        url.pathname.startsWith("/uploads/partners/") ||
        url.pathname.startsWith("/partners/")
      );
    } catch {
      return false;
    }
  }
  return (
    logo.startsWith("/uploads/partners/") ||
    logo.startsWith("/partners/")
  );
}

function normalizeLogoValue(logo?: string | null) {
  if (!logo) return undefined;
  return logo;
}

function getOrderNumberValue(body: any) {
  const raw = body.orderNumber ?? body.display_order ?? body.order ?? 0;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * GET /api/partners - Get all partners (public)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");

    await connectDB();
    
    let query: any = {};
    if (published === "true") {
      query.isActive = true;
    }

    const partners = await Partner.find(query).lean();
    const normalizedPartners = partners
      .map((partner) => {
        const effectiveOrder = partner.orderNumber ?? partner.order ?? 0;
        return {
          ...partner,
          orderNumber: effectiveOrder,
          order: effectiveOrder,
        };
      })
      .sort((a, b) => a.orderNumber - b.orderNumber);

    return NextResponse.json({ partners: normalizedPartners });
  } catch (error: any) {
    console.error("Error in GET /api/partners:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/partners - Create new partner (requires auth + partners.create)
 */
export async function POST(request: Request) {
  const session = await auth();
  
  if (!session || !hasPermission(session.user.role, 'partners.create')) {
    return NextResponse.json(
      { error: 'Unauthorized - partners.create permission required' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    await connectDB();

    const logoValue = normalizeLogoValue(body.logo_url || body.logo);
    if (!isValidUploadedPartnerLogo(logoValue)) {
      return NextResponse.json(
        { error: "Logo must be uploaded via the platform" },
        { status: 400 },
      );
    }

    const orderNumber = getOrderNumberValue(body);

    const partner = await Partner.create({
      name: body.name,
      slug: body.slug,
      logo: logoValue || undefined,
      website: body.website_url || body.website || undefined,
      description: body.description || undefined,
      orderNumber,
      order: orderNumber,
      isActive: body.is_published ?? body.isActive ?? true,
      contactEmail: body.contactEmail,
      contactPhone: body.contactPhone,
    });

    return NextResponse.json({ partner }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/partners:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
