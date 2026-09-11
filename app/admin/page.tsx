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
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back, <span className="font-medium text-gray-900">{email}</span>. Manage your site content from here.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition"
          >
            <h3 className="text-sm font-semibold text-gray-900">{card.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{card.desc}</p>
            <span className="mt-3 inline-flex text-xs font-medium text-[#1a365d]">Open →</span>
          </Link>
        ))}
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h4 className="text-sm font-semibold text-blue-900">Security</h4>
        <p className="mt-1 text-sm text-blue-800">
          Session is httpOnly, Secure (in production), SameSite=Lax. Credentials are verified via bcryptjs (10 rounds) and Prisma.
        </p>
      </div>
    </div>
  );
}
