/**
 * Vyankatesh Engineering — Main seed script
 * Migrates hardcoded data (data/products.ts, data/gallery.ts, data/settings.ts)
 * + public/products/* + public/gallery/* into Supabase (via Prisma)
 * and Vercel Blob (via @vercel/blob put).
 *
 * - Preserves every product slug and category slug (upsert by slug)
 * - Paths in Blob: products/{slug}/{filename} and gallery/{filename}
 * - Preserves original filenames where possible; DB stores blob URLs
 * - If BLOB_READ_WRITE_TOKEN not set (local without), fallback to local /products/... URLs
 *   so build without Blob still works.
 * - Creates Category first, then Product + ProductImage + ProductFAQ, GalleryImage, CompanyProfile
 * - Idempotent: upsert by slug for Category/Product; delete+create for images/FAQs; gallery delete+create
 * - Uses prisma from lib/db.ts (server-only)
 * - BLOB_READ_WRITE_TOKEN is server-only, never exposed to client
 *
 * Run: npx tsx prisma/seed.ts  (or prisma db seed if package.json prisma.seed configured)
 * Verify: npx tsc --noEmit
 */

import fs from "fs";
import path from "path";
import { put } from "@vercel/blob";
import { prisma } from "../lib/db";
import { products } from "../data/products";
import { galleryItems } from "../data/gallery";
import { settings } from "../data/settings";
import { Prisma } from "@prisma/client";

// ── Helpers ────────────────────────────────────────────────────────────────

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".svg":
      return "image/svg+xml";
    case ".gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
}

/**
 * Upload a local file to Vercel Blob if token present.
 * Returns blob URL on success, null on fallback/error (caller should use local URL).
 * Preserves original filename via pathname: products/{slug}/{filename} or gallery/{filename}
 */
async function uploadToBlobIfConfigured(
  localFilePath: string,
  blobPathname: string,
  cache: Map<string, string>,
): Promise<string | null> {
  // server-only guard: BLOB_READ_WRITE_TOKEN must be server env, never NEXT_PUBLIC
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return null;
  }
  // reuse cached upload for same source file -> avoid duplicate puts
  if (cache.has(localFilePath)) {
    return cache.get(localFilePath)!;
  }
  if (!fs.existsSync(localFilePath)) {
    console.warn(`[seed] file not found, fallback to local URL: ${localFilePath}`);
    return null;
  }
  try {
    const buffer = fs.readFileSync(localFilePath);
    if (buffer.length > 5 * 1024 * 1024) {
      console.warn(`[seed] file >5MB, skipping blob upload (fallback local): ${localFilePath} (${buffer.length} bytes)`);
      return null;
    }
    const mime = getMimeType(localFilePath);
    // @vercel/blob put — token is read from env server-side automatically (server-only)
    const blob = await put(blobPathname, buffer, {
      access: "public",
      contentType: mime,
      addRandomSuffix: false,
    });
    cache.set(localFilePath, blob.url);
    // also cache by blobPathname for gallery dedup where same filename but different source -> keep first
    // but we key by localFilePath, so different source with same blob pathname will still upload separately;
    // to avoid overwrite, caller should ensure unique blobPathname or accept last-write-wins.
    console.log(`[seed] uploaded ${path.basename(localFilePath)} -> ${blob.url} (${blobPathname})`);
    return blob.url;
  } catch (err) {
    console.warn(`[seed] blob upload failed for ${localFilePath} -> ${blobPathname}:`, (err as Error).message, "— fallback to local URL");
    return null;
  }
}

function resolvePublicFile(publicUrl: string): string {
  // publicUrl like /products/core-pin-set.png or /gallery/big-core.png
  const relative = publicUrl.replace(/^\//, "");
  return path.join(process.cwd(), "public", relative);
}

function extractGeoFromMapEmbed(url: string): { lat: number; lng: number } | null {
  // url like https://maps.google.com/maps?q=19.837878,75.246699&z=15&output=embed
  try {
    const m = url.match(/q=([-\d.]+),([-\d.]+)/);
    if (m) {
      return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
    }
    return null;
  } catch {
    return null;
  }
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("[seed] starting Vyankatesh Engineering seed");
  const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;
  console.log(`[seed] BLOB_READ_WRITE_TOKEN: ${hasBlobToken ? "set (will upload to Vercel Blob)" : "not set (fallback to local /products/... URLs)"}`);
  console.log(`[seed] source counts: products=${products.length}, gallery=${galleryItems.length}`);

  const uploadCache = new Map<string, string>();

  // ── 1. Categories (from product categories + gallery categories) ─────────
  // Preserve every product category slug exactly; also include gallery categories that are not already represented.
  const categoryMap = new Map<string, { name: string; slug: string; description: string | null; sortOrder: number }>();

  // From products — preserve slug and name exactly, sortOrder by first appearance
  let catSort = 0;
  for (const p of products) {
    const slug = p.category.slug; // preserve exactly
    const name = p.category.name;
    if (!categoryMap.has(slug)) {
      categoryMap.set(slug, { name, slug, description: null, sortOrder: catSort++ });
    }
  }

  // From gallery — add distinct categories not already in product map (reuse product slug if name matches)
  const productNameToSlug = new Map<string, string>();
  for (const [, v] of categoryMap) {
    productNameToSlug.set(v.name.toLowerCase(), v.slug);
  }
  // also map existing slugs lowercased
  const existingSlugsLower = new Set<string>(Array.from(categoryMap.keys()).map((s) => s.toLowerCase()));

  for (const g of galleryItems) {
    const raw = (g.category || "Gallery").trim();
    if (!raw) continue;
    const lowerName = raw.toLowerCase();
    // Try to reuse product category slug if name matches exactly (e.g., "Cooling Systems" -> "cooling")
    if (productNameToSlug.has(lowerName)) {
      continue; // already represented
    }
    const slug = slugify(raw);
    if (existingSlugsLower.has(slug)) continue;
    if (categoryMap.has(slug)) continue;
    // Check if slug already exists but with different case
    // create new category for gallery-only (Cores, Products, Gallery)
    categoryMap.set(slug, { name: raw, slug, description: `Gallery category: ${raw}`, sortOrder: catSort++ });
    existingSlugsLower.add(slug);
  }

  console.log(`[seed] categories to upsert: ${categoryMap.size} (from ${products.length} products + ${galleryItems.length} gallery items)`);
  const categoryIdBySlug = new Map<string, string>();
  let categoryCreated = 0;
  let categoryUpdated = 0;
  for (const [, cat] of categoryMap) {
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } });
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        sortOrder: cat.sortOrder,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        sortOrder: cat.sortOrder,
      },
    });
    categoryIdBySlug.set(cat.slug, record.id);
    if (existing) categoryUpdated++;
    else categoryCreated++;
  }
  // Fallback for product categories that were maybe already in DB but not in our map (keep them)
  // Ensure every product's category slug now has an id
  for (const p of products) {
    if (!categoryIdBySlug.has(p.category.slug)) {
      const cat = await prisma.category.findUnique({ where: { slug: p.category.slug } });
      if (cat) categoryIdBySlug.set(p.category.slug, cat.id);
    }
  }
  console.log(`[seed] categories: created=${categoryCreated} updated=${categoryUpdated} total=${categoryMap.size}`);

  // ── 2. Products + ProductImage + ProductFAQ ──────────────────────────────
  let productCreated = 0;
  let productUpdated = 0;
  let productImageCount = 0;
  let productFaqCount = 0;

  for (const p of products) {
    const categoryId = categoryIdBySlug.get(p.category.slug);
    if (!categoryId) {
      console.error(`[seed] missing categoryId for product ${p.slug} category ${p.category.slug} — skipping`);
      continue;
    }
    const existingProduct = await prisma.product.findUnique({ where: { slug: p.slug } });

    // Handle Json fields: specs may be undefined, use Prisma.JsonNull or cast
    const specsJson: Prisma.InputJsonValue | typeof Prisma.JsonNull | undefined =
      p.specs && Object.keys(p.specs).length > 0 ? (p.specs as Prisma.InputJsonValue) : undefined;

    const product = await prisma.product.upsert({
      where: { slug: p.slug }, // idempotent by slug, preserve slug
      update: {
        name: p.name,
        categoryId,
        description: p.description,
        overview: p.overview ?? null,
        specs: specsJson ?? Prisma.JsonNull,
        features: p.features ?? [],
        keyAdvantages: p.keyAdvantages ?? [],
        applications: p.applications ?? null,
        applicationsList: p.applicationsList ?? [],
        industries: p.industries ?? [],
        material: p.material ?? null,
        tolerance: p.tolerance ?? null,
        surfaceFinish: p.surfaceFinish ?? null,
        customization: p.customization ?? null,
        availableSizes: p.availableSizes ?? null,
        qualityNote: p.qualityNote ?? null,
        seoTitle: null,
        seoDescription: null,
        isPublished: p.isPublished ?? true,
        isFeatured: false,
        sortOrder: p.sortOrder ?? 0,
      },
      create: {
        // id auto cuid; slug preserved
        name: p.name,
        slug: p.slug,
        categoryId,
        description: p.description,
        overview: p.overview ?? null,
        specs: specsJson ?? Prisma.JsonNull,
        features: p.features ?? [],
        keyAdvantages: p.keyAdvantages ?? [],
        applications: p.applications ?? null,
        applicationsList: p.applicationsList ?? [],
        industries: p.industries ?? [],
        material: p.material ?? null,
        tolerance: p.tolerance ?? null,
        surfaceFinish: p.surfaceFinish ?? null,
        customization: p.customization ?? null,
        availableSizes: p.availableSizes ?? null,
        qualityNote: p.qualityNote ?? null,
        seoTitle: null,
        seoDescription: null,
        isPublished: p.isPublished ?? true,
        isFeatured: false,
        sortOrder: p.sortOrder ?? 0,
      },
    });
    if (existingProduct) productUpdated++;
    else productCreated++;

    // Images — delete existing then recreate (idempotent)
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    // FAQs — delete then recreate
    await prisma.productFAQ.deleteMany({ where: { productId: product.id } });

    // Create images with blob URLs (or fallback local URLs)
    for (let idx = 0; idx < (p.images?.length ?? 0); idx++) {
      const img = p.images[idx];
      const originalUrl = img.url; // e.g., /products/core-pin-set.png
      const filename = path.basename(originalUrl);
      const blobPathname = `products/${p.slug}/${filename}`; // preserve original filename
      const localPath = resolvePublicFile(originalUrl);
      let blobUrl: string = originalUrl; // fallback
      const uploaded = await uploadToBlobIfConfigured(localPath, blobPathname, uploadCache);
      if (uploaded) blobUrl = uploaded;
      else {
        // if file not found at originalUrl, try alternative folders? Already warn.
        // Keep originalUrl as blobUrl so DB still works via local public folder
        if (!fs.existsSync(localPath)) {
          console.warn(`[seed] product ${p.slug} image not found on disk, keeping local URL: ${originalUrl}`);
        }
      }
      await prisma.productImage.create({
        data: {
          productId: product.id,
          blobUrl,
          alt: img.alt ?? p.name,
          caption: null,
          sortOrder: idx,
          isPrimary: idx === 0,
        },
      });
      productImageCount++;
    }

    // Create FAQs
    for (let idx = 0; idx < (p.faqs?.length ?? 0); idx++) {
      const f = p.faqs![idx];
      await prisma.productFAQ.create({
        data: {
          productId: product.id,
          question: f.q,
          answer: f.a,
          sortOrder: idx,
        },
      });
      productFaqCount++;
    }
  }

  console.log(`[seed] products: created=${productCreated} updated=${productUpdated} total=${products.length}`);
  console.log(`[seed] productImages: total=${productImageCount}`);
  console.log(`[seed] productFaqs: total=${productFaqCount}`);

  // ── 3. GalleryImage ──────────────────────────────────────────────────────
  // Idempotent: delete all existing then recreate from hardcoded data
  // This handles duplicate ids in source (gallery.ts has duplicate ids but different urls); we treat each array entry as distinct row.
  const galleryBefore = await prisma.galleryImage.count();
  await prisma.galleryImage.deleteMany({});
  console.log(`[seed] gallery: deleted previous ${galleryBefore} rows for idempotent reseed`);

  let galleryImageCount = 0;
  // Deduplicate upload cache for gallery by local path to avoid re-uploading same file multiple times
  // But blob pathname is gallery/{filename} — if two gallery items have same filename but different source paths, they would collide.
  // We keep per-localFile cache, but blobPathname collision will cause last-upload wins; we log warning.
  const galleryBlobPathSeen = new Map<string, string>(); // blobPathname -> localPath first seen

  for (let idx = 0; idx < galleryItems.length; idx++) {
    const g = galleryItems[idx];
    const originalUrl = g.url;
    const filename = path.basename(originalUrl);
    const blobPathname = `gallery/${filename}`; // preserve original filename
    const localPath = resolvePublicFile(originalUrl);

    // Detect blob pathname collision for gallery (same filename from different source folders with different content)
    if (galleryBlobPathSeen.has(blobPathname) && galleryBlobPathSeen.get(blobPathname) !== localPath) {
      console.warn(`[seed] gallery blob pathname collision: ${blobPathname} already used for ${galleryBlobPathSeen.get(blobPathname)}, now ${localPath} — last upload will overwrite`);
    }
    if (!galleryBlobPathSeen.has(blobPathname)) {
      galleryBlobPathSeen.set(blobPathname, localPath);
    }

    let blobUrl: string = originalUrl;
    const uploaded = await uploadToBlobIfConfigured(localPath, blobPathname, uploadCache);
    if (uploaded) blobUrl = uploaded;
    else {
      if (!fs.existsSync(localPath)) {
        console.warn(`[seed] gallery item ${g.id} file not found, keeping local URL: ${originalUrl}`);
      }
    }

    await prisma.galleryImage.create({
      data: {
        blobUrl,
        title: g.caption || g.alt || null,
        alt: g.alt || null,
        caption: g.caption || null,
        category: g.category || null,
        sortOrder: g.sortOrder ?? idx,
        isPublished: true,
      },
    });
    galleryImageCount++;
  }
  console.log(`[seed] galleryImages: total=${galleryImageCount} (source array length ${galleryItems.length})`);

  // ── 4. CompanyProfile (from settings) ────────────────────────────────────
  const geo = extractGeoFromMapEmbed(settings.mapEmbedUrl);
  const addressJson: Prisma.InputJsonValue = {
    full: settings.address,
    street: "C-sector Near more Chowk, Waluj MIDC -431136",
    locality: "Chhatrapati Sambhajinagar",
    region: "Maharashtra",
    postalCode: "431136",
    country: "India",
    raw: settings.address,
  };
  const geoJson: Prisma.InputJsonValue | typeof Prisma.JsonNull = geo ? { lat: geo.lat, lng: geo.lng } : Prisma.JsonNull;
  const contactJson: Prisma.InputJsonValue = {
    email: settings.contactEmail,
    phone: null,
    mapEmbedUrl: settings.mapEmbedUrl,
    linkedin: settings.socialLinks.linkedin ?? null,
  };

  const existingProfile = await prisma.companyProfile.findFirst({ orderBy: { createdAt: "desc" } });
  let companyProfileId: string;
  if (existingProfile) {
    const updated = await prisma.companyProfile.update({
      where: { id: existingProfile.id },
      data: {
        name: settings.companyName,
        description: settings.globalSeoDesc,
        address: addressJson,
        geo: geoJson,
        contact: contactJson,
        capabilities: [],
        processes: Prisma.JsonNull,
        industries: [],
      },
    });
    companyProfileId = updated.id;
    console.log(`[seed] companyProfile: updated id=${companyProfileId} (${settings.companyName})`);
  } else {
    const created = await prisma.companyProfile.create({
      data: {
        name: settings.companyName,
        description: settings.globalSeoDesc,
        address: addressJson,
        geo: geoJson,
        contact: contactJson,
        capabilities: [],
        processes: Prisma.JsonNull,
        industries: [],
      },
    });
    companyProfileId = created.id;
    console.log(`[seed] companyProfile: created id=${companyProfileId} (${settings.companyName})`);
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  const counts = {
    categories: categoryMap.size,
    products: products.length,
    productImages: productImageCount,
    productFaqs: productFaqCount,
    galleryImages: galleryImageCount,
    companyProfiles: 1,
  };
  console.log("[seed] summary", JSON.stringify(counts, null, 2));
  console.log("[seed] done — public pages will now read from DB without redeploy; fallback to hardcoded if DB empty still works via lib/data.ts");
  return counts;
}

main()
  .then((counts) => {
    console.log(`[seed] counts: categories=${counts.categories} products=${counts.products} productImages=${counts.productImages} productFaqs=${counts.productFaqs} galleryImages=${counts.galleryImages} companyProfiles=${counts.companyProfiles}`);
  })
  .catch((e) => {
    console.error("[seed] failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
