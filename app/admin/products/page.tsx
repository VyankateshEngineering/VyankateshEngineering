import { prisma } from "@/lib/db";
import Link from "next/link";
import { deleteProduct, togglePublish, toggleFeatured } from "./actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Products | Admin | Vyankatesh Engineering",
  robots: { index: false, follow: false },
};

type SearchParams = {
  q?: string;
  category?: string;
  published?: string;
  page?: string;
  pageSize?: string;
};

async function getCategories() {
  try {
    return await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  } catch {
    return [];
  }
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: SearchParams | Promise<SearchParams>;
}) {
  const sp = searchParams instanceof Promise ? await searchParams : searchParams;
  const q = (sp?.q ?? "").trim();
  const categoryFilter = (sp?.category ?? "").trim();
  const publishedFilter = (sp?.published ?? "").trim(); // "true" | "false" | ""
  const page = Math.max(1, parseInt(String(sp?.page ?? "1"), 10) || 1);
  const pageSize = Math.min(50, Math.max(5, parseInt(String(sp?.pageSize ?? "10"), 10) || 10));

  const where: Record<string, unknown> = {};

  const andConditions: Record<string, unknown>[] = [];

  if (q) {
    andConditions.push({
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { slug: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    });
  }
  if (categoryFilter) {
    andConditions.push({ categoryId: categoryFilter });
  }
  if (publishedFilter === "true" || publishedFilter === "false") {
    andConditions.push({ isPublished: publishedFilter === "true" });
  }

  const whereClause = andConditions.length ? { AND: andConditions } : {};

  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let total = 0;
  let products: Array<{ id: string; name: string; slug: string; isPublished: boolean; isFeatured: boolean; sortOrder: number; category: { name: string }; images: { blobUrl: string }[] }> = [];
  let dbError: string | null = null;
  try {
    [categories, total, products] = await Promise.all([
      getCategories(),
      prisma.product.count({ where: whereClause }),
      prisma.product.findMany({
        where: whereClause,
        include: {
          category: true,
          images: {
            orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
          },
        },
        orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('does not exist') || msg.includes('DATABASE_URL') || msg.includes('P1001') || msg.includes('P2021')) {
      dbError = 'Database not yet migrated — run supabase.sql in Supabase SQL Editor, then refresh. Public site is using fallback data.';
    } else {
      dbError = msg;
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Helper to build query string preserving filters
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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage products, categories, SEO and publishing. Sorted by <span className="font-medium">sortOrder</span>.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-lg bg-[#1a365d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#122a4a] transition"
        >
          + Add Product
        </Link>
      </div>

      {dbError && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">Database not ready</p>
          <p className="mt-1 text-sm text-amber-800">{dbError}</p>
          <p className="mt-2 text-xs text-amber-700">Run <code>supabase.sql</code> in Supabase → SQL Editor → New query → Run, then refresh this page. Public site uses fallback data so it still works.</p>
        </div>
      )}

      {/* Filters */}
      <form method="GET" className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <label htmlFor="q" className="block text-xs font-medium text-gray-600 mb-1">
              Search
            </label>
            <input
              id="q"
              name="q"
              defaultValue={q}
              placeholder="Search by name, slug, description..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-xs font-medium text-gray-600 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              defaultValue={categoryFilter}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="published" className="block text-xs font-medium text-gray-600 mb-1">
              Published
            </label>
            <select
              id="published"
              name="published"
              defaultValue={publishedFilter}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            >
              <option value="">All</option>
              <option value="true">Published</option>
              <option value="false">Draft</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button type="submit" className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black">
            Apply
          </button>
          <Link href="/admin/products" className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Reset
          </Link>
          <span className="ml-auto text-xs text-gray-500">{total} product(s) total</span>
        </div>
      </form>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 w-8">
                  <span className="sr-only">Drag</span>
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600">Image</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600">Name / Slug</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600">Category</th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600">Published</th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600">Featured</th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600">Order</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-500">
                    No products found.{" "}
                    <Link href="/admin/products/new" className="text-[#1a365d] underline font-medium">
                      Create one
                    </Link>
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const thumb = p.images[0]?.blobUrl || null;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      {/* Drag handle */}
                      <td className="px-2 py-3 align-middle">
                        <span
                          title="Drag to reorder (sortOrder)"
                          className="inline-flex h-7 w-7 items-center justify-center rounded border border-gray-200 bg-white text-gray-400 cursor-grab active:cursor-grabbing"
                          aria-hidden="true"
                        >
                          {/* Grip icon using unicode */}
                          <span className="text-[11px] leading-none">⋮⋮</span>
                        </span>
                      </td>
                      {/* Thumbnail */}
                      <td className="px-3 py-3 align-middle">
                        <div className="h-10 w-10 overflow-hidden rounded bg-gray-100 border border-gray-200 flex items-center justify-center">
                          {thumb ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={thumb} alt={p.name} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-gray-400">No img</span>
                          )}
                        </div>
                      </td>
                      {/* Name / slug */}
                      <td className="px-3 py-3 align-middle">
                        <div className="font-medium text-gray-900 leading-tight">{p.name}</div>
                        <div className="text-xs text-gray-500 font-mono">{p.slug}</div>
                      </td>
                      {/* Category */}
                      <td className="px-3 py-3 align-middle">
                        <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                          {p.category.name}
                        </span>
                      </td>
                      {/* Published toggle */}
                      <td className="px-3 py-3 align-middle text-center">
                        <form action={togglePublish as unknown as (formData: FormData) => Promise<void>} className="inline-flex">
                          <input type="hidden" name="id" value={p.id} />
                          <input type="hidden" name="isPublished" value={p.isPublished ? "false" : "true"} />
                          <button
                            type="submit"
                            aria-label={p.isPublished ? "Unpublish" : "Publish"}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                              p.isPublished ? "bg-green-600" : "bg-gray-300"
                            }`}
                            title={p.isPublished ? "Published — click to unpublish" : "Draft — click to publish"}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                p.isPublished ? "translate-x-4" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </form>
                      </td>
                      {/* Featured toggle */}
                      <td className="px-3 py-3 align-middle text-center">
                        <form action={toggleFeatured as unknown as (formData: FormData) => Promise<void>} className="inline-flex">
                          <input type="hidden" name="id" value={p.id} />
                          <input type="hidden" name="isFeatured" value={p.isFeatured ? "false" : "true"} />
                          <button
                            type="submit"
                            aria-label={p.isFeatured ? "Unfeature" : "Feature"}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                              p.isFeatured ? "bg-amber-500" : "bg-gray-300"
                            }`}
                            title={p.isFeatured ? "Featured — click to unfeature" : "Not featured — click to feature"}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                p.isFeatured ? "translate-x-4" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </form>
                      </td>
                      {/* sortOrder */}
                      <td className="px-3 py-3 align-middle text-center">
                        <span className="inline-flex rounded bg-gray-100 px-2 py-1 text-xs font-mono text-gray-700">{p.sortOrder}</span>
                      </td>
                      {/* Actions */}
                      <td className="px-3 py-3 align-middle text-right">
                        <div className="inline-flex items-center gap-1">
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Edit
                          </Link>
                          <form
                            action={deleteProduct as unknown as (formData: FormData) => Promise<void>}
                            className="inline-flex"
                          >
                            <input type="hidden" name="id" value={p.id} />
                            <button
                              type="submit"
                              className="rounded-md bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                              title="Delete product"
                            >
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200 bg-white px-4 py-3">
          <div className="text-xs text-gray-600">
            Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span> — {total} total
          </div>
          <div className="flex items-center gap-1">
            <Link
              href={`/admin/products${buildQuery({ page: String(Math.max(1, page - 1)) })}`}
              aria-disabled={page <= 1}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
                page <= 1 ? "pointer-events-none border-gray-200 bg-gray-100 text-gray-400" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Previous
            </Link>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // simple window around current page
              let pNum: number;
              if (totalPages <= 5) pNum = i + 1;
              else if (page <= 3) pNum = i + 1;
              else if (page >= totalPages - 2) pNum = totalPages - 4 + i;
              else pNum = page - 2 + i;
              const isActive = pNum === page;
              return (
                <Link
                  key={pNum}
                  href={`/admin/products${buildQuery({ page: String(pNum) })}`}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
                    isActive ? "border-[#1a365d] bg-[#1a365d] text-white" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pNum}
                </Link>
              );
            })}
            <Link
              href={`/admin/products${buildQuery({ page: String(Math.min(totalPages, page + 1)) })}`}
              aria-disabled={page >= totalPages}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
                page >= totalPages ? "pointer-events-none border-gray-200 bg-gray-100 text-gray-400" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
            </Link>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Tip: Published / Featured toggles save immediately via server actions with zod validation and revalidateTag(&apos;products&apos;). SortOrder is managed by drag handle + <code>reorderProducts</code> (sortOrder ascending). Thumbnails use first <code>ProductImage.blobUrl</code> ordered by isPrimary &amp; sortOrder.
      </p>
    </div>
  );
}
