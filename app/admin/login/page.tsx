import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

export const metadata = {
  title: "Admin Login | Vyankatesh Engineering",
  description: "Admin login for Vyankatesh Engineering",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: { error?: string; callbackUrl?: string; message?: string };
}) {
  const session = await auth();
  if (session?.user) {
    redirect(searchParams?.callbackUrl || "/admin");
  }

  const error = searchParams?.error;
  const callbackUrl = searchParams?.callbackUrl || "/admin";

  async function authenticate(formData: FormData) {
    "use server";
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const cb = String(formData.get("callbackUrl") || "/admin");

    if (!email || !password) {
      redirect(`/admin/login?error=CredentialsSignin&callbackUrl=${encodeURIComponent(cb)}`);
    }

    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo: cb,
      });
    } catch (err) {
      // NEXT_REDIRECT is expected on success – rethrow it
      if (err instanceof Error && (err as unknown as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) {
        throw err;
      }
      if (err instanceof AuthError) {
        const type = err.type || "CredentialsSignin";
        redirect(`/admin/login?error=${encodeURIComponent(type)}&callbackUrl=${encodeURIComponent(cb)}`);
      }
      // Fallback for generic errors
      redirect(`/admin/login?error=CredentialsSignin&callbackUrl=${encodeURIComponent(cb)}`);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'var(--neutral-50)' }}>
      <div className="w-full max-w-md">
        <div className="card p-8" style={{ background: 'var(--neutral-0)' }}>
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold mb-3" style={{ background: 'var(--primary-500)' }}>V</div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--neutral-900)', fontFamily: 'var(--font-display)' }}>
              Vyankatesh Engineering
            </h1>
            <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--neutral-700)' }}>Admin Login</p>
            <p className="text-xs" style={{ color: 'var(--neutral-500)' }}>Internal CMS • Same brand as public site</p>
          </div>

          {error && (
            <div role="alert" className="mb-6 rounded-md px-4 py-3 text-sm" style={{ background: '#FFF0F2', border: '1px solid #FFD6DC', color: 'var(--accent-500)' }}>
              {error === "CredentialsSignin"
                ? "Invalid email or password."
                : error === "AccessDenied"
                  ? "Access denied."
                  : `Login failed: ${error}`}
            </div>
          )}

          <form action={authenticate} className="space-y-5">
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email address</label>
              <input id="email" name="email" type="email" autoComplete="email" required placeholder="admin@vyankateshengg.com" className="form-input" />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required placeholder="••••••••" className="form-input" />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Sign in
            </button>
            <p className="text-center caption" style={{ color: 'var(--neutral-500)' }}>Secure • httpOnly • SameSite=Lax</p>
          </form>
        </div>
        <p className="mt-6 text-center caption">Protected area</p>
      </div>
    </div>
  );
}
