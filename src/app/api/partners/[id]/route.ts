import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/partners/[id] - Get single partner
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) {
      console.error("Error fetching partner:", error);
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    return NextResponse.json({ partner: data });
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
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    // Build update object with only allowed fields
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.logo_url !== undefined) updateData.logo_url = body.logo_url;
    if (body.website_url !== undefined) updateData.website_url = body.website_url;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.display_order !== undefined) updateData.display_order = body.display_order;
    if (body.is_published !== undefined) updateData.is_published = body.is_published;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const { data, error } = (await (supabase
      .from("partners") as any)
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()) as any;

    if (error) {
      console.error("Error updating partner:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ partner: data });
  } catch (error: any) {
    console.error("Error in PATCH /api/partners/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/partners/[id] - Delete partner
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("partners")
      .delete()
      .eq("id", params.id);

    if (error) {
      console.error("Error deleting partner:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
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
