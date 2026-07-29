'use client';

import { useState, useEffect } from 'react';
import { Send, MapPin, Mail, Paperclip, Loader2, CheckCircle2 } from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';
import ScrollReveal from '@/components/common/ScrollReveal';
import { Button } from '@/components/ui/Button';
import { settings } from '@/data/settings';
import styles from './ContactSection.module.css';

export default function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [formFocused, setFormFocused] = useState(false);
  
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // Dynamically load Google reCAPTCHA v3 script only when form is interacted with
  useEffect(() => {
    if (!siteKey || !formFocused) return;

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      const scriptTag = document.querySelector(`script[src*="recaptcha/api.js"]`);
      if (scriptTag && scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag);
      }
      const badge = document.querySelector('.grecaptcha-badge');
      if (badge && badge.parentNode) {
        badge.parentNode.removeChild(badge);
      }
    };
  }, [siteKey, formFocused]);

  const getCaptchaToken = (): Promise<string> => {
    return new Promise((resolve) => {
      if (!siteKey || !(window as any).grecaptcha) {
        resolve('dev-bypass');
        return;
      }

      (window as any).grecaptcha.ready(() => {
        (window as any).grecaptcha
          .execute(siteKey, { action: 'submit_inquiry' })
          .then((token: string) => {
            resolve(token);
          })
          .catch((err: any) => {
            console.error('reCAPTCHA execution error:', err);
            resolve('dev-bypass');
          });
      });
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    try {
      // Fetch CAPTCHA token and attach it
      const token = await getCaptchaToken();
      formData.append('captchaToken', token);

      const res = await fetch('/api/inquiries', {
        method: 'POST',
        body: formData, // Browser sets the correct multipart boundary automatically
      });

      if (res.ok) {
        setSuccess(true);
        formElement.reset();
        setFileName(null);
      } else {
        const data = await res.json();
        if (data.details) {
          // Extract specific Zod error messages
          const errorMessages = Object.entries(data.details)
            .filter(([key]) => key !== '_errors')
            .map(([key, value]: [string, any]) => {
              const messages = value._errors.join(', ');
              return `${key}: ${messages}`;
            })
            .join(' | ');
          setErrorMsg(errorMessages || 'Invalid input data');
        } else {
          setErrorMsg(data.error || 'Failed to submit inquiry.');
        }
      }
    } catch (error) {
      console.error('Submission Error', error);
      setErrorMsg('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Pull settings from static data store
  const { address, contactEmail: email, mapEmbedUrl: mapUrl } = settings;

  return (
    <section className={`section ${styles.section}`} id="contact">
      <div className="container">
        <ScrollReveal>
          <SectionTitle
            label="Get in Touch"
            title="Request a Quote or Consultation"
            subtitle="Our engineering team is ready to assist with your precision tooling and manufacturing requirements."
            align="center"
          />
        </ScrollReveal>

        <div className={styles.grid}>
          {/* ── Contact Info & Map ── */}
          <ScrollReveal delay={0.2} direction="right" className={styles.infoCol}>
            <div className={styles.infoCards}>
              <div className={styles.infoCard}>
                <div className={styles.iconWrap}><Mail size={24} /></div>
                <div>
                  <h4 className={styles.infoTitle}>Email Address</h4>
                  <p className={styles.infoDesc}><a href={`mailto:${email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{email}</a></p>
                </div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.iconWrap}><MapPin size={24} /></div>
                <div>
                  <h4 className={styles.infoTitle}>Address</h4>
                  <p className={styles.infoDesc} style={{ whiteSpace: 'pre-line' }}>{address}</p>
                </div>
              </div>
            </div>

            <div className={styles.mapWrap}>
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Location"
              />
            </div>
            

          </ScrollReveal>

          {/* ── Inquiry Form ── */}
          <ScrollReveal delay={0.4} direction="left" className={styles.formCol}>
            <div className={styles.formBox}>
              <h3 className={styles.formTitle}>Send an Inquiry</h3>
              <p className={styles.formSub}>Fill out the form below and we will get back to you within 24 hours.</p>

              {success ? (
                <div className={styles.successMsg}>
                  <CheckCircle2 size={48} className={styles.successIcon} />
                  <h4>Inquiry Sent Successfully!</h4>
                  <p>Thank you for reaching out. Our team will review your requirements.</p>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit} onFocus={() => setFormFocused(true)} onClick={() => setFormFocused(true)}>
                  {errorMsg && <div role="alert" aria-live="assertive"><p className="text-red-500 mb-4 text-sm bg-red-50 p-3 rounded">{errorMsg}</p></div>}
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="name">Full Name *</label>
                      <input type="text" id="name" name="name" required aria-required="true" placeholder="John Doe" className="form-input" disabled={loading} />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="companyName">Company Name</label>
                      <input type="text" id="companyName" name="companyName" placeholder="Acme Corp" className="form-input" disabled={loading} />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email Address *</label>
                    <input type="email" id="email" name="email" required aria-required="true" placeholder="john@example.com" className="form-input" disabled={loading} />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="requirement">Product Requirement *</label>
                    <select id="requirement" name="requirement" required aria-required="true" className="form-select" disabled={loading}>
                      <option value="">Select a category</option>
                      <option value="core-pins">Core Pins</option>
                      <option value="gdc-inserts">GDC Inserts</option>
                      <option value="lpdc-inserts">LPDC Inserts</option>
                      <option value="sprue-bush">Sprue Bush</option>
                      <option value="other">Other Components</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="message">Message / Specifications *</label>
                    <textarea id="message" name="message" rows={4} required aria-required="true" placeholder="Please describe your requirements, dimensions, or material specifications..." className="form-textarea" disabled={loading} />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.fileLabel}>
                      <div className={styles.fileBtn}>
                        <Paperclip size={16} />
                        {fileName ? 'Change File' : 'Attach Drawing / Specs'}
                      </div>
                      <span className={styles.fileName}>{fileName || 'No file chosen (PDF, JPG, PNG, WEBP, ZIP)'}</span>
                      <input type="file" id="file" name="file" className={styles.fileInput} onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png,.webp,.zip" disabled={loading} />
                    </label>
                  </div>

                  {/* ReCAPTCHA UI Placeholder */}
                  <div className={styles.recaptchaWrap}>
                    <p className={styles.recaptchaText}>This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply.</p>
                  </div>

                  <Button type="submit" size="lg" fullWidth icon={loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />} iconPosition="right" loading={loading}>
                    {loading ? 'Sending Inquiry...' : 'Submit Inquiry'}
                  </Button>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
