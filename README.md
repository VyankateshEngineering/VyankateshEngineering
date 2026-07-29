# Vyankatesh Engineering

Enterprise-grade flagship web application built for robust performance, accessibility, and scalability.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Vanilla CSS (Global & Modules) with dynamic theming
- **Animations**: Framer Motion (Optimized)
- **Data Fetching**: Next.js native fetching with extended cache policies
- **Forms**: React Hook Form + Zod (Strict Validation)
- **Security**: Strict CSP, Rate Limiting, XSS protection, CAPTCHA
- **SEO & Metadata**: JSON-LD, Dynamic Sitemaps, Open Graph
- **Infrastructure**: Vercel/Node.js compatible, CI/CD ready

## 🛠️ Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Installation

1. Install dependencies:
   ```bash
   npm ci
   ```

2. Environment Configuration:
   Create a `.env.local` file with the following required variables:
   ```env
   # Server-only secrets
   RESEND_API_KEY=your_resend_api_key
   RECAPTCHA_SECRET_KEY=your_secret_key
   CONTACT_EMAIL=your_contact_email@example.com

   # Public variables
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_public_key
   ```

3. Start Development Server:
   ```bash
   npm run dev
   ```
   Server runs at `http://localhost:3000`.

## 🏗️ Architecture

- **`app/`**: Next.js 14 App Router conventions (Pages, Layouts, API routes).
- **`components/`**: Reusable UI components ensuring WCAG AA+ accessibility.
- **`lib/`**: Utilities, strict Zod validations (`validations/env.ts`), security middleware (`rateLimiter.ts`).
- **`data/`**: Static strongly-typed local datasets.

## 🔒 Security Practices

- **Zero Client Exposure**: Environment variables are strictly parsed by `serverEnv` wrapper to prevent accidental leaks.
- **DDoS/Spam Mitigations**: In-memory rate limiting and request deduplication integrated on high-traffic endpoints (`/api/inquiries`).
- **Headers**: Extended security headers (HSTS, COOP, XFO, Permissions-Policy) via `next.config.mjs`.

## 🧪 Commands

- **Lint**: `npm run lint` (ESLint Next.js Core Web Vitals)
- **Type Check**: `npx tsc --noEmit`
- **Build**: `npm run build` (Static Generation Optimization)
- **Health Check**: `/api/health`

---

*Engineered with precision for a seamless enterprise business experience.*
