import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { put } from '@vercel/blob';

export interface ImageVariants {
  thumbUrl: string;
  mediumUrl: string;
  originalUrl: string;
  width: number;
  height: number;
}

const isProduction = process.env.NODE_ENV === 'production';

export async function generateImageVariants(
  originalPath: string,
  itemId: string,
  baseFilename: string
): Promise<ImageVariants> {
  // Read original image
  const image = sharp(originalPath);
  const metadata = await image.metadata();
  
  if (!metadata.width || !metadata.height) {
    throw new Error('Could not read image dimensions');
  }

  const ext = path.extname(baseFilename);
  const name = path.basename(baseFilename, ext);

  if (isProduction) {
    // Use Vercel Blob in production
    const [thumbBuffer, mediumBuffer, originalBuffer] = await Promise.all([
      image.clone().resize(400, null, { withoutEnlargement: true, fit: 'inside' }).jpeg({ quality: 85 }).toBuffer(),
      image.clone().resize(1200, null, { withoutEnlargement: true, fit: 'inside' }).jpeg({ quality: 90 }).toBuffer(),
      fs.readFile(originalPath),
    ]);

    const [thumbBlob, mediumBlob, originalBlob] = await Promise.all([
      put(`portfolio/${itemId}/${name}-thumb.jpg`, thumbBuffer, { access: 'public' }),
      put(`portfolio/${itemId}/${name}-medium.jpg`, mediumBuffer, { access: 'public' }),
      put(`portfolio/${itemId}/${name}-original${ext}`, originalBuffer, { access: 'public' }),
    ]);

    return {
      thumbUrl: thumbBlob.url,
      mediumUrl: mediumBlob.url,
      originalUrl: originalBlob.url,
      width: metadata.width,
      height: metadata.height,
    };
  } else {
    // Use local filesystem in development
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'portfolio', itemId);
    
    // Ensure directory exists
    await fs.mkdir(uploadsDir, { recursive: true });

    // Generate thumb (400px width)
    const thumbFilename = `${name}-thumb${ext}`;
    const thumbPath = path.join(uploadsDir, thumbFilename);
    await image
      .clone()
      .resize(400, null, { withoutEnlargement: true, fit: 'inside' })
      .jpeg({ quality: 85 })
      .toFile(thumbPath);

    // Generate medium (1200px width)
    const mediumFilename = `${name}-medium${ext}`;
    const mediumPath = path.join(uploadsDir, mediumFilename);
    await image
      .clone()
      .resize(1200, null, { withoutEnlargement: true, fit: 'inside' })
      .jpeg({ quality: 90 })
      .toFile(mediumPath);

    // Copy original
    const originalFilename = `${name}-original${ext}`;
    const originalDestPath = path.join(uploadsDir, originalFilename);
    await fs.copyFile(originalPath, originalDestPath);

    return {
      thumbUrl: `/uploads/portfolio/${itemId}/${thumbFilename}`,
      mediumUrl: `/uploads/portfolio/${itemId}/${mediumFilename}`,
      originalUrl: `/uploads/portfolio/${itemId}/${originalFilename}`,
      width: metadata.width,
      height: metadata.height,
    };
  }
}

export async function deleteImageVariants(imageUrls: {
  thumbUrl: string;
  mediumUrl: string;
  originalUrl: string;
}): Promise<void> {
  if (isProduction) {
    // In production, URLs are Vercel Blob URLs - they'll be cleaned up automatically
    // Vercel Blob storage can be managed through the dashboard if needed
    return;
  }

  // In development, delete from local filesystem
  const publicDir = path.join(process.cwd(), 'public');
  
  for (const url of Object.values(imageUrls)) {
    try {
      const filePath = path.join(publicDir, url);
      await fs.unlink(filePath);
    } catch (error) {
      // Ignore if file doesn't exist
      console.error(`Failed to delete ${url}:`, error);
    }
  }
}
