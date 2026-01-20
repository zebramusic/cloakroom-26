import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/partners - Get all partners
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");

    const supabase = await createClient();
    let query = supabase
      .from("partners")
      .select("*")
      .order("display_order", { ascending: true });

    // Filter by published status if requested
    if (published === "true") {
      query = query.eq("is_published", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching partners:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ partners: data });
  } catch (error: any) {
    console.error("Error in GET /api/partners:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/partners - Create new partner
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    const { data, error } = (await (supabase
      .from("partners") as any)
      .insert({
        name: body.name,
        slug: body.slug,
        logo_url: body.logo_url || null,
        website_url: body.website_url || null,
        description: body.description || null,
        display_order: body.display_order || 0,
        is_published: body.is_published ?? true,
      })
      .select()
      .single()) as any;

    if (error) {
      console.error("Error creating partner:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ partner: data }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/partners:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
