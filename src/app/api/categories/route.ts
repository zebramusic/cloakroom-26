import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/categories - Get all product categories
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("product_categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ categories: data });
  } catch (error: any) {
    console.error("Error in GET /api/categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
