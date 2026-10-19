import { auth } from "@/lib/auth";
import { settings } from "@/data/settings";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Settings | Admin | Vyankatesh Engineering",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  const session = await auth();
  const email = session?.user?.email ?? "Admin";

  const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasSupabaseKey = !!(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const hasResend = !!process.env.RESEND_API_KEY;
  const hasRecaptcha = !!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const contactEmail = process.env.CONTACT_EMAIL || settings.contactEmail;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--neutral-900)", fontFamily: "var(--font-display)" }}>
          Settings & Diagnostics
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Environment configuration, integrations, security settings, and system health.
        </p>
      </div>

      {/* Integration Status Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Supabase */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-neutral-900">Supabase Backend</span>
            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
              hasSupabaseUrl && hasSupabaseKey ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
            }`}>
              {hasSupabaseUrl && hasSupabaseKey ? "Connected" : "Not Configured"}
            </span>
          </div>
          <p className="text-xs text-neutral-500 font-mono break-all">
            {process.env.NEXT_PUBLIC_SUPABASE_URL || "None"}
          </p>
          <p className="text-xs text-neutral-600">
            Stores customer inquiries, products, gallery items, and knowledgebase records.
          </p>
        </div>

        {/* Email Delivery */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-neutral-900">Email Delivery</span>
            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
              hasResend ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
            }`}>
              {hasResend ? "Active (Resend)" : "Dev Sandbox"}
            </span>
          </div>
          <p className="text-xs text-neutral-500 font-mono break-all">
            To: {contactEmail}
          </p>
          <p className="text-xs text-neutral-600">
            Inquiries submitted via website contact form are routed to this address.
          </p>
        </div>

        {/* reCAPTCHA */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-neutral-900">reCAPTCHA v3</span>
            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
              hasRecaptcha ? "bg-emerald-100 text-emerald-800" : "bg-neutral-100 text-neutral-700"
            }`}>
              {hasRecaptcha ? "Protected" : "Bypass (Dev)"}
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            Invisible Google bot protection on quote requests.
          </p>
          <p className="text-xs text-neutral-600">
            Filters automated spam before database insertion.
          </p>
        </div>
      </div>

      {/* Security & Authentication Info */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-neutral-900" style={{ fontFamily: "var(--font-display)" }}>
          Security & Admin Access
        </h2>
        <div className="space-y-3 text-sm text-neutral-700">
          <p>
            You are logged in as <span className="font-semibold text-neutral-900">{email}</span>.
          </p>
          <div className="rounded-lg bg-neutral-50 p-4 border border-neutral-200 space-y-2 text-xs">
            <p className="font-semibold text-neutral-900">How to update your admin credentials:</p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li>
                <strong>Vercel / Production:</strong> Go to your Vercel Project &rarr; <strong>Settings &rarr; Environment Variables</strong>, update <code>ADMIN_PASSWORD</code> with your new secure password, and redeploy.
              </li>
              <li>
                <strong>Local Development:</strong> Update <code>ADMIN_PASSWORD</code> in your <code>.env.local</code> file and restart the dev server.
              </li>
              <li>
                <strong>Session Security:</strong> Admin sessions are signed using cryptographically secure <code>httpOnly</code> cookies with <code>SameSite=Lax</code> and <code>Secure</code> flags.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Company Contact Information from settings.ts */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-neutral-900" style={{ fontFamily: "var(--font-display)" }}>
          Site Metadata & Contact Configuration
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 text-xs">
          <div>
            <span className="font-semibold text-neutral-500 block mb-1">Company Name</span>
            <span className="font-medium text-neutral-900 text-sm">{settings.companyName}</span>
          </div>
          <div>
            <span className="font-semibold text-neutral-500 block mb-1">Primary Email</span>
            <span className="font-medium text-neutral-900 text-sm font-mono">{settings.contactEmail}</span>
          </div>
          <div className="sm:col-span-2">
            <span className="font-semibold text-neutral-500 block mb-1">Physical Address</span>
            <span className="font-medium text-neutral-900 whitespace-pre-line text-sm">{settings.address}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
