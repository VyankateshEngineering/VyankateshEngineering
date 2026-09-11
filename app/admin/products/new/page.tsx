import { prisma } from "@/lib/db";
import ProductForm from "../_components/ProductForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "New Product | Admin | Vyankatesh Engineering",
  robots: { index: false, follow: false },
};

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  if (categories.length === 0) {
    // Create fallback categories from data/products if DB empty – still allow form but warn
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">New Product</h1>
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          No categories found. Please create categories first (Category table). You can still create a product after adding one.
        </div>
        <div className="text-sm text-gray-600">Categories count: {categories.length}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">New Product</h1>
        <p className="mt-1 text-sm text-gray-600">
          Create a new product. Tabs: Basic Information (name, slug auto from name, category select from Category table, description, overview), Specifications (specs Json key-value), Features (string[]), Applications/Industries (tags), Images (Vercel Blob put/del, reorder via dnd, primary, alt/caption, uses BLOB_READ_WRITE_TOKEN server-only, paths products/{"{slug}"}/{"{uuid}"}.webp, validate image/* max 5MB), FAQs (ProductFAQ), SEO (seoTitle, seoDescription), Publishing (isPublished, isFeatured, sortOrder). All blob ops server-only via lib/blob.ts helper.
        </p>
      </div>

      <ProductForm categories={categories} mode="create" />
    </div>
  );
}
