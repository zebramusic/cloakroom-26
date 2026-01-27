import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

/**
 * POST /api/upload - Upload file to Vercel Blob Storage
 * Uses Vercel Blob for serverless-compatible file storage
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Generate unique filename with folder prefix
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const blobPath = `${folder}/${fileName}`;

    console.log("📤 Uploading to Vercel Blob:", blobPath);

    // Upload to Vercel Blob Storage
    const blob = await put(blobPath, file, {
      access: "public",
      addRandomSuffix: false, // We already have unique filename
    });

    console.log("✅ Blob uploaded successfully:", blob.url);

    // Return the public URL
    return NextResponse.json({
      url: blob.url,
      path: blobPath,
    });
  } catch (error: any) {
    console.error("❌ Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed", details: error.message },
      { status: 500 }
    );
  }
}
