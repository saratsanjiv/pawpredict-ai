import { get, put } from "@vercel/blob";
import sharp from "sharp";

export function casePhotoBlobPath(id: string) {
  return `cases/${id}/photo.jpg`;
}

// Re-encoding drops EXIF (including phone GPS data) and caps the size before anything is stored.
export async function uploadCasePhoto(id: string, image: Buffer, { allowOverwrite = false } = {}) {
  const jpeg = await sharp(image)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();
  const blob = await put(casePhotoBlobPath(id), jpeg, {
    access: "private",
    contentType: "image/jpeg",
    addRandomSuffix: false,
    allowOverwrite,
  });
  return blob.pathname;
}

export async function readCasePhoto(pathname: string): Promise<Buffer | null> {
  const result = await get(pathname, { access: "private" });
  if (!result || result.statusCode !== 200) return null;
  return Buffer.from(await new Response(result.stream).arrayBuffer());
}
