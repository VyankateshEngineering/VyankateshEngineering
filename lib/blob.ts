import "server-only";

import { put } from "@vercel/blob";
import { randomUUID } from "crypto";

/**
 * Upload a file to Vercel Blob Store.
 * - Validates image/* and max 5MB
 * - Generates path as `products/{slug}/{uuid}.webp` if basePath is a folder
 * - Uses BLOB_READ_WRITE_TOKEN server-only via @vercel/blob `put` (token never exposed client-side)
 * - access: public
 */
export async function uploadToBlob(file: File, path: string) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image/* files are allowed");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File size must be <= 5MB");
  }

  // If path already ends with .webp, use as-is; otherwise treat as folder/base and append uuid.webp
  // Expected base: products/{slug}  -> becomes products/{slug}/{uuid}.webp
  let finalPath = path;
  const isFilePath = path.endsWith(".webp") || path.endsWith(".png") || path.endsWith(".jpg") || path.endsWith(".jpeg");
  if (!isFilePath) {
    const uuid = randomUUID();
    const normalized = path.replace(/\/$/, "");
    finalPath = `${normalized}/${uuid}.webp`;
  }

  const blob = await put(finalPath, file, {
    access: "public",
    contentType: file.type,
    addRandomSuffix: false,
  });

  return blob; // { url, pathname, ... }
}

export async function uploadToBlobWithSlug(file: File, slug: string) {
  const base = `products/${slug}`;
  return uploadToBlob(file, base);
}
