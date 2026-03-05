import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { hasPermission } from "@/lib/auth/permissions";
import connectDB from "@/lib/mongodb";
import { Partner } from "@/lib/models";
import mongoose from "mongoose";

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
  const raw = body.orderNumber ?? body.display_order ?? body.order;
  if (raw === undefined) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * GET /api/partners/[id] - Get single partner
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectDB();
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid partner ID" }, { status: 400 });
    }

    const partner = await Partner.findById(id).lean();

    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    const effectiveOrder = partner.orderNumber ?? partner.order ?? 0;
    return NextResponse.json({
      partner: {
        ...partner,
        orderNumber: effectiveOrder,
        order: effectiveOrder,
      },
    });
  } catch (error: any) {
    console.error("Error in GET /api/partners/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/partners/[id] - Update partner (requires auth + partners.update)
 */
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  
  if (!session || !hasPermission(session.user.role, 'partners.update')) {
    return NextResponse.json(
      { error: 'Unauthorized - partners.update permission required' },
      { status: 401 }
    );
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid partner ID" }, { status: 400 });
    }

    const existingPartner = await Partner.findById(id).select("logo").lean();

    if (!existingPartner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    const nextLogoValue = normalizeLogoValue(
      body.logo_url !== undefined ? body.logo_url : body.logo,
    );
    const existingLogoValue = normalizeLogoValue(existingPartner.logo);
    const isKeepingExistingLogo =
      nextLogoValue !== undefined && nextLogoValue === existingLogoValue;
    if (
      nextLogoValue !== undefined &&
      !isKeepingExistingLogo &&
      !isValidUploadedPartnerLogo(nextLogoValue)
    ) {
      return NextResponse.json(
        { error: "Logo must be uploaded via the platform" },
        { status: 400 },
      );
    }

    // Build update object with only allowed fields
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.logo_url !== undefined) updateData.logo = nextLogoValue;
    if (body.logo !== undefined) updateData.logo = nextLogoValue;
    if (body.website_url !== undefined) updateData.website = body.website_url;
    if (body.website !== undefined) updateData.website = body.website;
    if (body.description !== undefined) updateData.description = body.description;
    const orderNumber = getOrderNumberValue(body);
    if (orderNumber !== undefined) {
      updateData.orderNumber = orderNumber;
      updateData.order = orderNumber;
    }
    if (body.is_published !== undefined) updateData.isActive = body.is_published;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.contactEmail !== undefined) updateData.contactEmail = body.contactEmail;
    if (body.contactPhone !== undefined) updateData.contactPhone = body.contactPhone;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const partner = await Partner.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    const effectiveOrder = partner.orderNumber ?? partner.order ?? 0;
    return NextResponse.json({
      partner: {
        ...partner,
        orderNumber: effectiveOrder,
        order: effectiveOrder,
      },
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/partners/[id]:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/partners/[id] - Delete partner (requires auth + partners.delete)
 */
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  
  if (!session || !hasPermission(session.user.role, 'partners.delete')) {
    return NextResponse.json(
      { error: 'Unauthorized - partners.delete permission required' },
      { status: 401 }
    );
  }

  try {
    const { id } = await context.params;
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid partner ID" }, { status: 400 });
    }

    const partner = await Partner.findByIdAndDelete(id);

    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in DELETE /api/partners/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
