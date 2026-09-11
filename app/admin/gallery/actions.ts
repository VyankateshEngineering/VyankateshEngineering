"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { revalidateTag, revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { randomUUID } from "crypto";
import { uploadToBlob } from "@/lib/blob";

// ── helpers ───────────────────────────────────────────────────────────────

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

function revalidateGalleryPaths() {
  revalidateTag("gallery");
  try {
    revalidatePath("/gallery");
    revalidatePath("/sitemap.xml");
    revalidatePath("/admin/gallery");
  } catch {
    // ignore
  }
}

function parseBoolean(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v === "true" || v === "on" || v === "1";
  return false;
}

function parseIntSafe(v: unknown, fallback = 0): number {
  if (typeof v === "number") return Math.trunc(v);
  const n = parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

// ── zod schemas ───────────────────────────────────────────────────────────

const galleryInputSchema = z.object({
  title: z.string().max(200).optional().nullable(),
  alt: z.string().max(500).optional().nullable(),
  caption: z.string().max(500).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isPublished: z.boolean().default(true),
});

type GalleryInput = z.infer<typeof galleryInputSchema>;

function extractGalleryInput(formData: FormData | Record<string, unknown> | GalleryInput): GalleryInput {
  if (typeof FormData !== "undefined" && formData instanceof FormData) {
    const fd = formData as FormData;
    const get = (k: string) => {
      const v = fd.get(k);
      return v === null ? undefined : String(v);
    };
    return {
      title: get("title") || null,
      alt: get("alt") || null,
      caption: get("caption") || null,
      category: get("category") || null,
      sortOrder: parseIntSafe(get("sortOrder") ?? "0", 0),
      isPublished: parseBoolean(get("isPublished")),
    };
  }
  if (formData && typeof formData === "object") {
    const obj = formData as Record<string, unknown>;
    return {
      title: obj.title ? String(obj.title) : null,
      alt: obj.alt ? String(obj.alt) : null,
      caption: obj.caption ? String(obj.caption) : null,
      category: obj.category ? String(obj.category) : null,
      sortOrder: parseIntSafe(obj.sortOrder, 0),
      isPublished: parseBoolean(obj.isPublished),
    };
  }
  throw new Error("Invalid input");
}

// ── actions ───────────────────────────────────────────────────────────────

export async function createGalleryImage(input: FormData) {
  await requireAdmin();
  if (!(input instanceof FormData)) throw new Error("FormData required");
  const fd = input as FormData;
  const data = galleryInputSchema.parse(extractGalleryInput(fd));
  const file = fd.get("file") as unknown as File | null;

  if (!file || typeof file !== "object" || !("size" in file)) {
    throw new Error("File is required");
  }
  const f = file as File;
  if (!f.type.startsWith("image/")) throw new Error("Only image/* allowed");
  if (f.size > 5 * 1024 * 1024) throw new Error("File size must be <= 5MB");

  const uuid = randomUUID();
  const blobPath = `gallery/${uuid}.webp`;
  const blob = await uploadToBlob(f, blobPath);

  const created = await prisma.galleryImage.create({
    data: {
      blobUrl: blob.url,
      title: data.title,
      alt: data.alt,
      caption: data.caption,
      category: data.category,
      sortOrder: data.sortOrder,
      isPublished: data.isPublished,
    },
  });

  revalidateGalleryPaths();
  return { success: true as const, image: created };
}

export async function updateGalleryImage(
  id: string | FormData,
  input?: FormData | Record<string, unknown>
) {
  await requireAdmin();

  let galleryId = "";
  let fd: FormData | Record<string, unknown> | undefined = input;

  if (typeof FormData !== "undefined" && (id as unknown) instanceof FormData) {
    const form = id as unknown as FormData;
    galleryId = String(form.get("id") ?? form.get("imageId") ?? "");
    fd = form;
  } else {
    galleryId = String(id);
    if (!fd && typeof FormData !== "undefined" && (id as unknown) instanceof FormData) {
      fd = id as unknown as FormData;
    }
  }

  const idSchema = z.string().min(1);
  const validatedId = idSchema.parse(galleryId);

  if (!fd) throw new Error("FormData or input required");

  // fd may be FormData or object
  let data: GalleryInput;
  let file: File | null = null;

  if (typeof FormData !== "undefined" && fd instanceof FormData) {
    data = galleryInputSchema.parse(extractGalleryInput(fd));
    const rawFile = fd.get("file") as unknown as File | null;
    if (rawFile && typeof rawFile === "object" && "size" in rawFile && (rawFile as File).size > 0) {
      file = rawFile as File;
    }
  } else {
    data = galleryInputSchema.parse(extractGalleryInput(fd as Record<string, unknown>));
    // file handling for object input not supported for blob replace (use FormData for file)
  }

  const existing = await prisma.galleryImage.findUnique({ where: { id: validatedId } });
  if (!existing) throw new Error("Gallery image not found");

  let blobUrl = existing.blobUrl;
  if (file) {
    if (!file.type.startsWith("image/")) throw new Error("Only image/* allowed");
    if (file.size > 5 * 1024 * 1024) throw new Error("File size must be <= 5MB");
    const uuid = randomUUID();
    const blobPath = `gallery/${uuid}.webp`;
    const blob = await uploadToBlob(file, blobPath);
    try {
      await del(existing.blobUrl);
    } catch {
      // ignore del errors (e.g. token missing or blob not found)
    }
    blobUrl = blob.url;
  }

  const updated = await prisma.galleryImage.update({
    where: { id: validatedId },
    data: {
      blobUrl,
      title: data.title,
      alt: data.alt,
      caption: data.caption,
      category: data.category,
      sortOrder: data.sortOrder,
      isPublished: data.isPublished,
    },
  });

  revalidateGalleryPaths();
  return { success: true as const, image: updated };
}

export async function deleteGalleryImage(input: string | FormData) {
  await requireAdmin();
  let id: string;
  if (typeof FormData !== "undefined" && (input as unknown) instanceof FormData) {
    const fd = input as unknown as FormData;
    id = String(fd.get("id") ?? fd.get("imageId") ?? "");
  } else {
    id = String(input);
  }
  const validatedId = z.string().min(1).parse(id);
  const existing = await prisma.galleryImage.findUnique({ where: { id: validatedId } });
  if (!existing) throw new Error("Gallery image not found");

  try {
    await del(existing.blobUrl);
  } catch {
    // ignore
  }

  await prisma.galleryImage.delete({ where: { id: validatedId } });
  revalidateGalleryPaths();
  return { success: true as const };
}

export async function toggleGalleryPublish(
  input: string | FormData | { id: string; isPublished?: boolean }
) {
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

  const schema = z.object({ id: z.string().min(1), isPublished: z.boolean().optional() });
  const parsed = schema.parse({ id, isPublished });
  const existing = await prisma.galleryImage.findUnique({ where: { id: parsed.id } });
  if (!existing) throw new Error("Gallery image not found");
  const newVal = parsed.isPublished !== undefined ? parsed.isPublished : !existing.isPublished;
  const updated = await prisma.galleryImage.update({
    where: { id: parsed.id },
    data: { isPublished: newVal },
  });
  revalidateGalleryPaths();
  return { success: true as const, isPublished: updated.isPublished };
}

export async function reorderGalleryImages(input: string[] | FormData) {
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
        orderedIds = String(raw)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    } else {
      const all = fd.getAll("id").map((v: FormDataEntryValue) => String(v));
      if (all.length) orderedIds = all;
    }
  } else if (Array.isArray(input)) {
    orderedIds = input;
  } else {
    throw new Error("Invalid input for reorderGalleryImages");
  }

  const schema = z.array(z.string().min(1)).min(1);
  const validated = schema.parse(orderedIds);

  await prisma.$transaction(
    validated.map((id, idx) =>
      prisma.galleryImage.update({
        where: { id },
        data: { sortOrder: idx },
      })
    )
  );

  revalidateGalleryPaths();
  return { success: true as const };
}

export async function uploadGalleryImageBlob(input: FormData) {
  // Alias for createGalleryImage with minimal fields - for direct upload usage
  return createGalleryImage(input);
}
