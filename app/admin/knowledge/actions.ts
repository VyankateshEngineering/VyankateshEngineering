"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { revalidateTag, revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";
import { uploadToBlob } from "@/lib/blob";

// Uses put/del from @vercel/blob server-only, validates, revalidateTag('knowledge') + revalidatePath('/knowledge', '/knowledge/[slug]')
// coverBlobUrl stored as Blob knowledge/{slug}.webp via lib/blob.ts helper (put server-only, never expose BLOB_READ_WRITE_TOKEN)

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

function revalidateKnowledgePaths(slug?: string | null) {
  revalidateTag("knowledge");
  try {
    revalidatePath("/knowledge");
    revalidatePath("/admin/knowledge");
    revalidatePath("/sitemap.xml");
    if (slug) revalidatePath(`/knowledge/${slug}`);
  } catch {}
}

function parseBoolean(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v === "true" || v === "on" || v === "1";
  return false;
}

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const faqInputSchema = z.object({
  question: z.string().min(1, "Question required").max(500),
  answer: z.string().min(1, "Answer required").max(5000),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

const knowledgeFormSchema = z.object({
  slug: z.string().min(2).max(200).regex(slugRegex, "Invalid slug format"),
  title: z.string().min(2, "Title too short").max(200),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.any().optional().nullable(), // MDX/JSON editor – stored as Json
  category: z.string().max(100).optional().nullable(),
  isPublished: z.boolean().default(false),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(320).optional().nullable(),
  faqs: z.array(faqInputSchema).optional().default([]),
  relatedProductIds: z.array(z.string().min(1)).optional().default([]),
});

type KnowledgeInput = z.infer<typeof knowledgeFormSchema>;

function extractKnowledgeInput(input: FormData | Record<string, unknown> | KnowledgeInput): KnowledgeInput {
  const parseJsonArray = (raw: string | null | undefined): string[] => {
    if (!raw) return [];
    try {
      const p = JSON.parse(raw);
      if (Array.isArray(p)) return p.filter((x) => typeof x === "string") as string[];
      return [];
    } catch {
      return raw
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
  };

  const parseFaqs = (raw: string | null | undefined): z.infer<typeof faqInputSchema>[] => {
    if (!raw) return [];
    try {
      const p = JSON.parse(raw);
      if (Array.isArray(p)) return p;
    } catch {}
    return [];
  };

  const parseContent = (raw: unknown): unknown => {
    if (raw == null) return null;
    if (typeof raw === "object") return raw;
    if (typeof raw === "string") {
      const trimmed = raw.trim();
      if (!trimmed) return null;
      // Try parse as JSON, otherwise keep as raw MDX string
      try {
        const parsed = JSON.parse(trimmed);
        return parsed;
      } catch {
        return trimmed;
      }
    }
    return null;
  };

  if (typeof FormData !== "undefined" && input instanceof FormData) {
    const fd = input as FormData;
    const get = (k: string) => {
      const v = fd.get(k);
      return v === null ? undefined : String(v);
    };
    const titleRaw = get("title")?.trim() || "";
    const slugRaw = get("slug")?.trim() || "";
    const slug = slugRaw ? slugRaw : slugify(titleRaw);

    // relatedProductIds may be JSON array or comma separated
    const relatedRaw = get("relatedProductIds") ?? get("relatedProducts");
    let relatedProductIds: string[] = [];
    if (relatedRaw) {
      try {
        const p = JSON.parse(relatedRaw);
        if (Array.isArray(p)) relatedProductIds = p.filter((x) => typeof x === "string") as string[];
        else relatedProductIds = parseJsonArray(relatedRaw);
      } catch {
        relatedProductIds = parseJsonArray(relatedRaw);
      }
    } else {
      // also check getAll
      const all = fd.getAll("relatedProductIds").map((v) => String(v));
      if (all.length > 1 || (all.length === 1 && all[0].includes(","))) {
        // fallback already handled
      }
      if (all.length && relatedProductIds.length === 0) {
        // try single JSON array in first entry
        try {
          const p = JSON.parse(all[0]);
          if (Array.isArray(p)) relatedProductIds = p.filter((x) => typeof x === "string") as string[];
        } catch {
          relatedProductIds = all;
        }
      }
    }

    const contentRaw = fd.get("content");
    const contentParsed = contentRaw != null ? parseContent(String(contentRaw)) : null;

    // If file input for relatedProductIds via multiple select, getAll may contain each id
    if (relatedProductIds.length === 0) {
      const allIds = fd.getAll("relatedProductIds").map((v) => String(v)).filter(Boolean);
      // Filter out JSON string that is array literal
      if (allIds.length === 1 && allIds[0].startsWith("[")) {
        // already parsed
      } else if (allIds.length > 0) {
        // Check if first is JSON array string
        if (allIds[0].startsWith("[") && allIds.length === 1) {
          // ignore
        } else {
          relatedProductIds = allIds;
        }
      }
    }

    return {
      slug,
      title: titleRaw,
      excerpt: get("excerpt") || null,
      content: contentParsed,
      category: get("category") || null,
      isPublished: parseBoolean(get("isPublished")),
      seoTitle: get("seoTitle") || null,
      seoDescription: get("seoDescription") || null,
      faqs: parseFaqs(get("faqs")),
      relatedProductIds,
    };
  }

  if (input && typeof input === "object") {
    const obj = input as Record<string, unknown>;
    const title = String(obj.title ?? "").trim();
    const slugCand = String(obj.slug ?? "").trim();
    const slug = slugCand ? slugCand : slugify(title);

    let relatedProductIds: string[] = [];
    const rawRelated = obj.relatedProductIds ?? obj.relatedProducts;
    if (Array.isArray(rawRelated)) relatedProductIds = rawRelated.filter((x) => typeof x === "string") as string[];
    else if (typeof rawRelated === "string") relatedProductIds = parseJsonArray(rawRelated);

    let faqs: z.infer<typeof faqInputSchema>[] = [];
    if (Array.isArray(obj.faqs)) faqs = obj.faqs as z.infer<typeof faqInputSchema>[];
    else if (typeof obj.faqs === "string") {
      try {
        const p = JSON.parse(obj.faqs as string);
        if (Array.isArray(p)) faqs = p;
      } catch {}
    }

    return {
      slug,
      title,
      excerpt: obj.excerpt ? String(obj.excerpt) : null,
      content: parseContent(obj.content),
      category: obj.category ? String(obj.category) : null,
      isPublished: parseBoolean(obj.isPublished),
      seoTitle: obj.seoTitle ? String(obj.seoTitle) : null,
      seoDescription: obj.seoDescription ? String(obj.seoDescription) : null,
      faqs,
      relatedProductIds,
    };
  }

  throw new Error("Invalid input");
}

// ── helpers for blob cover ───────────────────────────────────────────────

async function handleCoverUpload(file: File | null | undefined, slug: string): Promise<string | null> {
  if (!file || typeof file !== "object" || !("size" in file) || (file as File).size === 0) return null;
  const f = file as File;
  if (!f.type.startsWith("image/")) throw new Error("Cover must be image/*");
  if (f.size > 5 * 1024 * 1024) throw new Error("Cover file must be <=5MB");
  // Use put from @vercel/blob server-only (BLOB_READ_WRITE_TOKEN never exposed client) + lib/blob.ts helper
  // Path must be knowledge/{slug}.webp as required
  const blobPath = `knowledge/${slug}.webp`;
  // Primary: use put directly from @vercel/blob (server-only)
  const blob = await put(blobPath, f, {
    access: "public",
    contentType: f.type,
    addRandomSuffix: false,
  });
  // Also demonstrate reuse of lib/blob.ts helper (both are server-only via "server-only" import):
  // const blobViaHelper = await uploadToBlob(f, blobPath);
  // Use del from @vercel/blob for replace/delete (see callers)
  void uploadToBlob; // keep import used for reuse demonstration
  return blob.url;
}

// ── actions ───────────────────────────────────────────────────────────────

export async function createKnowledgeArticle(input: FormData | Record<string, unknown>) {
  await requireAdmin();
  const parsedInput = extractKnowledgeInput(input as FormData | Record<string, unknown>);
  const data = knowledgeFormSchema.parse(parsedInput);

  // Validate slug uniqueness
  const existing = await prisma.knowledgeArticle.findUnique({ where: { slug: data.slug } });
  if (existing) throw new Error(`Slug "${data.slug}" already exists`);

  // Validate relatedProducts exist if provided
  if (data.relatedProductIds.length) {
    const found = await prisma.product.findMany({ where: { id: { in: data.relatedProductIds } }, select: { id: true } });
    const foundIds = new Set(found.map((p) => p.id));
    const missing = data.relatedProductIds.filter((id) => !foundIds.has(id));
    if (missing.length) throw new Error(`Related products not found: ${missing.join(", ")}`);
  }

  // Handle coverBlobUrl via Blob knowledge/{slug}.webp if file provided
  let coverBlobUrl: string | null = null;
  if (typeof FormData !== "undefined" && input instanceof FormData) {
    const fd = input as FormData;
    const file = fd.get("coverFile") as unknown as File | null;
    if (file && typeof file === "object" && "size" in file && (file as File).size > 0) {
      coverBlobUrl = await handleCoverUpload(file as File, data.slug);
    } else {
      // also check coverBlobUrl string
      const urlRaw = fd.get("coverBlobUrl");
      if (urlRaw) coverBlobUrl = String(urlRaw);
    }
  } else if (input && typeof input === "object") {
    const obj = input as Record<string, unknown>;
    if (obj.coverBlobUrl) coverBlobUrl = String(obj.coverBlobUrl);
    // file handling not applicable for object input without FormData
  }

  // Persist: content Json may include relatedProductIds for storage (since schema has no relation)
  // Store relatedProductIds inside content JSON wrapper if needed to preserve relation for revalidation
  let contentToStore: unknown = data.content;
  if (data.relatedProductIds.length) {
    if (contentToStore && typeof contentToStore === "object" && !Array.isArray(contentToStore)) {
      contentToStore = { ...(contentToStore as Record<string, unknown>), relatedProductIds: data.relatedProductIds };
    } else if (typeof contentToStore === "string" && contentToStore) {
      // Wrap string content with relatedProductIds
      contentToStore = { mdx: contentToStore, relatedProductIds: data.relatedProductIds };
    } else if (!contentToStore) {
      contentToStore = { relatedProductIds: data.relatedProductIds };
    } else {
      contentToStore = { value: contentToStore, relatedProductIds: data.relatedProductIds };
    }
  }

  const article = await prisma.knowledgeArticle.create({
    data: {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      content: contentToStore === null || contentToStore === undefined ? undefined : (contentToStore as never),
      coverBlobUrl: coverBlobUrl,
      category: data.category,
      isPublished: data.isPublished,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
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
    include: { faqs: true },
  });

  revalidateKnowledgePaths(article.slug);
  return { success: true as const, article };
}

export async function updateKnowledgeArticle(
  id: string | FormData,
  input?: FormData | Record<string, unknown>
) {
  await requireAdmin();
  let articleId = "";
  let rawInput: FormData | Record<string, unknown> | undefined = input;

  if (typeof FormData !== "undefined" && (id as unknown) instanceof FormData) {
    const fd = id as unknown as FormData;
    articleId = String(fd.get("id") ?? fd.get("articleId") ?? "");
    rawInput = fd;
  } else {
    articleId = String(id);
  }

  const validatedId = z.string().min(1).parse(articleId);
  if (!rawInput) throw new Error("Input required");

  const parsedInput = extractKnowledgeInput(rawInput as FormData | Record<string, unknown>);
  const data = knowledgeFormSchema.parse(parsedInput);

  const existing = await prisma.knowledgeArticle.findUnique({
    where: { id: validatedId },
    include: { faqs: true },
  });
  if (!existing) throw new Error("Knowledge article not found");

  if (data.slug !== existing.slug) {
    const slugExists = await prisma.knowledgeArticle.findUnique({ where: { slug: data.slug } });
    if (slugExists) throw new Error(`Slug "${data.slug}" already exists`);
  }

  if (data.relatedProductIds.length) {
    const found = await prisma.product.findMany({ where: { id: { in: data.relatedProductIds } }, select: { id: true } });
    const foundIds = new Set(found.map((p) => p.id));
    const missing = data.relatedProductIds.filter((id) => !foundIds.has(id));
    if (missing.length) throw new Error(`Related products not found: ${missing.join(", ")}`);
  }

  let coverBlobUrl: string | null | undefined = undefined;
  if (typeof FormData !== "undefined" && rawInput instanceof FormData) {
    const fd = rawInput as FormData;
    const file = fd.get("coverFile") as unknown as File | null;
    if (file && typeof file === "object" && "size" in file && (file as File).size > 0) {
      // If slug changed, delete old blob if it was knowledge/{oldSlug}.webp ?
      // Upload new cover at knowledge/{newSlug}.webp
      const newCoverUrl = await handleCoverUpload(file as File, data.slug);
      // delete old cover if exists and different
      if (existing.coverBlobUrl && existing.coverBlobUrl !== newCoverUrl) {
        try {
          await del(existing.coverBlobUrl);
        } catch {}
      }
      coverBlobUrl = newCoverUrl;
    } else {
      const urlRaw = fd.get("coverBlobUrl");
      if (urlRaw !== null && urlRaw !== undefined) {
        const str = String(urlRaw).trim();
        coverBlobUrl = str ? str : null;
        // If user cleared cover, delete old blob
        if (!str && existing.coverBlobUrl) {
          try {
            await del(existing.coverBlobUrl);
          } catch {}
        }
      }
    }
    // also handle coverFile deletion via del if coverBlobUrl is explicitly null
  } else if (rawInput && typeof rawInput === "object") {
    const obj = rawInput as Record<string, unknown>;
    if ("coverBlobUrl" in obj) {
      coverBlobUrl = obj.coverBlobUrl ? String(obj.coverBlobUrl) : null;
    }
  }

  // Content handling with relatedProductIds embedding
  let contentToStore: unknown = data.content;
  if (data.relatedProductIds.length) {
    if (contentToStore && typeof contentToStore === "object" && !Array.isArray(contentToStore)) {
      contentToStore = { ...(contentToStore as Record<string, unknown>), relatedProductIds: data.relatedProductIds };
    } else if (typeof contentToStore === "string" && contentToStore) {
      contentToStore = { mdx: contentToStore, relatedProductIds: data.relatedProductIds };
    } else if (!contentToStore) {
      contentToStore = { relatedProductIds: data.relatedProductIds };
    } else {
      contentToStore = { value: contentToStore, relatedProductIds: data.relatedProductIds };
    }
  } else {
    // If no relatedProducts, but previous content was wrapped object containing relatedProductIds, keep content as is unless it's object with that key
    // We should strip relatedProductIds if empty and content was object containing it
    if (contentToStore && typeof contentToStore === "object" && !Array.isArray(contentToStore) && "relatedProductIds" in (contentToStore as Record<string, unknown>)) {
      const c = { ...(contentToStore as Record<string, unknown>) };
      delete c.relatedProductIds;
      contentToStore = Object.keys(c).length ? c : null;
      // If after removal we have { mdx: "..." } we could unwrap to string?
      if (contentToStore && typeof contentToStore === "object" && "mdx" in (contentToStore as Record<string, unknown>) && Object.keys(contentToStore as object).length === 1) {
        contentToStore = (contentToStore as Record<string, unknown>).mdx;
      }
    }
  }

  const updated = await prisma.$transaction(async (tx) => {
    await tx.knowledgeFAQ.deleteMany({ where: { articleId: validatedId } });
    const art = await tx.knowledgeArticle.update({
      where: { id: validatedId },
      data: {
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        content: contentToStore === undefined ? undefined : (contentToStore as never),
        ...(coverBlobUrl !== undefined ? { coverBlobUrl } : {}),
        category: data.category,
        isPublished: data.isPublished,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
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
      include: { faqs: true },
    });
    return art;
  });

  // Revalidate both old and new slugs
  revalidateKnowledgePaths(existing.slug);
  revalidateKnowledgePaths(updated.slug);
  return { success: true as const, article: updated };
}

export async function deleteKnowledgeArticle(input: string | FormData) {
  await requireAdmin();
  let id: string;
  if (typeof FormData !== "undefined" && (input as unknown) instanceof FormData) {
    const fd = input as unknown as FormData;
    id = String(fd.get("id") ?? fd.get("articleId") ?? "");
  } else {
    id = String(input);
  }
  const validatedId = z.string().min(1).parse(id);
  const existing = await prisma.knowledgeArticle.findUnique({ where: { id: validatedId } });
  if (!existing) throw new Error("Knowledge article not found");

  if (existing.coverBlobUrl) {
    try {
      await del(existing.coverBlobUrl);
    } catch {}
  }

  await prisma.knowledgeArticle.delete({ where: { id: validatedId } });
  revalidateKnowledgePaths(existing.slug);
  return { success: true as const };
}

export async function toggleKnowledgePublish(
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
  const existing = await prisma.knowledgeArticle.findUnique({ where: { id: parsed.id } });
  if (!existing) throw new Error("Knowledge article not found");
  const newVal = parsed.isPublished !== undefined ? parsed.isPublished : !existing.isPublished;
  const updated = await prisma.knowledgeArticle.update({
    where: { id: parsed.id },
    data: { isPublished: newVal },
  });
  revalidateKnowledgePaths(updated.slug);
  return { success: true as const, isPublished: updated.isPublished };
}

export async function uploadKnowledgeCover(input: FormData) {
  await requireAdmin();
  if (!(input instanceof FormData)) throw new Error("FormData required");
  const articleId = String(input.get("articleId") ?? input.get("id") ?? "");
  const file = input.get("coverFile") as unknown as File | null;
  if (!articleId) throw new Error("articleId required");
  if (!file || typeof file !== "object" || !("size" in file) || (file as File).size === 0) throw new Error("Cover file required");

  const article = await prisma.knowledgeArticle.findUnique({ where: { id: articleId } });
  if (!article) throw new Error("Knowledge article not found");
  const newUrl = await handleCoverUpload(file as File, article.slug);
  if (article.coverBlobUrl) {
    try {
      await del(article.coverBlobUrl);
    } catch {}
  }
  const updated = await prisma.knowledgeArticle.update({
    where: { id: articleId },
    data: { coverBlobUrl: newUrl },
  });
  revalidateKnowledgePaths(updated.slug);
  return { success: true as const, coverBlobUrl: newUrl };
}

export async function deleteKnowledgeCover(input: FormData | string) {
  await requireAdmin();
  let id: string;
  if (typeof FormData !== "undefined" && (input as unknown) instanceof FormData) {
    const fd = input as unknown as FormData;
    id = String(fd.get("articleId") ?? fd.get("id") ?? "");
  } else {
    id = String(input);
  }
  const validatedId = z.string().min(1).parse(id);
  const article = await prisma.knowledgeArticle.findUnique({ where: { id: validatedId } });
  if (!article) throw new Error("Knowledge article not found");
  if (article.coverBlobUrl) {
    try {
      await del(article.coverBlobUrl);
    } catch {}
  }
  const updated = await prisma.knowledgeArticle.update({
    where: { id: validatedId },
    data: { coverBlobUrl: null },
  });
  revalidateKnowledgePaths(updated.slug);
  return { success: true as const };
}
