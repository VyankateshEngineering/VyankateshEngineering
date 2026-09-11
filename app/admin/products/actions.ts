"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { revalidateTag, revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { randomUUID } from "crypto";
import { uploadToBlob } from "@/lib/blob";

// ── helpers ───────────────────────────────────────────────────────────────

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

function revalidateProductPaths(slug: string, categorySlug?: string | null) {
  revalidateTag("products");
  revalidateTag("product");
  try {
    revalidatePath(`/products/${slug}`);
    if (categorySlug) revalidatePath(`/categories/${categorySlug}`);
    revalidatePath("/");
    revalidatePath("/sitemap.xml");
    // Also revalidate admin list
    revalidatePath("/admin/products");
  } catch {
    // next/cache may throw in some contexts – ignore
  }
}

function parseBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value === "true" || value === "on" || value === "1";
  return false;
}

function parseIntSafe(value: unknown, fallback = 0): number {
  if (typeof value === "number") return Math.trunc(value);
  const n = parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

// ── zod schemas ───────────────────────────────────────────────────────────

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const faqInputSchema = z.object({
  question: z.string().min(1, "Question required").max(500),
  answer: z.string().min(1, "Answer required").max(2000),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

const productFormSchema = z.object({
  name: z.string().min(2, "Name is too short").max(200),
  slug: z.string().min(2).max(200).regex(slugRegex, "Invalid slug format"),
  categoryId: z.string().min(1, "Category required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  overview: z.string().max(5000).optional().nullable(),
  specs: z.record(z.string(), z.string()).optional().nullable(),
  features: z.array(z.string()).optional().default([]),
  applications: z.string().optional().nullable(),
  applicationsList: z.array(z.string()).optional().default([]),
  industries: z.array(z.string()).optional().default([]),
  material: z.string().optional().nullable(),
  tolerance: z.string().optional().nullable(),
  surfaceFinish: z.string().optional().nullable(),
  customization: z.string().optional().nullable(),
  availableSizes: z.string().optional().nullable(),
  qualityNote: z.string().optional().nullable(),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(320).optional().nullable(),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).default(0),
  faqs: z.array(faqInputSchema).optional().default([]),
});

type ProductFormInput = z.infer<typeof productFormSchema>;

function extractProductInput(input: FormData | ProductFormInput | unknown): ProductFormInput {
  // If FormData, parse fields
  if (typeof FormData !== "undefined" && input instanceof FormData) {
    const fd = input as FormData;
    const get = (k: string) => {
      const v = fd.get(k);
      return v === null ? undefined : String(v);
    };

    // Handle JSON fields that may be stringified arrays/objects
    const parseJsonArray = (key: string): string[] => {
      const raw = get(key);
      if (!raw) return [];
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.filter((x) => typeof x === "string");
        return [];
      } catch {
        // fallback: split by newline or comma
        return raw.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
      }
    };

    const parseJsonRecord = (key: string): Record<string, string> | undefined => {
      const raw = get(key);
      if (!raw) return undefined;
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          const rec: Record<string, string> = {};
          for (const [k, v] of Object.entries(parsed)) {
            if (typeof v === "string") rec[k] = v;
            else if (v != null) rec[k] = String(v);
          }
          return rec;
        }
      } catch {
        // try key:value lines
        const rec: Record<string, string> = {};
        raw.split("\n").forEach((line) => {
          const idx = line.indexOf(":");
          if (idx > 0) {
            const k = line.slice(0, idx).trim();
            const v = line.slice(idx + 1).trim();
            if (k) rec[k] = v;
          }
        });
        if (Object.keys(rec).length) return rec;
      }
      return undefined;
    };

    const parseFaqs = (): z.infer<typeof faqInputSchema>[] => {
      const raw = get("faqs");
      if (!raw) return [];
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
      return [];
    };

    const slugRaw = get("slug")?.trim() || "";
    const nameRaw = get("name")?.trim() || "";
    const slug = slugRaw ? slugRaw : slugify(nameRaw);

    return {
      name: nameRaw,
      slug,
      categoryId: get("categoryId") || "",
      description: get("description") || "",
      overview: get("overview") || null,
      specs: parseJsonRecord("specs"),
      features: parseJsonArray("features"),
      applications: get("applications") || null,
      applicationsList: parseJsonArray("applicationsList"),
      industries: parseJsonArray("industries"),
      material: get("material") || null,
      tolerance: get("tolerance") || null,
      surfaceFinish: get("surfaceFinish") || null,
      customization: get("customization") || null,
      availableSizes: get("availableSizes") || null,
      qualityNote: get("qualityNote") || null,
      seoTitle: get("seoTitle") || null,
      seoDescription: get("seoDescription") || null,
      isPublished: parseBoolean(get("isPublished")),
      isFeatured: parseBoolean(get("isFeatured")),
      sortOrder: parseIntSafe(get("sortOrder") ?? "0", 0),
      faqs: parseFaqs(),
    };
  }

  // If object with maybe json strings
  if (input && typeof input === "object") {
    const obj = input as Record<string, unknown>;
    // Normalize potential JSON string fields
    const normalizeArray = (val: unknown): string[] => {
      if (Array.isArray(val)) return val.filter((x) => typeof x === "string") as string[];
      if (typeof val === "string") {
        try {
          const p = JSON.parse(val);
          if (Array.isArray(p)) return p.filter((x) => typeof x === "string") as string[];
        } catch {}
        return val.split(/[\n,]+/).map((s: string) => s.trim()).filter(Boolean);
      }
      return [];
    };
    const normalizeRecord = (val: unknown): Record<string, string> | undefined => {
      if (!val) return undefined;
      if (typeof val === "object" && !Array.isArray(val)) {
        const rec: Record<string, string> = {};
        for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
          if (typeof v === "string") rec[k] = v;
          else if (v != null) rec[k] = String(v);
        }
        return rec;
      }
      if (typeof val === "string") {
        try {
          const p = JSON.parse(val);
          if (p && typeof p === "object" && !Array.isArray(p)) return p as Record<string, string>;
        } catch {}
      }
      return undefined;
    };
    const rawFaqs = obj.faqs;
    let faqs: unknown = rawFaqs;
    if (typeof rawFaqs === "string") {
      try { faqs = JSON.parse(rawFaqs); } catch { faqs = []; }
    }

    const name = String(obj.name ?? "").trim();
    const slugCand = String(obj.slug ?? "").trim();
    const slug = slugCand ? slugCand : slugify(name);

    return {
      name,
      slug,
      categoryId: String(obj.categoryId ?? ""),
      description: String(obj.description ?? ""),
      overview: obj.overview ? String(obj.overview) : null,
      specs: normalizeRecord(obj.specs),
      features: normalizeArray(obj.features),
      applications: obj.applications ? String(obj.applications) : null,
      applicationsList: normalizeArray(obj.applicationsList),
      industries: normalizeArray(obj.industries),
      material: obj.material ? String(obj.material) : null,
      tolerance: obj.tolerance ? String(obj.tolerance) : null,
      surfaceFinish: obj.surfaceFinish ? String(obj.surfaceFinish) : null,
      customization: obj.customization ? String(obj.customization) : null,
      availableSizes: obj.availableSizes ? String(obj.availableSizes) : null,
      qualityNote: obj.qualityNote ? String(obj.qualityNote) : null,
      seoTitle: obj.seoTitle ? String(obj.seoTitle) : null,
      seoDescription: obj.seoDescription ? String(obj.seoDescription) : null,
      isPublished: parseBoolean(obj.isPublished),
      isFeatured: parseBoolean(obj.isFeatured),
      sortOrder: parseIntSafe(obj.sortOrder, 0),
      faqs: Array.isArray(faqs) ? (faqs as unknown[]) as z.infer<typeof faqInputSchema>[] : [],
    } as ProductFormInput;
  }

  throw new Error("Invalid input");
}

// ── actions ───────────────────────────────────────────────────────────────

export async function createProduct(input: FormData | ProductFormInput) {
  await requireAdmin();
  const parsedInput = extractProductInput(input);
  const data = productFormSchema.parse(parsedInput);

  // Validate category exists
  const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
  if (!category) throw new Error("Category not found");

  // Check slug uniqueness
  const existing = await prisma.product.findUnique({ where: { slug: data.slug } });
  if (existing) throw new Error(`Slug "${data.slug}" already exists`);

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      categoryId: data.categoryId,
      description: data.description,
      overview: data.overview,
      specs: data.specs ?? undefined,
      features: data.features ?? [],
      applications: data.applications,
      applicationsList: data.applicationsList ?? [],
      industries: data.industries ?? [],
      material: data.material,
      tolerance: data.tolerance,
      surfaceFinish: data.surfaceFinish,
      customization: data.customization,
      availableSizes: data.availableSizes,
      qualityNote: data.qualityNote,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      isPublished: data.isPublished,
      isFeatured: data.isFeatured,
      sortOrder: data.sortOrder,
      faqs: data.faqs.length
        ? {
            create: data.faqs.map((f, idx) => ({
              question: f.question,
              answer: f.answer,
              sortOrder: f.sortOrder ?? idx,
            })),
          }
        : undefined,
    },
    include: { category: true },
  });

  revalidateProductPaths(product.slug, product.category.slug);
  return { success: true as const, product };
}

export async function updateProduct(id: string, input: FormData | ProductFormInput) {
  await requireAdmin();
  // Handle case where first arg is FormData and id is inside
  let productId = id;
  let rawInput: FormData | ProductFormInput | unknown = input;

  if (typeof FormData !== "undefined" && (id as unknown) instanceof FormData) {
    const fd = id as unknown as FormData;
    productId = String(fd.get("id") ?? fd.get("productId") ?? "");
    rawInput = fd;
  } else if (input === undefined && typeof id === "object") {
    // called as updateProduct(formData)
    rawInput = id as unknown as FormData;
    if ((rawInput as unknown) instanceof FormData) {
      productId = String((rawInput as FormData).get("id") ?? "");
    }
  }

  const idSchema = z.string().min(1);
  const validatedId = idSchema.parse(productId);

  const parsedInput = extractProductInput(rawInput as FormData | ProductFormInput);
  const data = productFormSchema.parse(parsedInput);

  const existing = await prisma.product.findUnique({
    where: { id: validatedId },
    include: { category: true },
  });
  if (!existing) throw new Error("Product not found");

  const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
  if (!category) throw new Error("Category not found");

  if (data.slug !== existing.slug) {
    const slugExists = await prisma.product.findUnique({ where: { slug: data.slug } });
    if (slugExists) throw new Error(`Slug "${data.slug}" already exists`);
  }

  // Update product and replace FAQs
  const updated = await prisma.$transaction(async (tx) => {
    await tx.productFAQ.deleteMany({ where: { productId: validatedId } });
    const p = await tx.product.update({
      where: { id: validatedId },
      data: {
        name: data.name,
        slug: data.slug,
        categoryId: data.categoryId,
        description: data.description,
        overview: data.overview,
        specs: data.specs ?? undefined,
        features: data.features ?? [],
        applications: data.applications,
        applicationsList: data.applicationsList ?? [],
        industries: data.industries ?? [],
        material: data.material,
        tolerance: data.tolerance,
        surfaceFinish: data.surfaceFinish,
        customization: data.customization,
        availableSizes: data.availableSizes,
        qualityNote: data.qualityNote,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        isPublished: data.isPublished,
        isFeatured: data.isFeatured,
        sortOrder: data.sortOrder,
        faqs: data.faqs.length
          ? {
              create: data.faqs.map((f, idx) => ({
                question: f.question,
                answer: f.answer,
                sortOrder: f.sortOrder ?? idx,
              })),
            }
          : undefined,
      },
      include: { category: true },
    });
    return p;
  });

  // Revalidate both old and new slugs/category paths
  revalidateProductPaths(existing.slug, existing.category.slug);
  revalidateProductPaths(updated.slug, updated.category.slug);
  return { success: true as const, product: updated };
}

export async function deleteProduct(input: string | FormData) {
  await requireAdmin();
  let id: string;
  if (typeof FormData !== "undefined" && (input as unknown) instanceof FormData) {
    const fd = input as unknown as FormData;
    id = String(fd.get("id") ?? fd.get("productId") ?? "");
  } else {
    id = String(input);
  }
  const idSchema = z.string().min(1);
  const validatedId = idSchema.parse(id);

  const product = await prisma.product.findUnique({
    where: { id: validatedId },
    include: { category: true, images: true },
  });
  if (!product) throw new Error("Product not found");

  // Delete blobs for images
  for (const img of product.images) {
    try {
      await del(img.blobUrl);
    } catch {
      // ignore if token missing or blob not found
    }
  }

  await prisma.product.delete({ where: { id: validatedId } });

  revalidateProductPaths(product.slug, product.category.slug);
  return { success: true as const };
}

export async function togglePublish(input: string | FormData | { id: string; isPublished?: boolean }) {
  await requireAdmin();
  let id: string;
  let isPublished: boolean | undefined;

  if (typeof FormData !== "undefined" && (input as unknown) instanceof FormData) {
    const fd = input as unknown as FormData;
    id = String(fd.get("id") ?? "");
    const raw = fd.get("isPublished");
    if (raw !== null) isPublished = parseBoolean(String(raw));
  } else if (input && typeof input === "object" && "id" in (input as Record<string, unknown>)) {
    const obj = input as { id: string; isPublished?: boolean };
    id = obj.id;
    isPublished = obj.isPublished;
  } else {
    id = String(input);
  }

  const schema = z.object({
    id: z.string().min(1),
    isPublished: z.boolean().optional(),
  });
  const parsed = schema.parse({ id, isPublished });

  const existing = await prisma.product.findUnique({
    where: { id: parsed.id },
    include: { category: true },
  });
  if (!existing) throw new Error("Product not found");

  const newVal = parsed.isPublished !== undefined ? parsed.isPublished : !existing.isPublished;

  const updated = await prisma.product.update({
    where: { id: parsed.id },
    data: { isPublished: newVal },
    include: { category: true },
  });

  revalidateProductPaths(updated.slug, updated.category.slug);
  return { success: true as const, isPublished: updated.isPublished };
}

export async function toggleFeatured(input: string | FormData | { id: string; isFeatured?: boolean }) {
  await requireAdmin();
  let id: string;
  let isFeatured: boolean | undefined;
  if (typeof FormData !== "undefined" && (input as unknown) instanceof FormData) {
    const fd = input as unknown as FormData;
    id = String(fd.get("id") ?? "");
    const raw = fd.get("isFeatured");
    if (raw !== null) isFeatured = parseBoolean(String(raw));
  } else if (input && typeof input === "object" && "id" in (input as Record<string, unknown>)) {
    const obj = input as { id: string; isFeatured?: boolean };
    id = obj.id;
    isFeatured = obj.isFeatured;
  } else {
    id = String(input);
  }
  const schema = z.object({ id: z.string().min(1), isFeatured: z.boolean().optional() });
  const parsed = schema.parse({ id, isFeatured });
  const existing = await prisma.product.findUnique({ where: { id: parsed.id }, include: { category: true } });
  if (!existing) throw new Error("Product not found");
  const newVal = parsed.isFeatured !== undefined ? parsed.isFeatured : !existing.isFeatured;
  const updated = await prisma.product.update({
    where: { id: parsed.id },
    data: { isFeatured: newVal },
    include: { category: true },
  });
  revalidateProductPaths(updated.slug, updated.category.slug);
  return { success: true as const, isFeatured: updated.isFeatured };
}

export async function reorderProducts(input: string[] | FormData) {
  await requireAdmin();
  let orderedIds: string[] = [];
  if (typeof FormData !== "undefined" && (input as unknown) instanceof FormData) {
    const fd = input as unknown as FormData;
    const raw = fd.get("orderedIds") ?? fd.get("ids");
    if (raw) {
      try {
        const parsed = JSON.parse(String(raw));
        if (Array.isArray(parsed)) orderedIds = parsed;
      } catch {
        orderedIds = String(raw).split(",").map((s) => s.trim()).filter(Boolean);
      }
    } else {
      // collect all 'id' entries
      const all = fd.getAll("id").map((v: FormDataEntryValue) => String(v));
      if (all.length) orderedIds = all;
    }
  } else if (Array.isArray(input)) {
    orderedIds = input;
  } else {
    throw new Error("Invalid input for reorderProducts");
  }

  const schema = z.array(z.string().min(1)).min(1);
  const validated = schema.parse(orderedIds);

  await prisma.$transaction(
    validated.map((id, idx) =>
      prisma.product.update({
        where: { id },
        data: { sortOrder: idx },
      })
    )
  );

  revalidateTag("products");
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  return { success: true as const };
}

export async function uploadProductImage(input: FormData) {
  await requireAdmin();
  if (!((input as unknown) instanceof FormData)) throw new Error("FormData required");

  const productId = String(input.get("productId") ?? input.get("id") ?? "");
  const alt = String(input.get("alt") ?? "");
  const caption = String(input.get("caption") ?? "");
  const isPrimaryRaw = input.get("isPrimary");
  const isPrimary = isPrimaryRaw ? parseBoolean(String(isPrimaryRaw)) : false;
  const file = input.get("file") as unknown as File | null;

  const schema = z.object({
    productId: z.string().min(1),
  });
  schema.parse({ productId });

  if (!file || typeof file !== "object" || !("size" in file)) {
    throw new Error("File is required");
  }
  // validate image/* max 5MB
  const f = file as File;
  if (!f.type.startsWith("image/")) throw new Error("Only image/* allowed");
  if (f.size > 5 * 1024 * 1024) throw new Error("File size must be <= 5MB");

  const product = await prisma.product.findUnique({ where: { id: productId }, include: { category: true } });
  if (!product) throw new Error("Product not found");

  // Generate Blob path: products/{slug}/{uuid}.webp — uses BLOB_READ_WRITE_TOKEN server-only via lib/blob.ts helper
  const uuid = randomUUID();
  const blobPath = `products/${product.slug}/${uuid}.webp`;

  // Uses @vercel/blob put via helper with access public, random uuid, validates image/* max 5MB
  const blob = await uploadToBlob(f, blobPath);

  const count = await prisma.productImage.count({ where: { productId } });

  // If isPrimary, unset others
  if (isPrimary) {
    await prisma.productImage.updateMany({ where: { productId }, data: { isPrimary: false } });
  }

  const image = await prisma.productImage.create({
    data: {
      productId,
      blobUrl: blob.url,
      alt: alt || null,
      caption: caption || null,
      sortOrder: count,
      isPrimary: isPrimary || count === 0,
    },
  });

  revalidateProductPaths(product.slug, product.category.slug);
  return { success: true as const, image, blobUrl: blob.url };
}

export async function deleteProductImage(input: FormData | string) {
  await requireAdmin();
  let imageId: string;
  if (typeof FormData !== "undefined" && (input as unknown) instanceof FormData) {
    const fd = input as unknown as FormData;
    imageId = String(fd.get("imageId") ?? fd.get("id") ?? "");
  } else {
    imageId = String(input);
  }
  const schema = z.object({ imageId: z.string().min(1) });
  schema.parse({ imageId });

  const image = await prisma.productImage.findUnique({
    where: { id: imageId },
    include: { product: { include: { category: true } } },
  });
  if (!image) throw new Error("Image not found");

  try {
    await del(image.blobUrl);
  } catch {
    // ignore blob del errors
  }

  await prisma.productImage.delete({ where: { id: imageId } });

  revalidateProductPaths(image.product.slug, image.product.category.slug);
  return { success: true as const };
}

export async function setPrimaryImage(input: FormData | { productId: string; imageId: string }) {
  await requireAdmin();
  let productId: string;
  let imageId: string;
  if (typeof FormData !== "undefined" && (input as unknown) instanceof FormData) {
    const fd = input as unknown as FormData;
    productId = String(fd.get("productId") ?? "");
    imageId = String(fd.get("imageId") ?? fd.get("id") ?? "");
  } else if (input && typeof input === "object" && "productId" in input) {
    const obj = input as { productId: string; imageId: string };
    productId = obj.productId;
    imageId = obj.imageId;
  } else {
    throw new Error("Invalid input for setPrimaryImage");
  }

  const schema = z.object({
    productId: z.string().min(1),
    imageId: z.string().min(1),
  });
  schema.parse({ productId, imageId });

  const image = await prisma.productImage.findUnique({ where: { id: imageId } });
  if (!image || image.productId !== productId) throw new Error("Image not found for product");

  const product = await prisma.product.findUnique({ where: { id: productId }, include: { category: true } });
  if (!product) throw new Error("Product not found");

  await prisma.$transaction([
    prisma.productImage.updateMany({ where: { productId }, data: { isPrimary: false } }),
    prisma.productImage.update({ where: { id: imageId }, data: { isPrimary: true } }),
  ]);

  revalidateProductPaths(product.slug, product.category.slug);
  return { success: true as const };
}

export async function updateProductImageMeta(input: FormData | { imageId: string; alt?: string | null; caption?: string | null; sortOrder?: number }) {
  await requireAdmin();
  let imageId: string;
  let alt: string | null | undefined;
  let caption: string | null | undefined;
  let sortOrder: number | undefined;
  if (typeof FormData !== "undefined" && (input as unknown) instanceof FormData) {
    const fd = input as unknown as FormData;
    imageId = String(fd.get("imageId") ?? fd.get("id") ?? "");
    alt = fd.get("alt") !== null ? String(fd.get("alt")) : undefined;
    caption = fd.get("caption") !== null ? String(fd.get("caption")) : undefined;
    const so = fd.get("sortOrder");
    if (so !== null) sortOrder = parseInt(String(so), 10);
  } else {
    const obj = input as { imageId: string; alt?: string | null; caption?: string | null; sortOrder?: number };
    imageId = obj.imageId;
    alt = obj.alt;
    caption = obj.caption;
    sortOrder = obj.sortOrder;
  }
  const schema = z.object({
    imageId: z.string().min(1),
    alt: z.string().nullable().optional(),
    caption: z.string().nullable().optional(),
    sortOrder: z.number().int().min(0).optional(),
  });
  const parsed = schema.parse({ imageId, alt, caption, sortOrder });
  const image = await prisma.productImage.findUnique({ where: { id: parsed.imageId }, include: { product: { include: { category: true } } } });
  if (!image) throw new Error("Image not found");
  await prisma.productImage.update({
    where: { id: parsed.imageId },
    data: {
      ...(parsed.alt !== undefined ? { alt: parsed.alt } : {}),
      ...(parsed.caption !== undefined ? { caption: parsed.caption } : {}),
      ...(parsed.sortOrder !== undefined ? { sortOrder: parsed.sortOrder } : {}),
    },
  });
  revalidateProductPaths(image.product.slug, image.product.category.slug);
  return { success: true as const };
}

export async function reorderProductImages(productId: string, orderedIds: string[]) {
  await requireAdmin();
  const schema = z.object({
    productId: z.string().min(1),
    orderedIds: z.array(z.string().min(1)),
  });
  schema.parse({ productId, orderedIds });
  const product = await prisma.product.findUnique({ where: { id: productId }, include: { category: true } });
  if (!product) throw new Error("Product not found");
  await prisma.$transaction(
    orderedIds.map((id, idx) =>
      prisma.productImage.update({
        where: { id },
        data: { sortOrder: idx },
      })
    )
  );
  revalidateProductPaths(product.slug, product.category.slug);
  return { success: true as const };
}
