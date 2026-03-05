import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models";
import mongoose from "mongoose";
import { normalizeRichText } from "@/lib/utils/richText";

function normalizeDimensions(dimensions: any) {
  if (!dimensions) return undefined;

  if (typeof dimensions === "string") {
    const parts = dimensions
      .replace(/[^0-9.xX]/g, "")
      .split(/[xX]/)
      .map((part) => Number(part.trim()));

    if (parts.length >= 3 && parts.every((value) => !Number.isNaN(value))) {
      return {
        length: parts[0],
        width: parts[1],
        height: parts[2],
        unit: "cm",
      };
    }

    return undefined;
  }

  if (typeof dimensions === "object") {
    const length = Number(dimensions.length) || 0;
    const width = Number(dimensions.width) || 0;
    const height = Number(dimensions.height) || 0;

    if (length === 0 && width === 0 && height === 0) {
      return undefined;
    }

    return {
      length,
      width,
      height,
      unit: dimensions.unit || "cm",
    };
  }

  return undefined;
}

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
    const normalizedDescriptionRo = normalizeRichText(
      body.description_ro || body.description,
    );
    const normalizedDescriptionEn = normalizeRichText(
      body.description_en || body.description,
    );

    const productData: any = {
      name: body.name || body.name_ro, // Backwards compatibility
      slug: body.slug,
      sku: body.sku,
      description: normalizedDescriptionRo, // Backwards compatibility
      shortDescription: body.shortDescription,
      localeContent: {
        ro: {
          name: body.name_ro || body.name,
          description: normalizedDescriptionRo,
          shortDescription: body.features_ro,
        },
        en: {
          name: body.name_en || body.name,
          description: normalizedDescriptionEn,
          shortDescription: body.features_en,
        },
      },
      category: body.category || body.category_id,
      subcategory: body.subcategory,
      basePrice: body.base_price || body.basePrice,
      compareAtPrice: body.compareAtPrice,
      taxRate: body.tax_rate !== undefined ? (body.tax_rate / 100) : 0.21, // Convert percentage to decimal, default 21%
      images: body.images || [],
      variants: body.variants || [],
      stock: body.stock_quantity || body.stock || 0,
      weight: body.weight_kg || body.weight,
      dimensions: normalizeDimensions(body.dimensions),
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
