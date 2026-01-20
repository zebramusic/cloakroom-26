import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/products - Get all products
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get("active");
    const category = searchParams.get("category");

    const supabase = await createClient();
    let query = (supabase
      .from("products") as any)
      .select(`
        *,
        category:product_categories(id, name_ro, name_en, slug)
      `)
      .order("created_at", { ascending: false });

    // Filter by active status
    if (active === "true") {
      query = query.eq("is_active", true);
    }

    // Filter by category
    if (category) {
      query = query.eq("category_id", category);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ products: data });
  } catch (error: any) {
    console.error("Error in GET /api/products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products - Create new product with variants
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    // Create product
    const { data: product, error: productError } = (await (supabase
      .from("products") as any)
      .insert({
        category_id: body.category_id,
        name_ro: body.name_ro,
        name_en: body.name_en,
        slug: body.slug,
        sku: body.sku,
        description_ro: body.description_ro || null,
        description_en: body.description_en || null,
        features_ro: body.features_ro || null,
        features_en: body.features_en || null,
        base_price: body.base_price,
        tax_rate: body.tax_rate || 19.0,
        has_variants: body.has_variants || false,
        track_inventory: body.track_inventory ?? true,
        stock_quantity: body.stock_quantity || 0,
        low_stock_threshold: body.low_stock_threshold || 5,
        is_active: body.is_active ?? true,
        is_featured: body.is_featured || false,
        is_returnable: body.is_returnable ?? true,
        weight_kg: body.weight_kg || null,
        dimensions: body.dimensions || null,
      })
      .select()
      .single()) as any;

    if (productError) {
      console.error("Error creating product:", productError);
      return NextResponse.json({ error: productError.message }, { status: 400 });
    }

    // Create variants if provided
    if (body.variants && body.variants.length > 0 && product) {
      const variants = body.variants.map((v: any) => ({
        product_id: (product as any).id,
        sku: v.sku,
        name_ro: v.name_ro,
        name_en: v.name_en,
        attributes: v.attributes || {},
        price: v.price,
        stock_quantity: v.stock_quantity || 0,
        is_active: v.is_active ?? true,
      }));

      const { error: variantsError } = await (supabase
        .from("product_variants") as any)
        .insert(variants);

      if (variantsError) {
        console.error("Error creating variants:", variantsError);
        // Don't fail the request, just log the error
      }
    }

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
