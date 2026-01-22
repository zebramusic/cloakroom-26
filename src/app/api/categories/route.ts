import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Category } from "@/lib/models";

/**
 * GET /api/categories - Get all product categories
 */
export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find({ isActive: true })
      .sort({ order: 1 })
      .lean();

    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error("Error in GET /api/categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
