import { prisma } from "@/lib/db";
import KnowledgeForm from "../_components/KnowledgeForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "New Knowledge Article | Admin | Vyankatesh Engineering",
  robots: { index: false, follow: false },
};

export default async function NewKnowledgePage() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { sortOrder: "asc" },
    take: 100,
  });

  // Derive categories from existing articles + fallback
  const existingCats = await prisma.knowledgeArticle.findMany({ select: { category: true } });
  const catSet = new Set<string>();
  for (const c of existingCats) if (c.category) catSet.add(c.category);
  const fallbackCats = ["General", "Pins", "Inserts", "Dies", "Products", "Cooling Systems", "Manufacturing", "Quality", "AEO"];
  for (const f of fallbackCats) catSet.add(f);
  const categories = Array.from(catSet).sort();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">New Knowledge Article</h1>
        <p className="mt-1 text-sm text-gray-600">
          Create AEO article. Fields: slug (auto from title), title, excerpt, content (MDX/JSON editor, stored as Json), coverBlobUrl (Blob <code>knowledge/{"{slug}"}.webp</code> via <code>put/del</code> from <code>@vercel/blob</code> server-only via <code>lib/blob.ts</code>), category, isPublished, seoTitle/seoDesc (max 70/320), faqs (KnowledgeFAQ with sortOrder), relatedProducts multi-select (validates product IDs, stored in content Json, revalidates via <code>revalidateTag(&apos;knowledge&apos;)</code> + <code>/knowledge</code> & <code>/knowledge/[slug]</code> & <code>/sitemap.xml</code>). BLOB_READ_WRITE_TOKEN never exposed client.
        </p>
      </div>

      <KnowledgeForm mode="create" products={products} categories={categories} />
    </div>
  );
}
