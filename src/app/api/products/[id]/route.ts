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
 * GET /api/products/[id] - Get single product with variants
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    await connectDB();
    
    // Fetch product
    const product = await Product.findById(id).lean();

    if (!product) {
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
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    await connectDB();
    const body = await request.json();
    const normalizedDescriptionRo =
      body.description_ro !== undefined || body.description !== undefined
        ? normalizeRichText(body.description_ro || body.description)
        : undefined;
    const normalizedDescriptionEn =
      body.description_en !== undefined || body.description !== undefined
        ? normalizeRichText(body.description_en || body.description)
        : undefined;

    // Build update object - map old field names to new
    const updateData: any = {};
    if (body.category_id !== undefined) updateData.category = body.category_id;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.name !== undefined) updateData.name = body.name;
    if (body.name_ro !== undefined) updateData.name = body.name_ro;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.sku !== undefined) updateData.sku = body.sku;
    if (body.description !== undefined || body.description_ro !== undefined) {
      updateData.description = normalizedDescriptionRo;
    }
    if (body.shortDescription !== undefined) updateData.shortDescription = body.shortDescription;
    
    // Update localeContent for both languages
    if (body.name_ro || body.name_en || body.description_ro || body.description_en || body.description || body.features_ro || body.features_en) {
      updateData.localeContent = {
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
      };
    }
    if (body.base_price !== undefined) updateData.basePrice = body.base_price;
    if (body.basePrice !== undefined) updateData.basePrice = body.basePrice;
    if (body.compareAtPrice !== undefined) updateData.compareAtPrice = body.compareAtPrice;
    if (body.tax_rate !== undefined) updateData.taxRate = body.tax_rate / 100; // Convert percentage to decimal
    if (body.taxRate !== undefined) updateData.taxRate = body.taxRate;
    if (body.variants !== undefined) updateData.variants = body.variants;
    if (body.track_inventory !== undefined) updateData.trackInventory = body.track_inventory;
    if (body.trackInventory !== undefined) updateData.trackInventory = body.trackInventory;
    if (body.low_stock_threshold !== undefined) updateData.lowStockThreshold = body.low_stock_threshold;
    if (body.lowStockThreshold !== undefined) updateData.lowStockThreshold = body.lowStockThreshold;
    if (body.is_returnable !== undefined) updateData.isReturnable = body.is_returnable;
    if (body.isReturnable !== undefined) updateData.isReturnable = body.isReturnable;
    if (body.stock_quantity !== undefined) updateData.stock = body.stock_quantity;
    if (body.stock !== undefined) updateData.stock = body.stock;
    if (body.is_active !== undefined) updateData.isActive = body.is_active;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.is_featured !== undefined) updateData.isFeatured = body.is_featured;
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;
    if (body.weight_kg !== undefined) updateData.weight = body.weight_kg;
    if (body.weight !== undefined) updateData.weight = body.weight;
    if (body.dimensions !== undefined) updateData.dimensions = normalizeDimensions(body.dimensions);
    if (body.images !== undefined) updateData.images = body.images;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.metaTitle !== undefined) updateData.metaTitle = body.metaTitle;
    if (body.metaDescription !== undefined) updateData.metaDescription = body.metaDescription;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error("Error in PATCH /api/products/[id]:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[id] - Delete product
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    await connectDB();
    
    const result = await Product.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
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
