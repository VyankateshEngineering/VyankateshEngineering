import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

/**
 * In-memory rate limiting store.
 * Note: In serverless/edge environments, this works per-isolate.
 * For distributed rate limiting, use Upstash Redis.
 */
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodically clean up expired entries to prevent memory leaks
const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanupStore(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, record] of rateLimitStore) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

function checkRateLimit(
  ip: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number } {
  cleanupStore();
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count };
}

export default auth((req: NextRequest & { auth: unknown }) => {
  const path = req.nextUrl.pathname;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // ── Protect /admin/* (server-side, redirect to /admin/login if unauthenticated) ──
  const isAdmin = path.startsWith("/admin");
  const isLogin = path === "/admin/login";
  const isAuthApi = path.startsWith("/api/auth");

  // req.auth is populated by NextAuth when session is valid (JWT)
  const isAuthenticated = !!(req as unknown as { auth?: { user?: unknown } }).auth?.user;

  if (isAdmin && !isLogin && !isAuthApi && !isAuthenticated) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    // Preserve original destination for post-login redirect
    loginUrl.searchParams.set("callbackUrl", path + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // Rate limit API routes (preserve original behavior)
  if (path.startsWith("/api/")) {
    // Stricter limit for inquiry submissions
    const isInquiry = path === "/api/inquiries";
    const limit = isInquiry ? 5 : 60;
    const windowMs = isInquiry ? 60_000 : 60_000;

    const { allowed, remaining } = checkRateLimit(
      `${ip}:${path}`,
      limit,
      windowMs
    );

    if (!allowed) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "60",
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Remaining", String(remaining));
    // Inject pathname header for admin layout (also for API if needed)
    response.headers.set("x-pathname", path);
    return response;
  }

  // Inject x-pathname header for admin layout auth check (preserves public routes)
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", path);
  requestHeaders.set("x-url", req.nextUrl.href);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder assets
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
