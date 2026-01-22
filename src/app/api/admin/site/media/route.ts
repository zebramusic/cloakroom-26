import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { hasPermission } from '@/lib/auth/permissions';
import connectDB from '@/lib/mongodb';
import { MediaAsset } from '@/lib/models/site';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import sharp from 'sharp';

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads/site');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// GET - List media assets
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !hasPermission(session.user.role, 'site.media')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);

    const query: any = {};
    if (folder) query.folder = folder;
    if (tags && tags.length > 0) query.tags = { $in: tags };

    const assets = await MediaAsset.find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({ assets });
  } catch (error: any) {
    console.error('GET /api/admin/site/media error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}

// POST - Upload media asset
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !hasPermission(session.user.role, 'site.media')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'general';
    const altTextRo = formData.get('altTextRo') as string;
    const altTextEn = formData.get('altTextEn') as string;
    const tags = formData.get('tags') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Max 10MB.' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Use JPG, PNG, WebP, or GIF.' },
        { status: 400 }
      );
    }

    await connectDB();

    // Create upload directory
    const folderPath = path.join(UPLOAD_DIR, folder);
    if (!existsSync(folderPath)) {
      await mkdir(folderPath, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const ext = path.extname(file.name);
    const filename = `${timestamp}-${randomString}${ext}`;
    const filepath = path.join(folderPath, filename);

    // Process image with sharp
    const buffer = Buffer.from(await file.arrayBuffer());
    const image = sharp(buffer);
    const metadata = await image.metadata();

    // Optimize and save
    await image
      .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .png({ compressionLevel: 8 })
      .webp({ quality: 85 })
      .toFile(filepath);

    // Create database record
    const asset = await MediaAsset.create({
      url: `/uploads/site/${folder}/${filename}`,
      storageKey: `${folder}/${filename}`,
      folder,
      filename,
      mimeType: file.type,
      size: file.size,
      width: metadata.width,
      height: metadata.height,
      altText: {
        ro: altTextRo || '',
        en: altTextEn || '',
      },
      tags: tags ? tags.split(',').map((t) => t.trim()) : [],
      uploadedBy: session.user.id,
    });

    return NextResponse.json({ asset });
  } catch (error: any) {
    console.error('POST /api/admin/site/media error:', error);
    return NextResponse.json(
      { error: 'Failed to upload media' },
      { status: 500 }
    );
  }
}
