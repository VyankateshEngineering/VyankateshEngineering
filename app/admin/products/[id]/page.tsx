import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import ProductForm from "../_components/ProductForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Product | Admin | Vyankatesh Engineering",
  robots: { index: false, follow: false },
};

type Props = { params: { id: string } | Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = params instanceof Promise ? await params : params;

  const [categories, product] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: [{ sortOrder: "asc" }] },
        faqs: { orderBy: { sortOrder: "asc" } },
      },
    }),
  ]);

  if (!product) notFound();

  // Map DB product to InitialData shape expected by ProductForm
  const initialData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    categoryId: product.categoryId,
    description: product.description,
    overview: product.overview,
    specs: (product.specs as Record<string, string> | null) ?? null,
    features: product.features ?? [],
    applications: product.applications,
    applicationsList: product.applicationsList ?? [],
    industries: product.industries ?? [],
    material: product.material,
    tolerance: product.tolerance,
    surfaceFinish: product.surfaceFinish,
    customization: product.customization,
    availableSizes: product.availableSizes,
    qualityNote: product.qualityNote,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    isPublished: product.isPublished,
    isFeatured: product.isFeatured,
    sortOrder: product.sortOrder,
    images: product.images.map((img) => ({
      id: img.id,
      blobUrl: img.blobUrl,
      alt: img.alt,
      caption: img.caption,
      sortOrder: img.sortOrder,
      isPrimary: img.isPrimary,
    })),
    faqs: product.faqs.map((f) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
      sortOrder: f.sortOrder,
    })),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit Product</h1>
        <p className="mt-1 text-sm text-gray-600">
          Editing <span className="font-medium text-gray-900">{product.name}</span> — slug: <span className="font-mono text-xs">{product.slug}</span>. All changes revalidate with <code>revalidateTag(&apos;products&apos;)</code> + paths for <code>/products/[slug]</code>, <code>/categories/[slug]</code>, <code>/</code>, <code>/sitemap.xml</code>. Blob operations use <code>BLOB_READ_WRITE_TOKEN</code> server-only via <code>lib/blob.ts</code>.
        </p>
      </div>

      <ProductForm categories={categories} initialData={initialData} mode="edit" />
    </div>
  );
}
