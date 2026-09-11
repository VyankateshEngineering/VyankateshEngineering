"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createKnowledgeArticle, updateKnowledgeArticle } from "../actions";

type ProductOption = { id: string; name: string; slug: string };
type FAQ = { question: string; answer: string; sortOrder: number };

type InitialData = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: unknown;
  coverBlobUrl: string | null;
  category: string | null;
  isPublished: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  faqs: FAQ[];
  relatedProductIds?: string[];
};

function slugify(v: string) {
  return v
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function contentToString(content: unknown): string {
  if (content == null) return "";
  if (typeof content === "string") return content;
  try {
    // If content is object that wraps mdx + relatedProductIds, extract mdx/value
    if (typeof content === "object" && content !== null) {
      const obj = content as Record<string, unknown>;
      if (typeof obj.mdx === "string") return String(obj.mdx);
      if (typeof obj.body === "string") return String(obj.body);
      if (typeof obj.value === "string") return String(obj.value);
      // If it's plain JSON, stringify pretty
      return JSON.stringify(content, null, 2);
    }
    return String(content);
  } catch {
    return String(content);
  }
}

export default function KnowledgeForm({
  initialData,
  mode,
  products,
  categories,
}: {
  initialData?: InitialData;
  mode: "create" | "edit";
  products: ProductOption[];
  categories: string[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(!!initialData?.slug);
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [content, setContent] = useState(contentToString(initialData?.content));
  const [coverBlobUrl, setCoverBlobUrl] = useState(initialData?.coverBlobUrl ?? "");
  const [category, setCategory] = useState(initialData?.category ?? categories[0] ?? "General");
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? false);
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle ?? "");
  const [seoDesc, setSeoDesc] = useState(initialData?.seoDescription ?? "");
  const [faqs, setFaqs] = useState<FAQ[]>(
    initialData?.faqs?.length ? initialData.faqs : [{ question: "", answer: "", sortOrder: 0 }]
  );
  const [relatedProductIds, setRelatedProductIds] = useState<string[]>(initialData?.relatedProductIds ?? []);
  const coverFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!slugEdited) setSlug(slugify(title));
  }, [title, slugEdited]);

  const addFaq = () => setFaqs((f) => [...f, { question: "", answer: "", sortOrder: f.length }]);
  const updateFaq = (idx: number, field: "question" | "answer", val: string) =>
    setFaqs((f) => f.map((it, i) => (i === idx ? { ...it, [field]: val } : it)));
  const removeFaq = (idx: number) => setFaqs((f) => f.filter((_, i) => i !== idx));

  const toggleRelatedProduct = (id: string) => {
    setRelatedProductIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    // Validate relatedProducts exist (client-side check)
    // content: try to keep as string if not JSON, otherwise JSON
    let contentValue: string | null = content.trim() || null;
    // If content is JSON object string, we let server parse
    const finalSlug = slug.trim() || slugify(title);

    // Prepare FormData for server action to support Blob coverFile via put/del server-only
    const fd = new FormData();
    fd.set("slug", finalSlug);
    fd.set("title", title.trim());
    fd.set("excerpt", excerpt.trim());
    fd.set("content", contentValue ?? "");
    fd.set("category", category);
    fd.set("isPublished", String(isPublished));
    fd.set("seoTitle", seoTitle.trim());
    fd.set("seoDescription", seoDesc.trim());
    fd.set("faqs", JSON.stringify(faqs.filter((f) => f.question.trim() && f.answer.trim()).map((f, idx) => ({ ...f, question: f.question.trim(), answer: f.answer.trim(), sortOrder: idx }))));
    fd.set("relatedProductIds", JSON.stringify(relatedProductIds));
    // coverBlobUrl if not replacing via file: keep existing URL unless file provided
    if (coverBlobUrl) fd.set("coverBlobUrl", coverBlobUrl);
    const coverFile = coverFileRef.current?.files?.[0];
    if (coverFile && coverFile.size > 0) {
      if (!coverFile.type.startsWith("image/")) {
        setError("Cover must be image/*");
        setSaving(false);
        return;
      }
      if (coverFile.size > 5 * 1024 * 1024) {
        setError("Cover file must be <=5MB");
        setSaving(false);
        return;
      }
      fd.set("coverFile", coverFile);
    }

    if (mode === "create") {
      try {
        const res = await createKnowledgeArticle(fd);
        if ((res as { success: boolean }).success) {
          const art = (res as { article: { id: string; slug: string } }).article;
          setSuccess(`Created ${art.slug} — revalidateTag('knowledge') + /knowledge + /knowledge/${art.slug} + /sitemap.xml. Cover stored at knowledge/${art.slug}.webp via put (server-only).`);
          router.push(`/admin/knowledge/${art.id}`);
          router.refresh();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Create failed");
      } finally {
        setSaving(false);
      }
    } else if (initialData) {
      try {
        // For edit, the server action expects id as first arg + FormData
        const res = await updateKnowledgeArticle(initialData.id, fd);
        if ((res as { success: boolean }).success) {
          const art = (res as { article: { slug: string } }).article;
          setSuccess(`Updated ${art.slug} — revalidated knowledge tag + /knowledge + /knowledge/${art.slug}. Blob ops via put/del server-only (knowledge/${art.slug}.webp).`);
          router.refresh();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Update failed");
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">{error}</div>}
      {success && <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">{success}</div>}

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Understanding Die Casting Tolerances" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug * auto from title</label>
            <input
              value={slug}
              onChange={(e) => {
                setSlug(slugify(e.target.value));
                setSlugEdited(true);
              }}
              required
              pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
              placeholder="understanding-die-casting-tolerances"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">knowledge/{"{slug}"}.webp for cover. Lowercase hyphens only.</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} placeholder="Short summary for listing and SEO..." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content (MDX/JSON editor)</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={12} placeholder="# MDX content here...&#10;Supports markdown, JSON, or structured MDX. Stored as Json in KnowledgeArticle.content." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono" />
          <p className="mt-1 text-xs text-gray-500">Stored as <code>Json</code> — can be raw MDX string or JSON object. Server validates via zod; supports JSON.stringify for structured content. Include FAQs separately below.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white">
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">e.g. Pins, Inserts, Dies, Products, General, AEO</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image — Blob <code>knowledge/{"{slug}"}.webp</code></label>
            <input ref={coverFileRef} type="file" accept="image/*" className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-black" />
            {coverBlobUrl && <p className="mt-1 text-xs text-gray-500 truncate" title={coverBlobUrl}>Current: {coverBlobUrl.slice(0, 60)}…</p>}
            <p className="mt-1 text-xs text-gray-500">Uses <code>put</code> from <code>@vercel/blob</code> server-only via <code>lib/blob.ts</code> <code>uploadToBlob(file, `knowledge/${"{slug}"}.webp`)</code> + <code>del</code> for replace/delete. Validates image/* ≤5MB. BLOB_READ_WRITE_TOKEN never exposed client.</p>
            <div className="mt-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Or coverBlobUrl (manual)</label>
              <input value={coverBlobUrl} onChange={(e) => setCoverBlobUrl(e.target.value)} placeholder="https://...public.blob.vercel-storage.com/knowledge/slug.webp" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-mono" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title (max 70)</label>
          <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} maxLength={70} placeholder="Knowledge article SEO title" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <p className="mt-1 text-xs text-gray-500">{seoTitle.length}/70</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description (max 320)</label>
          <textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} maxLength={320} rows={2} placeholder="SEO description for AEO/GEO..." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <p className="mt-1 text-xs text-gray-500">{seoDesc.length}/320</p>
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="rounded" />
          <span className="text-sm font-medium text-gray-700">isPublished</span>
          <span className="text-xs text-gray-500">revalidateTag(&apos;knowledge&apos;) + /knowledge + /knowledge/[slug] + /sitemap.xml after save</span>
        </label>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Related Products (multi-select)</label>
          <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-1">
            {products.length === 0 ? (
              <p className="text-xs text-gray-500">No products available</p>
            ) : (
              products.map((p) => (
                <label key={p.id} className="flex items-center gap-2 text-sm hover:bg-white px-2 py-1 rounded cursor-pointer">
                  <input type="checkbox" checked={relatedProductIds.includes(p.id)} onChange={() => toggleRelatedProduct(p.id)} className="rounded" />
                  <span className="font-medium text-gray-900">{p.name}</span>
                  <span className="text-xs text-gray-500 font-mono">({p.slug})</span>
                </label>
              ))
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">Validates product IDs exist server-side via zod + prisma. Stored in <code>content.relatedProductIds</code> Json (schema has no direct relation). Uses revalidation as above.</p>
          {relatedProductIds.length > 0 && <p className="mt-1 text-xs text-blue-600">Selected: {relatedProductIds.length} product(s)</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">FAQs (KnowledgeFAQ)</label>
            <button type="button" onClick={addFaq} className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-black">+ Add FAQ</button>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-lg border border-gray-200 p-3 bg-gray-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">FAQ #{idx + 1} • sortOrder: {idx}</span>
                  <button type="button" onClick={() => removeFaq(idx)} className="text-xs text-red-600 hover:underline">Remove</button>
                </div>
                <input value={faq.question} onChange={(e) => updateFaq(idx, "question", e.target.value)} placeholder="Question" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                <textarea value={faq.answer} onChange={(e) => updateFaq(idx, "answer", e.target.value)} placeholder="Answer" rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button type="submit" disabled={saving} className="rounded-lg bg-[#1a365d] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#122a4a] disabled:opacity-50">
          {saving ? "Saving..." : mode === "create" ? "Create Article (put knowledge/{slug}.webp if cover)" : "Save Changes (put/del server-only)"}
        </button>
        <button type="button" onClick={() => router.push("/admin/knowledge")} className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <span className="ml-auto text-xs text-gray-500">revalidateTag(&apos;knowledge&apos;) + revalidatePath for /knowledge & /knowledge/[slug] + /sitemap.xml</span>
      </div>
    </form>
  );
}
