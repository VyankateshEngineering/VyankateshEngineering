import { serverEnv } from '@/lib/validations/env';

export async function verifyCaptcha(token: string): Promise<boolean> {
  if (!serverEnv.RECAPTCHA_SECRET_KEY || process.env.NODE_ENV !== 'production') {
    return true;
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(serverEnv.RECAPTCHA_SECRET_KEY)}&response=${encodeURIComponent(token)}`,
    });

    if (!response.ok) {
      console.error('[Captcha] Google API returned non-OK status:', response.status);
      return false;
    }

    const data = await response.json();

    if (data.success && data.score >= 0.5) {
      return true;
    }

    console.warn('[Captcha] Verification failed:', {
      success: data.success,
      score: data.score,
      errorCodes: data['error-codes'],
    });
    return false;
  } catch (error) {
    console.error('[Captcha] Verification error:', error);
    return false;
  }
}
