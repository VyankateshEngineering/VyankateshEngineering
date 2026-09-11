"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  createProduct,
  updateProduct,
  uploadProductImage,
  deleteProductImage,
  setPrimaryImage,
  reorderProductImages,
  updateProductImageMeta,
} from "../actions";

type Category = { id: string; name: string; slug: string };
type ProductImage = {
  id: string;
  blobUrl: string;
  alt: string | null;
  caption: string | null;
  sortOrder: number;
  isPrimary: boolean;
};
type ProductFAQ = { id?: string; question: string; answer: string; sortOrder: number };

type InitialData = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  overview: string | null;
  specs: Record<string, string> | null;
  features: string[];
  applications: string | null;
  applicationsList: string[];
  industries: string[];
  material: string | null;
  tolerance: string | null;
  surfaceFinish: string | null;
  customization: string | null;
  availableSizes: string | null;
  qualityNote: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
  images: ProductImage[];
  faqs: ProductFAQ[];
};

const TABS = [
  "Basic Information",
  "Specifications",
  "Features",
  "Applications/Industries",
  "Images",
  "FAQs",
  "SEO",
  "Publishing",
] as const;

type Tab = (typeof TABS)[number];

function slugify(v: string) {
  return v
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ProductForm({
  categories,
  initialData,
  mode,
}: {
  categories: Category[];
  initialData?: InitialData;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Basic Information");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Basic
  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(!!initialData?.slug);
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? categories[0]?.id ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [overview, setOverview] = useState(initialData?.overview ?? "");

  // Specs: key-value
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>(() => {
    if (initialData?.specs) return Object.entries(initialData.specs).map(([k, v]) => ({ key: k, value: v as string }));
    return [{ key: "", value: "" }];
  });

  // Features
  const [features, setFeatures] = useState<string[]>(initialData?.features ?? [""]);

  // Applications / Industries
  const [applications, setApplications] = useState(initialData?.applications ?? "");
  const [applicationsList, setApplicationsList] = useState<string[]>(initialData?.applicationsList ?? []);
  const [appInput, setAppInput] = useState("");
  const [industries, setIndustries] = useState<string[]>(initialData?.industries ?? []);
  const [industryInput, setIndustryInput] = useState("");

  // Images
  const [images, setImages] = useState<ProductImage[]>(initialData?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // FAQs
  const [faqs, setFaqs] = useState<ProductFAQ[]>(
    initialData?.faqs?.length ? initialData.faqs : [{ question: "", answer: "", sortOrder: 0 }]
  );

  // SEO
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription ?? "");

  // Publishing
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder ?? 0);

  // Material etc. (optional advanced fields – expose as collapsible)
  const [material, setMaterial] = useState(initialData?.material ?? "");
  const [tolerance, setTolerance] = useState(initialData?.tolerance ?? "");
  const [surfaceFinish, setSurfaceFinish] = useState(initialData?.surfaceFinish ?? "");
  const [customization, setCustomization] = useState(initialData?.customization ?? "");
  const [availableSizes, setAvailableSizes] = useState(initialData?.availableSizes ?? "");
  const [qualityNote, setQualityNote] = useState(initialData?.qualityNote ?? "");

  useEffect(() => {
    if (!slugEdited) {
      setSlug(slugify(name));
    }
  }, [name, slugEdited]);

  const addSpec = () => setSpecs((s) => [...s, { key: "", value: "" }]);
  const updateSpec = (idx: number, field: "key" | "value", val: string) =>
    setSpecs((s) => s.map((it, i) => (i === idx ? { ...it, [field]: val } : it)));
  const removeSpec = (idx: number) => setSpecs((s) => s.filter((_, i) => i !== idx));

  const addFeature = () => setFeatures((f) => [...f, ""]);
  const updateFeature = (idx: number, val: string) => setFeatures((f) => f.map((it, i) => (i === idx ? val : it)));
  const removeFeature = (idx: number) => setFeatures((f) => f.filter((_, i) => i !== idx));

  const addAppTag = () => {
    const t = appInput.trim();
    if (!t) return;
    setApplicationsList((v) => [...v, t]);
    setAppInput("");
  };
  const removeAppTag = (idx: number) => setApplicationsList((v) => v.filter((_, i) => i !== idx));

  const addIndustryTag = () => {
    const t = industryInput.trim();
    if (!t) return;
    setIndustries((v) => [...v, t]);
    setIndustryInput("");
  };
  const removeIndustryTag = (idx: number) => setIndustries((v) => v.filter((_, i) => i !== idx));

  const addFaq = () => setFaqs((f) => [...f, { question: "", answer: "", sortOrder: f.length }]);
  const updateFaq = (idx: number, field: "question" | "answer", val: string) =>
    setFaqs((f) => f.map((it, i) => (i === idx ? { ...it, [field]: val } : it)));
  const removeFaq = (idx: number) => setFaqs((f) => f.filter((_, i) => i !== idx));

  // Images handlers
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (mode === "create") {
      setError("Save product first before uploading images. Images require a product ID.");
      return;
    }
    const productId = initialData!.id;
    setUploading(true);
    setError(null);
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        setError(`File ${file.name}: Only image/* allowed`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`File ${file.name}: Max 5MB`);
        continue;
      }
      const fd = new FormData();
      fd.set("productId", productId);
      fd.set("file", file);
      fd.set("alt", "");
      fd.set("caption", "");
      fd.set("isPrimary", images.length === 0 ? "true" : "false");
      try {
        const res = await uploadProductImage(fd);
        if (res && (res as unknown as { success: boolean }).success) {
          const newImg = (res as unknown as { image: ProductImage }).image;
          setImages((prev) => [...prev, newImg]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Delete this image? Blob will be deleted via Vercel Blob del.")) return;
    try {
      const fd = new FormData();
      fd.set("imageId", imageId);
      await deleteProductImage(fd);
      setImages((prev) => prev.filter((im) => im.id !== imageId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    if (mode === "create" || !initialData) return;
    const fd = new FormData();
    fd.set("productId", initialData.id);
    fd.set("imageId", imageId);
    try {
      await setPrimaryImage(fd);
      setImages((prev) => prev.map((im) => ({ ...im, isPrimary: im.id === imageId })));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Set primary failed");
    }
  };

  const handleImageMetaBlur = async (img: ProductImage) => {
    // persist alt/caption via updateProductImageMeta
    try {
      await updateProductImageMeta({ imageId: img.id, alt: img.alt, caption: img.caption });
    } catch {}
  };

  const handleImageDragStart = (idx: number) => setDragIndex(idx);
  const handleImageDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === idx) return;
  };
  const handleImageDrop = async (e: React.DragEvent, dropIdx: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIdx) return;
    const newImages = [...images];
    const [moved] = newImages.splice(dragIndex, 1);
    newImages.splice(dropIdx, 0, moved);
    // update sortOrder locally
    const reordered = newImages.map((im, idx) => ({ ...im, sortOrder: idx }));
    setImages(reordered);
    setDragIndex(null);
    if (mode === "edit" && initialData) {
      try {
        await reorderProductImages(initialData.id, reordered.map((im) => im.id));
      } catch {}
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    // Build specs record
    const specsRecord: Record<string, string> = {};
    specs.forEach((s) => {
      const k = s.key.trim();
      const v = s.value.trim();
      if (k) specsRecord[k] = v;
    });

    const payload = {
      name: name.trim(),
      slug: slug.trim() || slugify(name),
      categoryId,
      description: description.trim(),
      overview: overview.trim() || null,
      specs: Object.keys(specsRecord).length ? specsRecord : null,
      features: features.map((f) => f.trim()).filter(Boolean),
      applications: applications.trim() || null,
      applicationsList: applicationsList.filter(Boolean),
      industries: industries.filter(Boolean),
      material: material.trim() || null,
      tolerance: tolerance.trim() || null,
      surfaceFinish: surfaceFinish.trim() || null,
      customization: customization.trim() || null,
      availableSizes: availableSizes.trim() || null,
      qualityNote: qualityNote.trim() || null,
      seoTitle: seoTitle.trim() || null,
      seoDescription: seoDescription.trim() || null,
      isPublished,
      isFeatured,
      sortOrder: Number(sortOrder) || 0,
      faqs: faqs
        .filter((f) => f.question.trim() && f.answer.trim())
        .map((f, idx) => ({ question: f.question.trim(), answer: f.answer.trim(), sortOrder: idx })),
    };

    try {
      if (mode === "create") {
        const res = await createProduct(payload as unknown as FormData);
        if ((res as unknown as { success: boolean }).success) {
          setSuccess("Product created. Redirecting...");
          const prod = (res as unknown as { product: { id: string } }).product;
          router.push(`/admin/products/${prod.id}`);
          router.refresh();
        }
      } else if (initialData) {
        const res = await updateProduct(initialData.id, payload as unknown as FormData);
        if ((res as unknown as { success: boolean }).success) {
          setSuccess("Product updated.");
          router.refresh();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">{error}</div>}
      {success && <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">{success}</div>}

      {/* Tabs */}
      <div className="overflow-x-auto border-b border-gray-200">
        <nav className="flex gap-1 min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-medium border-b-2 transition ${
                activeTab === tab ? "border-[#1a365d] bg-white text-[#1a365d]" : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        {/* Basic Information */}
        {activeTab === "Basic Information" && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Core Pin"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug * auto from name</label>
                <input
                  value={slug}
                  onChange={(e) => {
                    setSlug(slugify(e.target.value));
                    setSlugEdited(true);
                  }}
                  placeholder="core-pin"
                  required
                  pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">products/{slug || "slug"}.webp path uses slug. Lowercase, hyphens only.</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.slug})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                placeholder="Core pins used to create holes in diecasting..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Overview</label>
              <textarea
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                rows={4}
                placeholder="Longer, standalone intro paragraph for product page..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>

            {/* Advanced fields collapsed */}
            <details className="rounded-lg border border-gray-200 p-3 bg-gray-50">
              <summary className="cursor-pointer text-sm font-medium text-gray-700">Advanced Material Fields (optional)</summary>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Material</label>
                  <input value={material} onChange={(e) => setMaterial(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="DIN 1.2344 / AISI H-13" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Tolerance</label>
                  <input value={tolerance} onChange={(e) => setTolerance(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="h6 to h8, ≤0.01mm..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Surface Finish</label>
                  <input value={surfaceFinish} onChange={(e) => setSurfaceFinish(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Nitriding + PVD..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Customization</label>
                  <input value={customization} onChange={(e) => setCustomization(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Custom diameters..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Available Sizes</label>
                  <input value={availableSizes} onChange={(e) => setAvailableSizes(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="2mm to 80mm..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Quality Note</label>
                  <input value={qualityNote} onChange={(e) => setQualityNote(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="100% inspection..." />
                </div>
              </div>
            </details>
          </div>
        )}

        {/* Specifications */}
        {activeTab === "Specifications" && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Specs Json key-value editor. Stored as JSON Record&lt;string,string&gt; in Product.specs.</p>
            {specs.map((s, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  placeholder="Key (e.g. Material)"
                  value={s.key}
                  onChange={(e) => updateSpec(idx, "key", e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <input
                  placeholder="Value (e.g. DIN 1.2344 / AISI H-13)"
                  value={s.value}
                  onChange={(e) => updateSpec(idx, "value", e.target.value)}
                  className="flex-[1.5] rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <button type="button" onClick={() => removeSpec(idx)} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50">
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addSpec} className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black">
              + Add spec
            </button>
          </div>
        )}

        {/* Features */}
        {activeTab === "Features" && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Features (string[]) – bullet points displayed on product page.</p>
            {features.map((f, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  value={f}
                  onChange={(e) => updateFeature(idx, e.target.value)}
                  placeholder="Manufactured from certified DIN 1.2344..."
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <button type="button" onClick={() => removeFeature(idx)} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50">
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addFeature} className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black">
              + Add feature
            </button>
          </div>
        )}

        {/* Applications/Industries */}
        {activeTab === "Applications/Industries" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Applications (legacy text field)</label>
              <textarea
                value={applications}
                onChange={(e) => setApplications(e.target.value)}
                rows={2}
                placeholder="Core formations in automotive engine blocks..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Applications List (tags)</label>
              <div className="flex gap-2">
                <input
                  value={appInput}
                  onChange={(e) => setAppInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addAppTag();
                    }
                  }}
                  placeholder="Add application and press Enter"
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <button type="button" onClick={addAppTag} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black">
                  Add
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {applicationsList.map((tag, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-medium text-blue-900">
                    {tag}
                    <button type="button" onClick={() => removeAppTag(idx)} className="ml-1 rounded-full hover:bg-blue-100 px-1">
                      ×
                    </button>
                  </span>
                ))}
                {applicationsList.length === 0 && <span className="text-xs text-gray-400">No applications yet</span>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industries (tags)</label>
              <div className="flex gap-2">
                <input
                  value={industryInput}
                  onChange={(e) => setIndustryInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addIndustryTag();
                    }
                  }}
                  placeholder="Add industry and press Enter (e.g. Automotive)"
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <button type="button" onClick={addIndustryTag} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black">
                  Add
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {industries.map((tag, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-900">
                    {tag}
                    <button type="button" onClick={() => removeIndustryTag(idx)} className="ml-1 rounded-full hover:bg-amber-100 px-1">
                      ×
                    </button>
                  </span>
                ))}
                {industries.length === 0 && <span className="text-xs text-gray-400">No industries yet</span>}
              </div>
            </div>
          </div>
        )}

        {/* Images */}
        {activeTab === "Images" && (
          <div className="space-y-4">
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-900">
              Images use <code>BLOB_READ_WRITE_TOKEN</code> server-only via <code>@vercel/blob put/del</code>. Paths: <code>products/{"{slug}"}/{"{uuid}"}.webp</code>. Validate <code>image/*</code> max 5MB. Reorder via drag, primary checkbox, alt/caption inputs. Uses <code>uploadToBlob(file, path)</code> helper in <code>lib/blob.ts</code>.
            </div>

            {mode === "create" ? (
              <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
                <p className="text-sm font-medium text-gray-700">Save product first to enable image uploads</p>
                <p className="mt-1 text-xs text-gray-500">Images require a product ID. Create the product, then upload images in edit mode.</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images (image/*, max 5MB each)</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-black disabled:opacity-50"
                  />
                  {uploading && <p className="mt-2 text-xs text-blue-600">Uploading to Vercel Blob (products/{slug}/{"{uuid}"}.webp) ...</p>}
                </div>

                <div className="space-y-3">
                  {images.length === 0 ? (
                    <p className="text-sm text-gray-500">No images yet. Upload via Vercel Blob.</p>
                  ) : (
                    images
                      .slice()
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((img, idx) => (
                        <div
                          key={img.id}
                          draggable
                          onDragStart={() => handleImageDragStart(idx)}
                          onDragOver={(e) => handleImageDragOver(e, idx)}
                          onDrop={(e) => handleImageDrop(e, idx)}
                          className="flex gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span
                              title="Drag handle – reorder via dnd"
                              className="inline-flex h-7 w-7 items-center justify-center rounded border border-gray-200 bg-gray-50 text-gray-500 cursor-grab active:cursor-grabbing text-xs"
                            >
                              ⋮⋮
                            </span>
                            <span className="text-[10px] font-mono text-gray-500">#{img.sortOrder}</span>
                          </div>
                          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.blobUrl} alt={img.alt || "product image"} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-1 space-y-2 min-w-0">
                            <div className="flex items-center gap-2">
                              <label className="flex items-center gap-1 text-xs font-medium">
                                <input
                                  type="radio"
                                  name="primary"
                                  checked={img.isPrimary}
                                  onChange={() => handleSetPrimary(img.id)}
                                  className="rounded"
                                />
                                Primary
                              </label>
                              {img.isPrimary && <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-800">PRIMARY</span>}
                              <span className="ml-auto text-[10px] font-mono text-gray-400 truncate max-w-[160px]" title={img.blobUrl}>
                                {img.blobUrl.slice(0, 48)}…
                              </span>
                            </div>
                            <input
                              value={img.alt ?? ""}
                              onChange={(e) => setImages((prev) => prev.map((p) => (p.id === img.id ? { ...p, alt: e.target.value } : p)))}
                              onBlur={() => handleImageMetaBlur({ ...img, alt: (document.activeElement as HTMLInputElement)?.value ?? img.alt })}
                              placeholder="Alt text"
                              className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs"
                            />
                            <input
                              value={img.caption ?? ""}
                              onChange={(e) => setImages((prev) => prev.map((p) => (p.id === img.id ? { ...p, caption: e.target.value } : p)))}
                              onBlur={() => handleImageMetaBlur({ ...img, caption: (document.activeElement as HTMLInputElement)?.value ?? img.caption })}
                              placeholder="Caption"
                              className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <button type="button" onClick={() => handleDeleteImage(img.id)} className="rounded-md bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-red-700">
                              Delete
                            </button>
                            <div className="text-[10px] text-gray-500 text-center">drag to reorder</div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* FAQs */}
        {activeTab === "FAQs" && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">ProductFAQ – question, answer, sortOrder. Ordered by sortOrder.</p>
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-lg border border-gray-200 p-3 bg-gray-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">FAQ #{idx + 1} • sortOrder: {idx}</span>
                  <button type="button" onClick={() => removeFaq(idx)} className="text-xs text-red-600 hover:underline">
                    Remove
                  </button>
                </div>
                <input
                  value={faq.question}
                  onChange={(e) => updateFaq(idx, "question", e.target.value)}
                  placeholder="Question"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <textarea
                  value={faq.answer}
                  onChange={(e) => updateFaq(idx, "answer", e.target.value)}
                  placeholder="Answer"
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            ))}
            <button type="button" onClick={addFaq} className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black">
              + Add FAQ
            </button>
          </div>
        )}

        {/* SEO */}
        {activeTab === "SEO" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title (max 70)</label>
              <input
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                maxLength={70}
                placeholder="Core Pin Manufacturer India | Vyankatesh Engineering"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">{seoTitle.length}/70</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description (max 160-320)</label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                maxLength={320}
                rows={3}
                placeholder="Precision core pins manufactured from DIN 1.2344..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">{seoDescription.length}/320 (recommended 155-160 for SERP)</p>
            </div>
          </div>
        )}

        {/* Publishing */}
        {activeTab === "Publishing" && (
          <div className="space-y-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="rounded" />
              <span className="text-sm font-medium text-gray-700">Is Published</span>
              <span className="text-xs text-gray-500">controls sitemap & product page visibility; revalidates /products/[slug], /categories/[slug], /, /sitemap.xml</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="rounded" />
              <span className="text-sm font-medium text-gray-700">Is Featured</span>
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input
                type="number"
                min={0}
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">Lower appears first. Drag handle in list reorders via <code>reorderProducts</code>.</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#1a365d] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#122a4a] disabled:opacity-50 transition"
        >
          {saving ? "Saving..." : mode === "create" ? "Create Product" : "Save Changes"}
        </button>
        <button type="button" onClick={() => router.push("/admin/products")} className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <span className="ml-auto text-xs text-gray-500">revalidateTag(&apos;products&apos;) + revalidatePath for slug/category/&apos;/&apos;/sitemap.xml after save</span>
      </div>
    </form>
  );
}
