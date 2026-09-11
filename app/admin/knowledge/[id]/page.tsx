import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import KnowledgeForm from "../_components/KnowledgeForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Knowledge Article | Admin | Vyankatesh Engineering",
  robots: { index: false, follow: false },
};

type Props = { params: { id: string } | Promise<{ id: string }> };

function extractRelatedProductIds(content: unknown): string[] {
  if (!content || typeof content !== "object" || Array.isArray(content)) return [];
  const obj = content as Record<string, unknown>;
  const val = obj.relatedProductIds;
  if (Array.isArray(val)) return val.filter((x) => typeof x === "string") as string[];
  return [];
}

export default async function EditKnowledgePage({ params }: Props) {
  const { id } = params instanceof Promise ? await params : params;

  const [article, products] = await Promise.all([
    prisma.knowledgeArticle.findUnique({
      where: { id },
      include: { faqs: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.product.findMany({ select: { id: true, name: true, slug: true }, orderBy: { sortOrder: "asc" }, take: 100 }),
  ]);

  if (!article) notFound();

  const existingCats = await prisma.knowledgeArticle.findMany({ select: { category: true } });
  const catSet = new Set<string>();
  for (const c of existingCats) if (c.category) catSet.add(c.category);
  const fallbackCats = ["General", "Pins", "Inserts", "Dies", "Products", "Cooling Systems", "Manufacturing", "Quality", "AEO"];
  for (const f of fallbackCats) catSet.add(f);
  const categories = Array.from(catSet).sort();

  const relatedProductIds = extractRelatedProductIds(article.content);

  const initialData = {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    coverBlobUrl: article.coverBlobUrl,
    category: article.category,
    isPublished: article.isPublished,
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
    faqs: article.faqs.map((f) => ({ question: f.question, answer: f.answer, sortOrder: f.sortOrder })),
    relatedProductIds,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit Knowledge Article</h1>
        <p className="mt-1 text-sm text-gray-600">
          Editing <span className="font-medium text-gray-900">{article.title}</span> — slug: <span className="font-mono text-xs">{article.slug}</span>. Cover at <code>knowledge/{"{slug}"}.webp</code> via <code>put/del</code> server-only. All saves revalidate with <code>revalidateTag(&apos;knowledge&apos;)</code> + <code>/knowledge</code> & <code>/knowledge/[slug]</code> & <code>/sitemap.xml</code>. RelatedProducts validates via zod + prisma, stored in content Json.
        </p>
      </div>

      <KnowledgeForm initialData={initialData} mode="edit" products={products} categories={categories} />
    </div>
  );
}
