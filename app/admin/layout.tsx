import { auth, signOut } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

const navItems = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/knowledge", label: "Knowledge" },
  { href: "/admin/company-profile", label: "Company" },
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

  // Allow unauthenticated access to login page – it has its own full-page layout (uses public Header/Footer hidden via CSS below)
  if (!session?.user) {
    if (isLoginPage) {
      return (
        <>
          <style dangerouslySetInnerHTML={{ __html: `header[role="banner"], footer[role="contentinfo"]{display:none !important} #main-content{padding:0 !important}` }} />
          {children}
        </>
      );
    }
    redirect("/admin/login");
  }

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
    <>
      {/* Hide public Header/Footer on /admin — uses same CSS variables as public site, no new palette */}
      <style dangerouslySetInnerHTML={{ __html: `header[role="banner"], footer[role="contentinfo"]{display:none !important} #main-content{padding:0 !important; max-width:none !important} body{background:var(--neutral-50)}` }} />
      <div className="min-h-screen flex" style={{ background: 'var(--neutral-50)', fontFamily: 'var(--font-body)' }}>
        {/* Sidebar — reuses public branding (logo, Outfit/Inter, primary orange, neutral-900 navy) */}
        <aside className="hidden md:flex w-[280px] flex-col border-r bg-white shrink-0" style={{ borderColor: 'var(--neutral-200)' }}>
          <div className="px-6 py-5 border-b flex items-center gap-3" style={{ borderColor: 'var(--neutral-100)' }}>
            <Image src="/logo.png" alt="Vyankatesh Engineering" width={36} height={36} style={{ objectFit: 'contain' }} />
            <div>
              <div className="text-sm font-bold tracking-tight" style={{ color: 'var(--neutral-900)', fontFamily: 'var(--font-display)' }}>Vyankatesh</div>
              <div className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: 'var(--neutral-500)' }}>Engineering • Admin</div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto" aria-label="Admin">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition"
                  style={{
                    background: isActive ? 'var(--primary-50)' : 'transparent',
                    color: isActive ? 'var(--primary-700)' : 'var(--neutral-700)',
                    borderLeft: isActive ? '3px solid var(--primary-500)' : '3px solid transparent',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: isActive ? 'var(--primary-500)' : 'var(--neutral-300)' }} aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t p-4 space-y-3" style={{ borderColor: 'var(--neutral-100)' }}>
            <div className="rounded-md px-3 py-2.5" style={{ background: 'var(--neutral-50)', border: '1px solid var(--neutral-100)' }}>
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--neutral-900)' }} title={userEmail}>{userEmail}</p>
              <p className="text-[11px] capitalize" style={{ color: 'var(--neutral-500)' }}>{userRole}</p>
            </div>
            <form action={logoutAction}>
              <button type="submit" className="btn btn-primary w-full">
                Logout
              </button>
            </form>
            <Link href="/" className="block text-center text-xs font-medium hover:underline" style={{ color: 'var(--neutral-500)' }}>← View public site</Link>
          </div>
        </aside>

        {/* Main */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Mobile top bar — reuses public .btn */}
          <header className="md:hidden sticky top-0 z-20 border-b bg-white px-3 py-2.5 flex items-center justify-between gap-2" style={{ borderColor: 'var(--neutral-200)' }}>
            <Link href="/admin" className="flex items-center gap-2">
              <Image src="/logo.png" alt="VE" width={28} height={28} style={{ objectFit: 'contain' }} />
              <span className="text-sm font-bold" style={{ color: 'var(--neutral-900)', fontFamily: 'var(--font-display)' }}>VE Admin</span>
            </Link>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                return (
                  <Link key={item.href} href={item.href} className={`btn ${isActive ? 'btn-primary' : 'btn-ghost'} btn-sm`}>{item.label}</Link>
                );
              })}
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="container max-w-[1400px]">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}
