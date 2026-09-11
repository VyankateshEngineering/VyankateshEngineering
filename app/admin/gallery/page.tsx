import { prisma } from "@/lib/db";
import { revalidateTag, revalidatePath } from "next/cache";
import GalleryManager from "./GalleryManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gallery | Admin | Vyankatesh Engineering",
  robots: { index: false, follow: false },
};

async function getCategories() {
  const cats = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  // Fallback to gallery-derived categories if DB empty
  if (cats.length === 0) {
    const fallback = ["Pins", "Inserts", "Dies", "Products", "Cores", "Gallery", "Cooling Systems", "Accessories"];
    return fallback.map((name, idx) => ({ id: name, name, slug: name.toLowerCase().replace(/\s+/g, "-") }));
  }
  return cats;
}

export default async function AdminGalleryPage() {
  const [images, categories] = await Promise.all([
    prisma.galleryImage.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Gallery</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage gallery images stored in Vercel Blob at <code>gallery/{"{uuid}"}.webp</code>. Use Blob via <code>lib/blob.ts</code> server-only. Drag to reorder <span className="font-medium">sortOrder</span>, toggle <span className="font-medium">isPublished</span> immediately. Revalidates <code>revalidateTag(&apos;gallery&apos;)</code> + <code>/gallery</code> & <code>/sitemap.xml</code>.
          </p>
        </div>
        <div className="text-xs text-gray-500">
          {images.length} image(s) • Categories: {categories.map((c) => c.name).join(", ")}
        </div>
      </div>

      <GalleryManager initialImages={images} categories={categories} />
    </div>
  );
}
