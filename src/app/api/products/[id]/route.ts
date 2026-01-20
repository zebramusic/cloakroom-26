import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/products/[id] - Get single product with variants
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    // Fetch product
    const { data: product, error: productError } = await (supabase
      .from("products") as any)
      .select(`
        *,
        category:product_categories(id, name_ro, name_en, slug),
        variants:product_variants(*),
        images:product_images(*)
      `)
      .eq("id", params.id)
      .single();

    if (productError) {
      console.error("Error fetching product:", productError);
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error("Error in GET /api/products/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/products/[id] - Update product
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    // Build update object
    const updateData: any = {};
    if (body.category_id !== undefined) updateData.category_id = body.category_id;
    if (body.name_ro !== undefined) updateData.name_ro = body.name_ro;
    if (body.name_en !== undefined) updateData.name_en = body.name_en;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.sku !== undefined) updateData.sku = body.sku;
    if (body.description_ro !== undefined) updateData.description_ro = body.description_ro;
    if (body.description_en !== undefined) updateData.description_en = body.description_en;
    if (body.features_ro !== undefined) updateData.features_ro = body.features_ro;
    if (body.features_en !== undefined) updateData.features_en = body.features_en;
    if (body.base_price !== undefined) updateData.base_price = body.base_price;
    if (body.tax_rate !== undefined) updateData.tax_rate = body.tax_rate;
    if (body.has_variants !== undefined) updateData.has_variants = body.has_variants;
    if (body.track_inventory !== undefined) updateData.track_inventory = body.track_inventory;
    if (body.stock_quantity !== undefined) updateData.stock_quantity = body.stock_quantity;
    if (body.low_stock_threshold !== undefined) updateData.low_stock_threshold = body.low_stock_threshold;
    if (body.is_active !== undefined) updateData.is_active = body.is_active;
    if (body.is_featured !== undefined) updateData.is_featured = body.is_featured;
    if (body.is_returnable !== undefined) updateData.is_returnable = body.is_returnable;
    if (body.weight_kg !== undefined) updateData.weight_kg = body.weight_kg;
    if (body.dimensions !== undefined) updateData.dimensions = body.dimensions;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const { data, error } = (await (supabase
      .from("products") as any)
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()) as any;

    if (error) {
      console.error("Error updating product:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ product: data });
  } catch (error: any) {
    console.error("Error in PATCH /api/products/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[id] - Delete product
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", params.id);

    if (error) {
      console.error("Error deleting product:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in DELETE /api/products/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
