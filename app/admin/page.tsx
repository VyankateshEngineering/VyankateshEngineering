import { auth } from "@/lib/auth";
import Link from "next/link";

export const metadata = {
  title: "Admin Dashboard | Vyankatesh Engineering",
  robots: { index: false, follow: false },
};

const cards = [
  { title: "Products", href: "/admin/products", desc: "Manage products, categories, and SEO" },
  { title: "Gallery", href: "/admin/gallery", desc: "Upload and organize gallery images" },
  { title: "Knowledge", href: "/admin/knowledge", desc: "AEO articles and FAQs" },
  { title: "Company", href: "/admin/company", desc: "Profile, contact, and GEO data" },
  { title: "Settings", href: "/admin/settings", desc: "Site settings and metadata" },
];

export default async function AdminDashboardPage() {
  const session = await auth();
  const email = session?.user?.email ?? "Admin";

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--neutral-900)', fontFamily: 'var(--font-display)' }}>Dashboard</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--neutral-600)' }}>
          Welcome back, <span className="font-semibold" style={{ color: 'var(--neutral-900)' }}>{email}</span> — manage your site content.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-xl bg-white p-5 transition hover:shadow-md"
            style={{ border: '1px solid var(--neutral-200)' }}
          >
            <h3 className="text-sm font-semibold" style={{ color: 'var(--neutral-900)' }}>{card.title}</h3>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--neutral-600)' }}>{card.desc}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--primary-600)' }}>Open →</span>
          </Link>
        ))}
      </div>

      <div className="rounded-lg p-3 text-xs" style={{ background: 'var(--neutral-50)', border: '1px solid var(--neutral-200)', color: 'var(--neutral-600)' }}>
        Signed in as <span className="font-medium" style={{ color: 'var(--neutral-900)' }}>{email}</span> • Changes in Products/Gallery/Knowledge appear on the public site via <code>revalidateTag</code> without redeploy.
      </div>
    </div>
  );
}
