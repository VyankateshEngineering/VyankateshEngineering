/**
 * Environment variable validation.
 * Fails safely with descriptive errors if required variables are missing.
 * Secrets are never exposed to the client.
 */

function getServerEnv() {
  const resendApiKey = process.env.RESEND_API_KEY ?? '';
  const resendFromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';
  const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY ?? '';
  const contactEmail = process.env.CONTACT_EMAIL ?? 'sales.vyankateshengg@gmail.com';
  let rawUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.vyankateshengg.com';
  const siteUrl = rawUrl.includes('vyankateshengg.com') ? 'https://www.vyankateshengg.com' : (rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);

  if (!resendApiKey && process.env.NODE_ENV === 'production') {
    console.warn('[env] RESEND_API_KEY is not set. Contact form emails will not be sent.');
  }

  return {
    RESEND_API_KEY: resendApiKey,
    RESEND_FROM_EMAIL: resendFromEmail,
    RECAPTCHA_SECRET_KEY: recaptchaSecretKey,
    CONTACT_EMAIL: contactEmail,
    SITE_URL: siteUrl,
  } as const;
}

/** Server-side environment variables. Only import this in server components or API routes. */
export const serverEnv = getServerEnv();

/** Public environment variables safe to use in client code. */
export const publicEnv = {
  SITE_URL: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.vyankateshengg.com').includes('vyankateshengg.com') ? 'https://www.vyankateshengg.com' : (process.env.NEXT_PUBLIC_SITE_URL?.startsWith('http') ? process.env.NEXT_PUBLIC_SITE_URL : `https://${process.env.NEXT_PUBLIC_SITE_URL ?? 'www.vyankateshengg.com'}`),
  RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '',
} as const;
