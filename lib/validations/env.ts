/**
 * Environment variable validation.
 * Fails safely with descriptive errors if required variables are missing.
 * Secrets are never exposed to the client.
 */

function getServerEnv() {
  const resendApiKey = process.env.RESEND_API_KEY ?? '';
  const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY ?? '';
  const contactEmail = process.env.CONTACT_EMAIL ?? 'sales.vyankateshengg@gmail.com';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vyankatesh.com';

  if (!resendApiKey && process.env.NODE_ENV === 'production') {
    console.warn('[env] RESEND_API_KEY is not set. Contact form emails will not be sent.');
  }

  return {
    RESEND_API_KEY: resendApiKey,
    RECAPTCHA_SECRET_KEY: recaptchaSecretKey,
    CONTACT_EMAIL: contactEmail,
    SITE_URL: siteUrl,
  } as const;
}

/** Server-side environment variables. Only import this in server components or API routes. */
export const serverEnv = getServerEnv();

/** Public environment variables safe to use in client code. */
export const publicEnv = {
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vyankatesh.com',
  RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '',
} as const;
