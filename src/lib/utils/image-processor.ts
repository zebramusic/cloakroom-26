import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

export interface ImageVariants {
  thumbUrl: string;
  mediumUrl: string;
  originalUrl: string;
  width: number;
  height: number;
}

export async function generateImageVariants(
  originalPath: string,
  itemId: string,
  baseFilename: string
): Promise<ImageVariants> {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'portfolio', itemId);
  
  // Ensure directory exists
  await fs.mkdir(uploadsDir, { recursive: true });

  // Read original image
  const image = sharp(originalPath);
  const metadata = await image.metadata();
  
  if (!metadata.width || !metadata.height) {
    throw new Error('Could not read image dimensions');
  }

  const ext = path.extname(baseFilename);
  const name = path.basename(baseFilename, ext);

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

export async function deleteImageVariants(imageUrls: {
  thumbUrl: string;
  mediumUrl: string;
  originalUrl: string;
}): Promise<void> {
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
