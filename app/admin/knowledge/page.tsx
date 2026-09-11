import { prisma } from "@/lib/db";
import Link from "next/link";
import { deleteKnowledgeArticle, toggleKnowledgePublish } from "./actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Knowledge | Admin | Vyankatesh Engineering",
  robots: { index: false, follow: false },
};

type SearchParams = {
  q?: string;
  category?: string;
  published?: string;
  page?: string;
  pageSize?: string;
};

export default async function AdminKnowledgePage({
  searchParams,
}: {
  searchParams: SearchParams | Promise<SearchParams>;
}) {
  const sp = searchParams instanceof Promise ? await searchParams : searchParams;
  const q = (sp?.q ?? "").trim();
  const categoryFilter = (sp?.category ?? "").trim();
  const publishedFilter = (sp?.published ?? "").trim();
  const page = Math.max(1, parseInt(String(sp?.page ?? "1"), 10) || 1);
  const pageSize = Math.min(50, Math.max(5, parseInt(String(sp?.pageSize ?? "10"), 10) || 10));

  const andConditions: Record<string, unknown>[] = [];
  if (q) {
    andConditions.push({
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { slug: { contains: q, mode: "insensitive" } },
        { excerpt: { contains: q, mode: "insensitive" } },
      ],
    });
  }
  if (categoryFilter) andConditions.push({ category: categoryFilter });
  if (publishedFilter === "true" || publishedFilter === "false") andConditions.push({ isPublished: publishedFilter === "true" });

  const whereClause = andConditions.length ? { AND: andConditions } : {};

  let total = 0;
  let articles: Awaited<ReturnType<typeof prisma.knowledgeArticle.findMany>> = [];
  let categoriesRaw: { category: string | null }[] = [];
  let dbError: string | null = null;
  try {
    [total, articles, categoriesRaw] = await Promise.all([
      prisma.knowledgeArticle.count({ where: whereClause }),
      prisma.knowledgeArticle.findMany({
        where: whereClause,
        include: { faqs: { orderBy: { sortOrder: "asc" } } },
        orderBy: [{ updatedAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.knowledgeArticle.findMany({ select: { category: true } }),
    ]);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('does not exist') || msg.includes('DATABASE_URL') || msg.includes('P1001') || msg.includes('P2021')) {
      dbError = 'Database not yet migrated — run supabase.sql in Supabase SQL Editor, then refresh.';
    } else {
      dbError = msg;
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const uniqueCategories = Array.from(new Set(categoriesRaw.map((c) => c.category).filter(Boolean) as string[])).sort();

  const buildQuery = (overrides: Partial<SearchParams>) => {
    const params = new URLSearchParams();
    const merged = { q, category: categoryFilter, published: publishedFilter, page: String(page), pageSize: String(pageSize), ...overrides };
    if (merged.q) params.set("q", merged.q);
    if (merged.category) params.set("category", merged.category);
    if (merged.published) params.set("published", merged.published);
    if (merged.page) params.set("page", merged.page);
    if (merged.pageSize) params.set("pageSize", merged.pageSize);
    const qs = params.toString();
    return qs ? `?${qs}` : "";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Knowledge</h1>
          <p className="mt-1 text-sm text-gray-600">
            AEO Knowledge Articles — slug, title, excerpt, content (MDX/JSON), cover at <code>knowledge/{"{slug}"}.webp</code> via <code>put/del</code> server-only, category, isPublished, seoTitle/seoDesc, faqs, relatedProducts multi-select. Revalidates <code>revalidateTag(&apos;knowledge&apos;)</code> + <code>/knowledge</code> & <code>/knowledge/[slug]</code>.
          </p>
        </div>
        <Link href="/admin/knowledge/new" className="inline-flex items-center justify-center rounded-lg bg-[#1a365d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#122a4a] transition">
          + New Article
        </Link>
      </div>

      {dbError && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">Database not ready</p>
          <p className="mt-1 text-sm text-amber-800">{dbError}</p>
        </div>
      )}

      <form method="GET" className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <label htmlFor="q" className="block text-xs font-medium text-gray-600 mb-1">Search</label>
            <input id="q" name="q" defaultValue={q} placeholder="Search by title, slug, excerpt..." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none" />
          </div>
          <div>
            <label htmlFor="category" className="block text-xs font-medium text-gray-600 mb-1">Category</label>
            <select id="category" name="category" defaultValue={categoryFilter} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white">
              <option value="">All categories</option>
              {uniqueCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="published" className="block text-xs font-medium text-gray-600 mb-1">Published</label>
            <select id="published" name="published" defaultValue={publishedFilter} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white">
              <option value="">All</option>
              <option value="true">Published</option>
              <option value="false">Draft</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button type="submit" className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black">Apply</button>
          <Link href="/admin/knowledge" className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Reset</Link>
          <span className="ml-auto text-xs text-gray-500">{total} article(s) total</span>
        </div>
      </form>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600">Cover</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600">Title / Slug</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600">Category</th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600">Published</th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600">FAQs</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                    No knowledge articles yet. <Link href="/admin/knowledge/new" className="text-[#1a365d] underline font-medium">Create one</Link>
                  </td>
                </tr>
              ) : (
                articles.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50/50">
                    <td className="px-3 py-3 align-middle">
                      <div className="h-10 w-16 overflow-hidden rounded bg-gray-100 border border-gray-200 flex items-center justify-center">
                        {a.coverBlobUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={a.coverBlobUrl} alt={a.title} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-gray-400">No cover</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 align-middle">
                      <div className="font-medium text-gray-900 leading-tight">{a.title}</div>
                      <div className="text-xs text-gray-500 font-mono">{a.slug}</div>
                      {a.excerpt && <div className="text-xs text-gray-500 truncate max-w-[280px] mt-1">{a.excerpt}</div>}
                    </td>
                    <td className="px-3 py-3 align-middle">
                      <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">{a.category || "—"}</span>
                    </td>
                    <td className="px-3 py-3 align-middle text-center">
                      <form action={toggleKnowledgePublish as unknown as (fd: FormData) => Promise<void>} className="inline-flex">
                        <input type="hidden" name="id" value={a.id} />
                        <input type="hidden" name="isPublished" value={a.isPublished ? "false" : "true"} />
                        <button type="submit" aria-label={a.isPublished ? "Unpublish" : "Publish"} className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${a.isPublished ? "bg-green-600" : "bg-gray-300"}`} title={a.isPublished ? "Published — click to unpublish" : "Draft — click to publish"}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${a.isPublished ? "translate-x-4" : "translate-x-1"}`} />
                        </button>
                      </form>
                    </td>
                    <td className="px-3 py-3 align-middle text-center">
                      <span className="inline-flex rounded bg-gray-100 px-2 py-1 text-xs font-mono text-gray-700">{a.faqs.length}</span>
                    </td>
                    <td className="px-3 py-3 align-middle text-right">
                      <div className="inline-flex items-center gap-1">
                        <Link href={`/admin/knowledge/${a.id}`} className="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                          Edit
                        </Link>
                        <form action={deleteKnowledgeArticle as unknown as (fd: FormData) => Promise<void>} className="inline-flex">
                          <input type="hidden" name="id" value={a.id} />
                          <button type="submit" className="rounded-md bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-red-700" title="Delete article — will del cover blob via del server-only">
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200 bg-white px-4 py-3">
          <div className="text-xs text-gray-600">
            Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span> — {total} total
          </div>
          <div className="flex items-center gap-1">
            <Link href={`/admin/knowledge${buildQuery({ page: String(Math.max(1, page - 1)) })}`} aria-disabled={page <= 1} className={`rounded-md border px-3 py-1.5 text-xs font-medium ${page <= 1 ? "pointer-events-none border-gray-200 bg-gray-100 text-gray-400" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`}>
              Previous
            </Link>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pNum: number;
              if (totalPages <= 5) pNum = i + 1;
              else if (page <= 3) pNum = i + 1;
              else if (page >= totalPages - 2) pNum = totalPages - 4 + i;
              else pNum = page - 2 + i;
              const isActive = pNum === page;
              return (
                <Link key={pNum} href={`/admin/knowledge${buildQuery({ page: String(pNum) })}`} className={`rounded-md border px-3 py-1.5 text-xs font-medium ${isActive ? "border-[#1a365d] bg-[#1a365d] text-white" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`}>
                  {pNum}
                </Link>
              );
            })}
            <Link href={`/admin/knowledge${buildQuery({ page: String(Math.min(totalPages, page + 1)) })}`} aria-disabled={page >= totalPages} className={`rounded-md border px-3 py-1.5 text-xs font-medium ${page >= totalPages ? "pointer-events-none border-gray-200 bg-gray-100 text-gray-400" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`}>
              Next
            </Link>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Cover uses <code>knowledge/{"{slug}"}.webp</code> via <code>put</code> (server-only) and <code>del</code> on replace/delete. RelatedProducts multi-select validates via zod + prisma. Faqs stored as <code>KnowledgeFAQ</code> with sortOrder. Revalidates <code>knowledge</code> tag + <code>/knowledge</code> & <code>/knowledge/[slug]</code> & <code>/sitemap.xml</code>.
      </p>
    </div>
  );
}
