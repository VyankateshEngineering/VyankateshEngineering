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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Vyankatesh Engineering
            </h1>
            <p className="mt-2 text-sm font-medium text-gray-600">Admin Login</p>
            <p className="mt-1 text-xs text-gray-500">Sign in to access the dashboard</p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800"
            >
              {error === "CredentialsSignin"
                ? "Invalid email or password. Please try again."
                : error === "AccessDenied"
                  ? "Access denied. Please sign in with an admin account."
                  : `Login failed: ${error}`}
            </div>
          )}

          <form action={authenticate} className="space-y-5">
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@vyankateshengg.com"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#1a365d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#122a4a] focus:outline-none focus:ring-2 focus:ring-[#1a365d]/20 focus:ring-offset-1 transition-colors"
            >
              Sign in
            </button>

            <p className="text-center text-xs text-gray-500">
              Secure session • httpOnly • SameSite=Lax
            </p>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Protected area. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
