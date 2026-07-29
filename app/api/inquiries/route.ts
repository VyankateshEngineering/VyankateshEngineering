import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { serverEnv } from '@/lib/validations/env';
import { settings } from '@/data/settings';
import { verifyCaptcha } from '@/lib/security/captcha';
import { sanitizeInput } from '@/lib/security/sanitize';
import { rateLimit } from '@/lib/security/rateLimiter';

/* ── Constants ── */

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/zip',
  'application/x-zip-compressed',
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const DEDUP_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

/* ── Zod schema (module-scope, created once) ── */

const inquirySchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(254, 'Email is too long'),
  companyName: z.string().max(200, 'Company name is too long').optional(),
  requirement: z
    .string()
    .min(2, 'Please select a product requirement')
    .max(200, 'Requirement text is too long'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message is too long'),
  captchaToken: z.string().min(1, 'Captcha verification is required'),
});

/* ── Deduplication cache ── */

const dedupCache = new Map<string, number>();

function cleanupDedupCache(): void {
  const now = Date.now();
  if (dedupCache.size > 500) {
    dedupCache.clear();
    return;
  }
  for (const [key, timestamp] of dedupCache) {
    if (now - timestamp > DEDUP_WINDOW_MS) {
      dedupCache.delete(key);
    }
  }
}

/* ── Helpers ── */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^\w\s.\-()]/gi, '_').slice(0, 200);
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

/* ── Route handler ── */

export async function POST(req: Request) {
  try {
    // 1. Rate limiting (defense in depth — middleware also limits)
    const forwarded = req.headers.get('x-forwarded-for') ?? '';
    const ip = forwarded.split(',')[0]?.trim() || 'unknown';

    if (process.env.NODE_ENV === 'production') {
      const allowed = rateLimit(ip, 10, 15 * 60 * 1000); // Allow 10 requests per 15 minutes to avoid blocking shared IPs
      if (!allowed) {
        return jsonError('Too many requests. Please try again after 15 minutes.', 429);
      }
    }

    // 2. Parse form data
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return jsonError('Invalid form data.', 400);
    }

    // 3. Extract and trim values
    const rawName = String(formData.get('name') ?? '').trim();
    const rawEmail = String(formData.get('email') ?? '').trim().toLowerCase();
    const rawCompanyName = String(formData.get('companyName') ?? '').trim();
    const rawRequirement = String(formData.get('requirement') ?? '').trim();
    const rawMessage = String(formData.get('message') ?? '').trim();
    const rawCaptchaToken = String(formData.get('captchaToken') ?? '').trim();

    // 5. Validate with Zod
    const parsed = inquirySchema.safeParse({
      name: rawName,
      email: rawEmail,
      companyName: rawCompanyName || undefined,
      requirement: rawRequirement,
      message: rawMessage,
      captchaToken: rawCaptchaToken,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (field && !fieldErrors[String(field)]) {
          fieldErrors[String(field)] = issue.message;
        }
      }
      return NextResponse.json(
        { error: 'Please fix the following errors.', details: fieldErrors },
        { status: 400 },
      );
    }

    // 6. CAPTCHA verification
    const isHuman = await verifyCaptcha(rawCaptchaToken);
    if (!isHuman) {
      return jsonError('CAPTCHA verification failed. Please try again.', 403);
    }

    // 7. Sanitize all inputs
    const cleanName = sanitizeInput(rawName);
    const cleanEmail = sanitizeInput(rawEmail);
    const cleanCompanyName = rawCompanyName ? sanitizeInput(rawCompanyName) : '';
    const cleanRequirement = sanitizeInput(rawRequirement);
    const cleanMessage = sanitizeInput(rawMessage);

    // 8. Deduplication check
    const dedupKey = `${cleanEmail}|${cleanRequirement}|${cleanMessage.slice(0, 50)}`;
    const lastSent = dedupCache.get(dedupKey);
    if (lastSent && Date.now() - lastSent < DEDUP_WINDOW_MS) {
      // Silently accept to prevent user confusion
      return NextResponse.json(
        { success: true, message: 'Inquiry processed successfully' },
        { status: 201 },
      );
    }

    // 9. Process file attachment
    const file = formData.get('file') as File | null;
    const attachments: Array<{ filename: string; content: Buffer }> = [];

    if (file && file.size > 0) {
      if (file.size > MAX_FILE_SIZE) {
        return jsonError('File size exceeds the 5 MB limit.', 400);
      }
      if (!ALLOWED_MIME_TYPES.has(file.type)) {
        return jsonError(
          'Unsupported file type. Only PDF, JPG, PNG, WEBP, and ZIP are allowed.',
          400,
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      attachments.push({
        filename: sanitizeFilename(file.name),
        content: buffer,
      });
    }

    // 10. Build email content with escaped HTML
    const emailHtml = `
      <h3>New Customer Inquiry</h3>
      <p><strong>Name:</strong> ${escapeHtml(cleanName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(cleanEmail)}</p>
      <p><strong>Company:</strong> ${escapeHtml(cleanCompanyName || 'N/A')}</p>
      <p><strong>Product Requirement:</strong> ${escapeHtml(cleanRequirement)}</p>
      <br/>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 8px;">${escapeHtml(cleanMessage)}</p>
    `.trim();

    // 11. Send email
    if (serverEnv.RESEND_API_KEY) {
      const resend = new Resend(serverEnv.RESEND_API_KEY);

      const { error: sendError } = await resend.emails.send({
        from: `${settings.companyName} Inquiries <${serverEnv.RESEND_FROM_EMAIL}>`,
        to: serverEnv.CONTACT_EMAIL,
        replyTo: cleanEmail,
        subject: `[Inquiry] ${cleanRequirement} from ${cleanName}`,
        html: emailHtml,
        attachments,
      });

      if (sendError) {
        console.error('[Inquiries] Resend API error:', sendError);
        return jsonError('Failed to send your inquiry. Please try again later.', 502);
      }
    } else {
      console.warn('[Inquiries] RESEND_API_KEY not configured. Email not sent.');
      console.log('[Inquiries] Would send to:', serverEnv.CONTACT_EMAIL);
      console.log('[Inquiries] Subject:', `[Inquiry] ${cleanRequirement} from ${cleanName}`);
    }

    // 12. Update deduplication cache
    dedupCache.set(dedupKey, Date.now());
    cleanupDedupCache();

    return NextResponse.json(
      { success: true, message: 'Inquiry submitted successfully' },
      { status: 201 },
    );
  } catch (error) {
    console.error('[Inquiries] Unhandled error:', error);
    return jsonError('An unexpected error occurred. Please try again later.', 500);
  }
}
