import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import { writeFile } from "fs/promises";
import { join } from "path";
import crypto from "crypto";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// POST /api/customer/threads/upload - Upload attachment for messages
export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user.principalType !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 },
      );
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed" },
        { status: 400 },
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString("hex");
    const ext = file.name.split(".").pop();
    const filename = `${timestamp}-${randomString}.${ext}`;

    // Save file to public/uploads/messages/
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), "public", "uploads", "messages");
    const filePath = join(uploadDir, filename);

    // Create directory if it doesn't exist
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/messages/${filename}`;

    return NextResponse.json(
      {
        filename: file.name,
        url: fileUrl,
        mimeType: file.type,
        size: file.size,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}
