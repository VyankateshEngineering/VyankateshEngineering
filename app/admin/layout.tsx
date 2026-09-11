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
    <div className="min-h-screen flex" style={{ background: 'var(--neutral-50)' }}>
      {/* Sidebar — same industrial theme as public site */}
      <aside className="hidden md:flex w-[280px] flex-col border-r bg-white" style={{ borderColor: 'var(--neutral-200)', boxShadow: '2px 0 8px rgba(11,15,25,0.04)' }}>
        <div className="px-6 py-6 border-b" style={{ borderColor: 'var(--neutral-200)', background: 'var(--neutral-0)' }}>
          <Link href="/admin" className="block">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: 'var(--primary-500)' }}>V</div>
              <div>
                <h2 className="text-[13px] font-bold tracking-tight leading-none" style={{ color: 'var(--neutral-900)' }}>Vyankatesh Engineering</h2>
                <p className="text-[11px] mt-1 tracking-wide uppercase" style={{ color: 'var(--neutral-500)' }}>Admin Panel • {userRole}</p>
              </div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition"
                style={{
                  background: isActive ? 'var(--primary-50)' : 'transparent',
                  color: isActive ? 'var(--primary-700)' : 'var(--neutral-700)',
                  borderLeft: isActive ? '3px solid var(--primary-500)' : '3px solid transparent',
                }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: isActive ? 'var(--primary-500)' : 'var(--neutral-300)' }} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-4 space-y-3" style={{ borderColor: 'var(--neutral-100)', background: 'var(--neutral-0)' }}>
          <div className="rounded-lg px-3 py-3" style={{ background: 'var(--neutral-50)', border: '1px solid var(--neutral-100)' }}>
            <p className="text-xs font-semibold truncate" style={{ color: 'var(--neutral-900)' }} title={userEmail}>
              {userEmail}
            </p>
            <p className="text-[11px] capitalize" style={{ color: 'var(--neutral-500)' }}>{userRole} • 20+ Years Exp.</p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full rounded-lg px-3 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: 'var(--neutral-900)' }}
            >
              Logout
            </button>
          </form>
          <Link
            href="/"
            className="block text-center text-xs font-medium hover:underline"
            style={{ color: 'var(--neutral-500)' }}
          >
            ← View public site
          </Link>
        </div>
      </aside>

      {/* Content area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile top bar — same theme */}
        <header className="md:hidden sticky top-0 z-20 border-b bg-white px-3 py-3" style={{ borderColor: 'var(--neutral-200)' }}>
          <div className="flex items-center justify-between gap-2">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold" style={{ background: 'var(--primary-500)' }}>V</span>
              <span className="text-sm font-bold" style={{ color: 'var(--neutral-900)' }}>VE Admin</span>
            </Link>
            <span className="text-[11px] px-2 py-1 rounded-full text-white" style={{ background: 'var(--neutral-900)' }}>{userRole}</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition shrink-0"
                  style={{
                    background: isActive ? 'var(--primary-500)' : 'var(--neutral-50)',
                    color: isActive ? 'white' : 'var(--neutral-700)',
                    border: `1px solid ${isActive ? 'var(--primary-600)' : 'var(--neutral-200)'}`,
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
            <form action={logoutAction} className="shrink-0">
              <button type="submit" className="rounded-full px-3 py-1.5 text-xs font-semibold text-white" style={{ background: 'var(--neutral-900)' }}>
                Logout
              </button>
            </form>
          </div>
          <div className="mt-2 text-[11px] truncate" style={{ color: 'var(--neutral-500)' }}>{userEmail}</div>
        </header>

        {/* Breadcrumb bar for admin */}
        <div className="border-b bg-white px-4 md:px-6 lg:px-8 py-3 hidden md:block" style={{ borderColor: 'var(--neutral-100)' }}>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--neutral-500)' }}>
            <Link href="/admin" className="hover:underline" style={{ color: 'var(--neutral-500)' }}>Admin</Link>
            <span>/</span>
            <span className="font-semibold" style={{ color: 'var(--neutral-900)' }}>{navItems.find(n => pathname === n.href)?.label || pathname.split('/').pop() || 'Dashboard'}</span>
          </div>
        </div>

        {/* Main content — card style like public site */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-[1400px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
