# 🐾 PawPredict AI

> Preventive health intelligence for your pet — powered by Claude AI.

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up your environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get your key at: https://console.anthropic.com/

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deploying to Vercel (recommended)

```bash
npm install -g vercel
vercel
```

When prompted, add your environment variable:
- `ANTHROPIC_API_KEY` → your key from console.anthropic.com

That's it. Vercel handles HTTPS, edge caching, and keeps your key server-side.

---

## Security Features

| Feature | Implementation |
|---|---|
| API key protection | Stored in `.env.local`, only accessed server-side in `/api/analyze` |
| Rate limiting | 10 requests/IP/minute (configurable via `RATE_LIMIT_MAX`) |
| Input validation | Zod schema validation on all incoming fields |
| Input sanitization | HTML stripping, max lengths, enum whitelisting |
| Image validation | Type check (JPEG/PNG only), 4MB size limit, base64 magic byte verification |
| Security headers | X-Frame-Options, CSP, HSTS, X-Content-Type-Options, Referrer-Policy |
| CORS | Locked to `NEXT_PUBLIC_APP_URL` in production |
| Error handling | Internal errors never leaked to client |
| AI response validation | Zod schema validates AI output before sending to frontend |
| Payload size limit | 6MB max request body |

---

## Project Structure

```
pawpredict/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts       ← Secure API route (server-side only)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               ← Main page
├── components/
│   ├── HealthForm.tsx         ← Input form
│   └── HealthReport.tsx       ← Results display
├── lib/
│   ├── rateLimit.ts           ← In-memory rate limiter
│   ├── sanitize.ts            ← Input sanitization
│   └── validation.ts          ← Zod schemas
├── .env.example               ← Copy to .env.local
├── .gitignore                 ← .env.local is excluded
└── next.config.js             ← Security headers
```

---

## Upgrading Rate Limiting for Scale

The default rate limiter is in-memory (works for a single server).
For production at scale, swap it for [Upstash Redis](https://upstash.com/):

```bash
npm install @upstash/ratelimit @upstash/redis
```

Then update `lib/rateLimit.ts` to use the Upstash client.
Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to `.env.local`.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ Yes | — | Your Anthropic API key |
| `RATE_LIMIT_MAX` | No | `10` | Max requests per IP per window |
| `RATE_LIMIT_WINDOW_MS` | No | `60000` | Rate limit window in ms |
| `NEXT_PUBLIC_APP_URL` | No | `http://localhost:3000` | Your production domain |
