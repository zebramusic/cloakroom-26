import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Partner } from "@/lib/models";
import mongoose from "mongoose";

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

    return NextResponse.json({ partner });
  } catch (error: any) {
    console.error("Error in GET /api/partners/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/partners/[id] - Update partner
 */
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid partner ID" }, { status: 400 });
    }

    // Build update object with only allowed fields
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.logo_url !== undefined) updateData.logo = body.logo_url;
    if (body.logo !== undefined) updateData.logo = body.logo;
    if (body.website_url !== undefined) updateData.website = body.website_url;
    if (body.website !== undefined) updateData.website = body.website;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.display_order !== undefined) updateData.order = body.display_order;
    if (body.order !== undefined) updateData.order = body.order;
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

    return NextResponse.json({ partner });
  } catch (error: any) {
    console.error("Error in PATCH /api/partners/[id]:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/partners/[id] - Delete partner
 */
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
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
