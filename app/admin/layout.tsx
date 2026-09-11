import { auth, signOut } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

const navItems = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/knowledge", label: "Knowledge" },
  { href: "/admin/company", label: "Company" },
  { href: "/admin/settings", label: "Settings" },
] as const;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // x-pathname is injected by middleware.ts for reliable server-side path detection
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || headersList.get("x-invoke-path") || "";

  const isLoginPage = pathname === "/admin/login" || pathname.startsWith("/admin/login");

  // Allow unauthenticated access to login page – it has its own full-page layout
  if (!session?.user) {
    if (isLoginPage) {
      return <>{children}</>;
    }
    // For any other admin route, redirect to login (middleware also handles this)
    redirect("/admin/login");
  }

  // Authenticated user visiting login page → redirect to dashboard
  if (session?.user && isLoginPage) {
    redirect("/admin");
  }

  const userEmail = session.user?.email ?? "Admin";
  const userRole = (session.user as unknown as { role?: string })?.role ?? "admin";

  async function logoutAction() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-gray-200 bg-white">
        <div className="px-6 py-6 border-b border-gray-200">
          <Link href="/admin" className="block">
            <h2 className="text-sm font-bold tracking-tight text-[#1a365d]">Vyankatesh Engineering</h2>
            <p className="text-xs text-gray-500 mt-1">Admin Panel • {userRole}</p>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-900 truncate" title={userEmail}>
              {userEmail}
            </p>
            <p className="text-[11px] text-gray-500 capitalize">{userRole}</p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black transition"
            >
              Logout
            </button>
          </form>
          <Link
            href="/"
            className="mt-2 block text-center text-xs text-gray-500 hover:text-gray-700 underline"
          >
            View site →
          </Link>
        </div>
      </aside>

      {/* Mobile top bar + content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile nav */}
        <header className="md:hidden border-b border-gray-200 bg-white px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link href="/admin" className="text-sm font-bold text-[#1a365d]">
              VE Admin
            </Link>
            <div className="flex items-center gap-2 overflow-x-auto">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="whitespace-nowrap rounded-md bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
                >
                  {item.label}
                </Link>
              ))}
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-gray-500 truncate">{userEmail} • {userRole}</div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
