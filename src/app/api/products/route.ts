import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models";
import mongoose from "mongoose";

/**
 * GET /api/products - Get all products
 */
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const active = searchParams.get("active");
    const category = searchParams.get("category");

    const filter: any = {};

    // Filter by active status
    if (active === "true") {
      filter.isActive = true;
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ products });
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
    await connectDB();
    const body = await request.json();

    // Create product with variants
    const productData: any = {
      name: body.name || body.name_ro,
      slug: body.slug,
      sku: body.sku,
      description: body.description || body.description_ro,
      shortDescription: body.shortDescription,
      category: body.category || body.category_id,
      subcategory: body.subcategory,
      basePrice: body.base_price || body.basePrice,
      compareAtPrice: body.compareAtPrice,
      taxRate: body.tax_rate !== undefined ? (body.tax_rate / 100) : 0.21, // Convert percentage to decimal, default 21%
      images: body.images || [],
      variants: body.variants || [],
      stock: body.stock_quantity || body.stock || 0,
      weight: body.weight_kg || body.weight,
      dimensions: body.dimensions,
      tags: body.tags || [],
      isActive: body.is_active ?? body.isActive ?? true,
      isFeatured: body.is_featured ?? body.isFeatured ?? false,
      metaTitle: body.metaTitle,
      metaDescription: body.metaDescription,
    };

    const product = await Product.create(productData);

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/products:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
