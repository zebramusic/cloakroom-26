import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import { Category } from "@/lib/models";
import { hasPermission } from "@/lib/auth/permissions";

/**
 * GET /api/admin/categories - List all categories (including inactive)
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session || !hasPermission(session.user.role, "products.view")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const categories = await Category.find()
      .sort({ order: 1 })
      .lean();

    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error("Error in GET /api/admin/categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/categories - Create new category
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || !hasPermission(session.user.role, "products.create")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { name, slug, description, image, parentId, order, isActive } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await Category.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: "Category with this slug already exists" },
        { status: 400 }
      );
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image,
      parentId: parentId || undefined,
      order: order ?? 0,
      isActive: isActive ?? true,
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/admin/categories:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
