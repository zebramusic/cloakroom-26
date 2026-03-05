import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

function sanitizeFolder(folder: string) {
  return folder
    .replace(/^\/+/, "")
    .replace(/\.\./g, "")
    .replace(/\\/g, "/")
    .replace(/\/+/g, "/")
    .trim();
}

function getSafeFileName(file: File) {
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const safeExt = (ext || "bin").toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
}

/**
 * POST /api/upload - Upload file to Vercel Blob Storage
 * Uses Vercel Blob for serverless-compatible file storage
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const requestedFolder = (formData.get("folder") as string) || "uploads";
    const folder = sanitizeFolder(requestedFolder) || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileName = getSafeFileName(file);
    const blobPath = `${folder}/${fileName}`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        console.log("📤 Uploading to Vercel Blob:", blobPath);
        const blob = await put(blobPath, file, {
          access: "public",
          addRandomSuffix: false,
        });

        console.log("✅ Blob uploaded successfully:", blob.url);
        return NextResponse.json({
          url: blob.url,
          path: blobPath,
          storage: "blob",
        });
      } catch (blobError: any) {
        console.warn(
          "⚠️ Blob upload failed, falling back to local filesystem:",
          blobError?.message,
        );
      }
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    const arrayBuffer = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(arrayBuffer));

    const publicPath = `/uploads/${folder}/${fileName}`;
    console.log("✅ Local upload successful:", publicPath);

    return NextResponse.json({
      url: publicPath,
      path: `uploads/${folder}/${fileName}`,
      storage: "local",
    });
  } catch (error: any) {
    console.error("❌ Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed", details: error.message },
      { status: 500 }
    );
  }
}
