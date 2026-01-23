import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { hasPermission } from "@/lib/auth/permissions";
import connectDB from "@/lib/mongodb";
import { Partner } from "@/lib/models";

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

    const partners = await Partner.find(query).sort({ order: 1 }).lean();

    return NextResponse.json({ partners });
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

    const partner = await Partner.create({
      name: body.name,
      slug: body.slug,
      logo: body.logo_url || body.logo || undefined,
      website: body.website_url || body.website || undefined,
      description: body.description || undefined,
      order: body.display_order || body.order || 0,
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
