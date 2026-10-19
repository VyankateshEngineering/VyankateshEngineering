import { auth } from "@/lib/auth";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Inquiries | Admin | Vyankatesh Engineering",
  robots: { index: false, follow: false },
};

type Inquiry = {
  id: string;
  name: string;
  email: string;
  company_name: string | null;
  requirement: string;
  message: string;
  status: string;
  created_at: string;
};

async function getInquiries(): Promise<{ inquiries: Inquiry[]; error?: string }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return {
      inquiries: [],
      error: "Supabase credentials are not configured in environment variables.",
    };
  }

  try {
    const res = await fetch(`${url}/rest/v1/inquiries?order=created_at.desc`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errText = await res.text();
      return {
        inquiries: [],
        error: `Supabase query returned status ${res.status}: ${errText}`,
      };
    }

    const data = await res.json();
    return { inquiries: Array.isArray(data) ? data : [] };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { inquiries: [], error: msg };
  }
}

export default async function AdminInquiriesPage() {
  await auth();
  const { inquiries, error } = await getInquiries();

  async function updateStatus(formData: FormData) {
    "use server";
    const id = formData.get("id");
    const status = formData.get("status");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (id && status && url && key) {
      try {
        await fetch(`${url}/rest/v1/inquiries?id=eq.${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: key,
            Authorization: `Bearer ${key}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ status }),
        });
        revalidatePath("/admin/inquiries");
      } catch (err) {
        console.error("Failed to update inquiry status:", err);
      }
    }
  }

  async function deleteInquiry(formData: FormData) {
    "use server";
    const id = formData.get("id");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (id && url && key) {
      try {
        await fetch(`${url}/rest/v1/inquiries?id=eq.${id}`, {
          method: "DELETE",
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
          },
        });
        revalidatePath("/admin/inquiries");
      } catch (err) {
        console.error("Failed to delete inquiry:", err);
      }
    }
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--neutral-900)", fontFamily: "var(--font-display)" }}>
            Customer Inquiries
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Real-time inquiries and RFQ submissions stored securely in Supabase PostgreSQL.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {inquiries.length} Total Inquiries
          </span>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Database Notice</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {inquiries.length === 0 && !error ? (
        <div className="rounded-xl border border-neutral-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-3 text-lg font-bold">
            ✉
          </div>
          <h3 className="text-base font-semibold text-neutral-900">No customer inquiries yet</h3>
          <p className="mt-1 text-sm text-neutral-500 max-w-md mx-auto">
            When prospective clients submit requests through the Contact form on the website, they will appear here and deliver to{" "}
            <strong>sales.vyankateshengg@gmail.com</strong>.
          </p>
          <Link href="/#contact" className="mt-4 inline-flex items-center text-xs font-semibold text-primary-600 hover:underline">
            Test contact form →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200 text-sm">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600">Requirement</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600">Message</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-600">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {inquiries.map((inq) => {
                    const dateFormatted = new Date(inq.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    const isNew = inq.status === "NEW";
                    return (
                      <tr key={inq.id} className={isNew ? "bg-amber-50/30" : "hover:bg-neutral-50/50"}>
                        <td className="px-4 py-3.5 whitespace-nowrap text-xs text-neutral-500 font-mono">
                          {dateFormatted}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-neutral-900">{inq.name}</div>
                          <a href={`mailto:${inq.email}`} className="text-xs text-primary-600 hover:underline block truncate max-w-[180px]">
                            {inq.email}
                          </a>
                          {inq.company_name && (
                            <div className="text-[11px] text-neutral-500 truncate max-w-[180px]">
                              {inq.company_name}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex rounded-full bg-primary-50 border border-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                            {inq.requirement}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 max-w-xs">
                          <p className="text-xs text-neutral-700 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                            {inq.message}
                          </p>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <form action={updateStatus} className="inline-block">
                            <input type="hidden" name="id" value={inq.id} />
                            <select
                              name="status"
                              defaultValue={inq.status || "NEW"}
                              onChange={(e) => e.target.form?.requestSubmit()}
                              className={`text-xs font-semibold rounded-md px-2 py-1 border transition cursor-pointer ${
                                inq.status === "NEW"
                                  ? "bg-amber-100 text-amber-800 border-amber-300"
                                  : inq.status === "CONTACTED"
                                  ? "bg-blue-100 text-blue-800 border-blue-300"
                                  : inq.status === "QUOTED"
                                  ? "bg-purple-100 text-purple-800 border-purple-300"
                                  : "bg-emerald-100 text-emerald-800 border-emerald-300"
                              }`}
                            >
                              <option value="NEW">NEW</option>
                              <option value="CONTACTED">CONTACTED</option>
                              <option value="QUOTED">QUOTED</option>
                              <option value="CLOSED">CLOSED</option>
                            </select>
                          </form>
                        </td>
                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <form action={deleteInquiry} className="inline-block" onSubmit={(e) => {
                            if (!confirm("Delete this inquiry record from Supabase?")) e.preventDefault();
                          }}>
                            <input type="hidden" name="id" value={inq.id} />
                            <button
                              type="submit"
                              className="text-xs font-medium text-red-600 hover:text-red-800 px-2.5 py-1 rounded hover:bg-red-50 transition"
                            >
                              Delete
                            </button>
                          </form>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View (Optimized for touch & small screens) */}
          <div className="lg:hidden space-y-3">
            {inquiries.map((inq) => {
              const dateFormatted = new Date(inq.created_at).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <div key={inq.id} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900">{inq.name}</h3>
                      {inq.company_name && <p className="text-xs text-neutral-500">{inq.company_name}</p>}
                      <a href={`mailto:${inq.email}`} className="text-xs text-primary-600 hover:underline mt-0.5 block">
                        {inq.email}
                      </a>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 shrink-0">{dateFormatted}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex rounded-full bg-primary-50 border border-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                      {inq.requirement}
                    </span>
                  </div>

                  <div className="rounded-lg bg-neutral-50 p-3 border border-neutral-100 text-xs text-neutral-800 whitespace-pre-wrap leading-relaxed">
                    {inq.message}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100 gap-2">
                    <form action={updateStatus} className="flex items-center gap-1.5">
                      <input type="hidden" name="id" value={inq.id} />
                      <label htmlFor={`status-mobile-${inq.id}`} className="text-xs text-neutral-500 font-medium">Status:</label>
                      <select
                        id={`status-mobile-${inq.id}`}
                        name="status"
                        defaultValue={inq.status || "NEW"}
                        onChange={(e) => e.target.form?.requestSubmit()}
                        className="text-xs font-semibold rounded-md px-2 py-1.5 border border-neutral-300 bg-white"
                        style={{ minHeight: "36px" }}
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="QUOTED">QUOTED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </form>

                    <form action={deleteInquiry} onSubmit={(e) => {
                      if (!confirm("Delete this inquiry record?")) e.preventDefault();
                    }}>
                      <input type="hidden" name="id" value={inq.id} />
                      <button
                        type="submit"
                        className="text-xs font-semibold text-red-600 hover:text-red-800 px-3 py-1.5 rounded border border-red-200 bg-red-50 transition"
                        style={{ minHeight: "36px" }}
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
