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
    <div className="space-y-6">
      <div className="rounded-xl p-6 text-white" style={{ background: 'linear-gradient(135deg, var(--neutral-900) 0%, #1a2332 100%)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Dashboard</h1>
        <p className="mt-1.5 text-sm text-white/80">
          Welcome back, <span className="font-semibold text-white">{email}</span> — manage products, gallery, knowledge and company profile.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 border border-white/10">● Admin • {email}</span>
          <span className="inline-flex rounded-full px-3 py-1 text-xs font-medium" style={{ background: 'var(--primary-500)', color: 'white' }}>Live • vyankateshengg.com</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-xl bg-white p-5 transition hover:shadow-md"
            style={{ border: '1px solid var(--neutral-200)', boxShadow: '0 1px 3px rgba(11,15,25,0.06)' }}
          >
            <h3 className="text-sm font-semibold" style={{ color: 'var(--neutral-900)' }}>{card.title}</h3>
            <p className="mt-1 text-sm" style={{ color: 'var(--neutral-600)' }}>{card.desc}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold group-hover:gap-1.5 transition-all" style={{ color: 'var(--primary-600)' }}>Open →</span>
          </Link>
        ))}
      </div>

      <div className="rounded-xl p-4 flex gap-3" style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-100)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold" style={{ background: 'var(--primary-500)' }}>✓</div>
        <div>
          <h4 className="text-sm font-semibold" style={{ color: 'var(--neutral-900)' }}>Secure &amp; Fast</h4>
          <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--neutral-700)' }}>
            Sessions are <code>httpOnly</code>, <code>Secure</code> (prod), <code>SameSite=Lax</code>. Credentials via <code>bcryptjs</code> (10 rounds) + Prisma. Public site uses <code>revalidateTag</code> — image changes appear without redeploy.
          </p>
        </div>
      </div>
    </div>
  );
}
