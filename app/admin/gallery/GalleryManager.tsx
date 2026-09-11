"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  toggleGalleryPublish,
  reorderGalleryImages,
} from "./actions";

type Category = { id: string; name: string; slug: string };
type GalleryImage = {
  id: string;
  blobUrl: string;
  title: string | null;
  alt: string | null;
  caption: string | null;
  category: string | null;
  sortOrder: number;
  isPublished: boolean;
};

export default function GalleryManager({
  initialImages,
  categories,
}: {
  initialImages: GalleryImage[];
  categories: Category[];
}) {
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  // Create form state
  const [title, setTitle] = useState("");
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState(categories[0]?.name ?? "Pins");
  const [sortOrder, setSortOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAlt, setEditAlt] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editSortOrder, setEditSortOrder] = useState(0);
  const [editIsPublished, setEditIsPublished] = useState(true);
  const editFileRef = useRef<HTMLInputElement>(null);

  const categoryOptions = categories.map((c) => c.name);
  // Ensure fallback categories always include required ones
  const requiredCats = ["Pins", "Inserts", "Dies", "Products", "Cores", "Gallery", "Cooling Systems", "Accessories"];
  for (const rc of requiredCats) {
    if (!categoryOptions.includes(rc)) categoryOptions.push(rc);
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("Image file is required (image/*, max 5MB). Blob path gallery/{uuid}.webp");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Only image/* files allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be <= 5MB");
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.set("file", file);
    fd.set("title", title);
    fd.set("alt", alt);
    fd.set("caption", caption);
    fd.set("category", category);
    fd.set("sortOrder", String(sortOrder));
    fd.set("isPublished", String(isPublished));
    try {
      const res = await createGalleryImage(fd);
      if ((res as { success: boolean }).success) {
        const newImg = (res as { image: GalleryImage }).image;
        setImages((prev) => [...prev, newImg].sort((a, b) => a.sortOrder - b.sortOrder));
        setSuccess(`Created image ${newImg.id} at gallery/{uuid}.webp — revalidated gallery tag + /gallery + /sitemap.xml`);
        setTitle("");
        setAlt("");
        setCaption("");
        setSortOrder(0);
        if (fileRef.current) fileRef.current.value = "";
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (img: GalleryImage) => {
    setEditingId(img.id);
    setEditTitle(img.title ?? "");
    setEditAlt(img.alt ?? "");
    setEditCaption(img.caption ?? "");
    setEditCategory(img.category ?? categoryOptions[0] ?? "Pins");
    setEditSortOrder(img.sortOrder);
    setEditIsPublished(img.isPublished);
    setError(null);
    setSuccess(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setError(null);
    setSuccess(null);
    const fd = new FormData();
    fd.set("id", editingId);
    fd.set("title", editTitle);
    fd.set("alt", editAlt);
    fd.set("caption", editCaption);
    fd.set("category", editCategory);
    fd.set("sortOrder", String(editSortOrder));
    fd.set("isPublished", String(editIsPublished));
    const file = editFileRef.current?.files?.[0];
    if (file && file.size > 0) {
      if (!file.type.startsWith("image/")) {
        setError("Replace file must be image/*");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Replace file must be <=5MB");
        return;
      }
      fd.set("file", file);
    }
    try {
      const res = await updateGalleryImage(editingId, fd);
      if ((res as { success: boolean }).success) {
        const updated = (res as { image: GalleryImage }).image;
        setImages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)).sort((a, b) => a.sortOrder - b.sortOrder));
        setSuccess(`Updated ${updated.id} — replace will del old blob and put new gallery/{uuid}.webp if file provided`);
        setEditingId(null);
        if (editFileRef.current) editFileRef.current.value = "";
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this gallery image? Blob will be deleted via Vercel Blob del (server-only).")) return;
    setError(null);
    try {
      const fd = new FormData();
      fd.set("id", id);
      await deleteGalleryImage(fd);
      setImages((prev) => prev.filter((p) => p.id !== id));
      setSuccess(`Deleted ${id} — blob del executed server-only, revalidated gallery tag + /gallery + /sitemap.xml`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    setError(null);
    try {
      const fd = new FormData();
      fd.set("id", id);
      fd.set("isPublished", String(!current));
      const res = await toggleGalleryPublish(fd);
      if ((res as { success: boolean }).success) {
        const newVal = (res as { isPublished: boolean }).isPublished;
        setImages((prev) => prev.map((p) => (p.id === id ? { ...p, isPublished: newVal } : p)));
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Toggle failed");
    }
  };

  const handleDragStart = (idx: number) => setDragIndex(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === idx) return;
  };
  const handleDrop = async (e: React.DragEvent, dropIdx: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIdx) return;
    const newImages = [...images];
    const [moved] = newImages.splice(dragIndex, 1);
    newImages.splice(dropIdx, 0, moved);
    const reordered = newImages.map((im, idx) => ({ ...im, sortOrder: idx }));
    setImages(reordered);
    setDragIndex(null);
    startTransition(async () => {
      try {
        await reorderGalleryImages(reordered.map((im) => im.id));
        setSuccess("Reordered sortOrder via drag — revalidateTag('gallery') + /gallery + /sitemap.xml");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Reorder failed");
      }
    });
  };

  return (
    <div className="space-y-6">
      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">{error}</div>}
      {success && <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">{success}</div>}

      {/* Create form */}
      <form onSubmit={handleCreate} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">Upload New Image — Vercel Blob <code>gallery/{"{uuid}"}.webp</code></h2>
        <p className="text-xs text-gray-500">Fields: blobUrl (auto via uploadToBlob), title, alt, caption, category (select), sortOrder, isPublished. Validates image/* max 5MB server-only via lib/blob.ts. Uses BLOB_READ_WRITE_TOKEN server-only (never exposed client).</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Image File * (image/*, ≤5MB)</label>
            <input ref={fileRef} type="file" accept="image/*" required className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-black" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Category * (select from existing)</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white">
              {categoryOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Big Core Pin" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Sort Order</label>
            <input type="number" min={0} value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Alt text</label>
            <input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Alt for accessibility / SEO" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Caption</label>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption displayed under image" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="rounded" />
          <span className="text-sm font-medium text-gray-700">isPublished</span>
          <span className="text-xs text-gray-500">controls sitemap & /gallery visibility</span>
        </label>
        <button type="submit" disabled={uploading || isPending} className="rounded-lg bg-[#1a365d] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#122a4a] disabled:opacity-50">
          {uploading ? "Uploading to Blob gallery/{uuid}.webp..." : "Upload Image"}
        </button>
      </form>

      {/* List */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 w-8">Drag</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600">Preview</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600">Title / Category</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600">Alt / Caption</th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600">sortOrder</th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600">Published</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {images.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                    No gallery images yet. Upload via Vercel Blob (gallery/{"{uuid}"}.webp).
                  </td>
                </tr>
              ) : (
                images
                  .slice()
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((img, idx) => (
                    <tr key={img.id} draggable onDragStart={() => handleDragStart(idx)} onDragOver={(e) => handleDragOver(e, idx)} onDrop={(e) => handleDrop(e, idx)} className="hover:bg-gray-50/50">
                      <td className="px-2 py-3 align-middle">
                        <span title="Drag to reorder sortOrder" className="inline-flex h-7 w-7 items-center justify-center rounded border border-gray-200 bg-white text-gray-400 cursor-grab active:cursor-grabbing text-xs">
                          ⋮⋮
                        </span>
                      </td>
                      <td className="px-3 py-3 align-middle">
                        <div className="h-14 w-14 overflow-hidden rounded bg-gray-100 border border-gray-200">
                          {/* eslint-disable @next/next/no-img-element */}
                          <img src={img.blobUrl} alt={img.alt || img.title || "gallery"} className="h-full w-full object-cover" />
                        </div>
                        <div className="mt-1 text-[10px] font-mono text-gray-400 truncate max-w-[120px]" title={img.blobUrl}>
                          {img.blobUrl.slice(0, 44)}…
                        </div>
                      </td>
                      <td className="px-3 py-3 align-middle">
                        <div className="font-medium text-gray-900 leading-tight">{img.title || <span className="text-gray-400 italic">No title</span>}</div>
                        <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 mt-1">{img.category || "Uncategorized"}</span>
                        <div className="text-[10px] font-mono text-gray-400 mt-1">{img.id.slice(0, 8)}…</div>
                      </td>
                      <td className="px-3 py-3 align-middle">
                        <div className="text-xs text-gray-700 truncate max-w-[180px]" title={img.alt ?? ""}>alt: {img.alt || <span className="text-gray-400">—</span>}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[180px]" title={img.caption ?? ""}>caption: {img.caption || <span className="text-gray-400">—</span>}</div>
                      </td>
                      <td className="px-3 py-3 align-middle text-center">
                        <span className="inline-flex rounded bg-gray-100 px-2 py-1 text-xs font-mono text-gray-700">{img.sortOrder}</span>
                      </td>
                      <td className="px-3 py-3 align-middle text-center">
                        <button
                          type="button"
                          onClick={() => handleToggle(img.id, img.isPublished)}
                          aria-label={img.isPublished ? "Unpublish" : "Publish"}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${img.isPublished ? "bg-green-600" : "bg-gray-300"}`}
                          title={img.isPublished ? "Published — click to unpublish" : "Draft — click to publish"}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${img.isPublished ? "translate-x-4" : "translate-x-1"}`} />
                        </button>
                      </td>
                      <td className="px-3 py-3 align-middle text-right">
                        <div className="inline-flex items-center gap-1">
                          <button type="button" onClick={() => startEdit(img)} className="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                            Edit
                          </button>
                          <button type="button" onClick={() => handleDelete(img.id)} className="rounded-md bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-red-700">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-600">
          Drag rows via ⋮⋮ handle to reorder <code>sortOrder</code> (calls <code>reorderGalleryImages</code> → <code>revalidateTag(&apos;gallery&apos;)</code> + <code>/gallery</code> + <code>/sitemap.xml</code>). Edit supports upload/replace (put new <code>gallery/{"{uuid}"}.webp</code> + del old) and delete (del blob server-only).
        </div>
      </div>

      {/* Edit drawer */}
      {editingId && (
        <form onSubmit={handleUpdate} className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Edit Image {editingId.slice(0, 8)}…</h3>
            <button type="button" onClick={() => setEditingId(null)} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
          </div>
          <p className="text-xs text-gray-600">Replace file uploads new blob at <code>gallery/{"{uuid}"}.webp</code> via <code>uploadToBlob</code> (put, server-only) and deletes old via <code>del</code>. Leave file empty to keep existing <code>blobUrl</code>.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Replace Image (optional, image/*, ≤5MB)</label>
              <input ref={editFileRef} type="file" accept="image/*" className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-black" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white">
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
              <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Sort Order</label>
              <input type="number" min={0} value={editSortOrder} onChange={(e) => setEditSortOrder(parseInt(e.target.value) || 0)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Alt</label>
              <input value={editAlt} onChange={(e) => setEditAlt(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Caption</label>
              <input value={editCaption} onChange={(e) => setEditCaption(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={editIsPublished} onChange={(e) => setEditIsPublished(e.target.checked)} className="rounded" />
            <span className="text-sm font-medium text-gray-700">isPublished</span>
          </label>
          <div className="flex items-center gap-2">
            <button type="submit" className="rounded-lg bg-[#1a365d] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#122a4a]">
              Save Changes (upload/replace/delete via Blob put/del server-only)
            </button>
            <button type="button" onClick={() => setEditingId(null)} className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Close
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
