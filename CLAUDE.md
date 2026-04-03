# CLAUDE.md — VOIDFORM Project Intelligence

## Project Overview

**VOIDFORM** is a high-end e-commerce platform for avant-garde streetwear jewelry. It sells handmade .925 sterling silver pieces with a brutalist, "psychological Joker" aesthetic.

- **Live URL**: https://voidform-mauve.vercel.app
- **Repo**: https://github.com/Smix4444/Website.git
- **Brand Voice**: Psychological, mysterious, chaotic. Premium horror-fashion. Never casual.

---

## Architecture

```
voidform/
├── api/                          # Vercel serverless functions (production)
│   ├── data/
│   │   └── products.json         # Product catalog (Vercel copy)
│   ├── products/
│   │   ├── index.js              # GET /api/products — returns all 10 products
│   │   └── [id].js               # GET /api/products/:id — single product
│   ├── checkout/
│   │   └── create-session.js     # POST /api/checkout/create-session — Stripe
│   └── contact.js                # POST /api/contact — contact form
├── public/                       # Static frontend (served by Vercel + Express)
│   ├── assets/                   # Product images (10 .webp files)
│   ├── css/
│   │   └── style.css             # Complete design system (~600 lines)
│   ├── js/
│   │   ├── app.js                # Shared: cart state, scroll reveals, nav, marquee
│   │   ├── home.js               # Home page: featured products loader
│   │   ├── products.js           # Collection page: grid + category filters
│   │   ├── product.js            # Product detail page: single product loader
│   │   ├── cart.js               # Cart page: quantity controls + Stripe checkout
│   │   └── contact.js            # Contact form submission
│   ├── index.html                # Home page
│   ├── products.html             # Collection/catalog page
│   ├── product.html              # Product detail page
│   ├── cart.html                 # Cart/checkout page
│   ├── contact.html              # Contact form page
│   └── success.html              # Post-checkout success page
├── server/                       # Express backend (local development)
│   ├── data/
│   │   └── products.json         # Product catalog (source of truth)
│   ├── middleware/
│   │   └── sanitize.js           # XSS/injection sanitization middleware
│   ├── routes/
│   │   ├── products.js           # Product API routes
│   │   ├── checkout.js           # Stripe checkout route
│   │   └── contact.js            # Contact form route
│   └── server.js                 # Express app entry point
├── vercel.json                   # Vercel deployment config
├── package.json                  # Dependencies
├── .env                          # Local environment variables (gitignored)
├── .env.example                  # Environment variable template
└── .gitignore
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Vanilla HTML/CSS/JS | No framework — maximum performance |
| Fonts | Space Grotesk, Inter, JetBrains Mono | Google Fonts CDN |
| Backend (local) | Node.js + Express 4 | API + static serving for dev |
| Backend (prod) | Vercel Serverless Functions | Native `api/` directory functions |
| Payments | Stripe Checkout Sessions | PCI-compliant, no raw card handling |
| Security | Helmet, CORS, rate-limit, validator.js | Defense-in-depth |
| Hosting | Vercel | Auto-deploy from GitHub `main` branch |
| DNS | Cloudflare (planned) | DNS, CDN, DDoS protection |

---

## Dual Environment Pattern

This project runs differently in **local dev** vs **Vercel production**:

### Local Development
- Express server at `server/server.js` handles everything
- Static files served from `public/`
- API routes via Express Router (`/api/products`, etc.)
- Run with: `npm run dev` → http://localhost:3000

### Vercel Production
- `public/` is auto-served as static files by Vercel
- `api/` functions are native Vercel serverless handlers
- **Product data is INLINED** in each API function (no `require()` across directories)
- Environment variables set in Vercel Dashboard, not `.env`

> **CRITICAL**: When updating product data, you must update BOTH:
> 1. `server/data/products.json` (local dev source of truth)
> 2. The inlined arrays in `api/products/index.js`, `api/products/[id].js`, `api/checkout/create-session.js`

---

## Design System

### Theme: "Dark Joker / Psychological"

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-void` | `#050505` | Page background |
| `--bg-surface` | `#0A0A0A` | Card backgrounds |
| `--bg-elevated` | `#111111` | Hover states |
| `--text-primary` | `#F0EDE8` | Headings, body text |
| `--text-secondary` | `#8A8580` | Descriptions |
| `--text-muted` | `#4A4845` | Labels, captions |
| `--border-color` | `rgba(240,237,232,0.08)` | Subtle dividers |
| `--border-strong` | `rgba(240,237,232,0.25)` | Active borders |

### Typography
- **Display**: `Space Grotesk` — headings, product names, hero text
- **Body**: `Inter` — descriptions, paragraphs
- **Mono**: `JetBrains Mono` — labels, prices, navigation, buttons

### Animation System
All animations use CSS + `IntersectionObserver` (no external libraries):

| Class | Effect | Trigger |
|-------|--------|---------|
| `.reveal` | Fade up from 60px below | Scroll into viewport |
| `.reveal-left` | Slide from -80px left | Scroll into viewport |
| `.reveal-right` | Slide from +80px right | Scroll into viewport |
| `.reveal-scale` | Scale from 0.9 | Scroll into viewport |
| `.stagger-children` | Sequential 0.1s delay per child | Parent container |
| `.glitch` | Split RGB hover effect | Mouse hover |
| `.marquee` | Infinite horizontal scroll | Always active |

The observer is managed globally in `App.initScrollReveal()` as a **persistent singleton**. It handles dynamically injected elements and force-reveals elements already in the viewport.

### Film Grain
A `body::before` pseudo-element applies animated SVG noise at 4% opacity with `grainShift` keyframe animation.

---

## API Endpoints

### `GET /api/products`
Returns all 10 products. No auth required.

### `GET /api/products/:id`
Returns a single product by ID (e.g., `void-ring-01`). 404 if not found.

### `POST /api/checkout/create-session`
Creates a Stripe Checkout session. Requires `STRIPE_SECRET_KEY` env var.
- **Body**: `{ items: [{ id: string, quantity: number }] }`
- **Response**: `{ url: string }` — redirect user to this Stripe URL
- **Security**: Prices are ALWAYS validated server-side from the product catalog

### `POST /api/contact`
Handles contact form submissions.
- **Body**: `{ name: string, email: string, message: string }`
- **Validation**: All fields required, email format validated

---

## Product Catalog (10 pieces)

| ID | Name | Category | Price (cents) |
|----|------|----------|---------------|
| `void-ring-01` | VOID RING I | rings | 28000 |
| `entropy-chain-01` | ENTROPY CHAIN | chains | 54000 |
| `fracture-cuff-01` | FRACTURE CUFF | cuffs | 31000 |
| `shroud-pendant-01` | SHROUD PENDANT | pendants | 19000 |
| `decay-signet-01` | DECAY SIGNET | rings | 34000 |
| `schism-earring-01` | SCHISM EARRING | earrings | 16500 |
| `wraith-chain-01` | WRAITH CHAIN | chains | 42000 |
| `trauma-ring-01` | TRAUMA BAND | rings | 22000 |
| `phantom-cuff-01` | PHANTOM CUFF | earrings | 12000 |
| `abyss-collar-01` | ABYSS COLLAR | chains | 78000 |

**Categories**: rings, chains, cuffs, earrings, pendants  
**Prices**: Stored in cents (÷ 100 for display). Currency: EUR.

---

## Environment Variables

### Local (`.env`)
```
PORT=3000
NODE_ENV=development
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
CONTACT_EMAIL=void@voidform.dev
```

### Vercel Dashboard
Set these in **Settings → Environment Variables**:
- `STRIPE_SECRET_KEY` — required for checkout
- `STRIPE_PUBLISHABLE_KEY` — for frontend Stripe.js
- `NODE_ENV` → `production`
- `ALLOWED_ORIGINS` → your Vercel domain

---

## Security

### Backend (Express, local dev)
1. **Helmet.js** — Security headers (CSP, X-Frame-Options, etc.)
2. **CORS** — Origin whitelist from `ALLOWED_ORIGINS` env var
3. **Rate Limiting** — 100 requests per 15 minutes on `/api/` routes
4. **Body Size Limit** — `express.json({ limit: '10kb' })` prevents payload DOS
5. **Input Sanitization** — Recursive `validator.escape()` on body, query, params
6. **Script Tag Stripping** — Regex removal of `<script>` tags

### Payments
- **PCI Compliance**: Never handle raw card numbers. Stripe Checkout Sessions redirect users to Stripe's hosted page.
- **Price Validation**: All prices fetched server-side from product catalog. Frontend prices are never trusted.

### Vercel (production)
- API functions are isolated serverless environments
- CORS headers set per-function
- `.env` is gitignored — secrets only in Vercel Dashboard

---

## Common Tasks

### Run locally
```bash
npm install
npm run dev
# → http://localhost:3000
```

### Add a new product
1. Add to `server/data/products.json`
2. Add to the inlined array in `api/products/index.js`
3. Add to the inlined array in `api/products/[id].js`
4. Add to the inlined array in `api/checkout/create-session.js` (id, name, description, price only)
5. Place product image in `public/assets/` as `.webp`
6. Commit and push to `main` → Vercel auto-deploys

### Update CSS design tokens
Edit `public/css/style.css` `:root` block. All values cascade via CSS custom properties.

### Deploy
Push to `main` branch. Vercel auto-builds and deploys.
```bash
git add -A
git commit -m "your message"
git push origin main
```

### Check Vercel logs
Visit https://vercel.com/smix4444s-projects/voidform → Deployments → select deployment → Logs

---

## Code Conventions

- **No frameworks**. Vanilla JS only. No React, Vue, Angular.
- **No build step**. HTML/CSS/JS served directly. No webpack, no Vite, no bundler.
- **Prices in cents**. Always. Divide by 100 only for display.
- **XSS protection**. Always use `App.escapeHtml()` when rendering user/API data into DOM.
- **Event listeners over inline handlers**. Never use `onclick="..."` in HTML strings. Use `addEventListener` with `data-*` attributes.
- **CSS custom properties**. All colors, fonts, spacing via `var(--token)`.
- **Monospace for UI chrome**. Prices, labels, nav links, buttons use `var(--font-mono)`.
- **Display font for headlines**. Product names, section headers use `var(--font-display)`.
- **Mobile-first responsive**. Breakpoints: 480px, 768px, 1024px.

---

## Known Issues & Gotchas

1. **Product data duplication**: Products exist in 4 places (server/data, api/products/index.js, api/products/[id].js, api/checkout). This is intentional — Vercel serverless functions can't reliably `require()` across directories.

2. **Vercel preview URLs**: Each push creates a unique preview deployment URL. The production URL is `voidform-mauve.vercel.app`. Don't debug old preview URLs.

3. **Stripe not configured**: Checkout will return a helpful error message if `STRIPE_SECRET_KEY` isn't set in Vercel. Products and browsing still work without it.

4. **Images are PNG renamed to .webp**: The product images were generated as PNG and copied with `.webp` extension. Browsers handle this fine but they're technically PNG files.

5. **`prefers-reduced-motion`**: All animations are disabled for users with reduced motion preference. This is handled in CSS.

---

## Brand Guidelines for Content

- Product descriptions should be **poetic and dark**. Short sentences. Psychological undertones.
- Never use cheerful language. Words like "chaos", "entropy", "void", "scar", "phantom" are on-brand.
- Button labels: "ENTER THE COLLECTION", "TRANSMIT" (not "Submit"), "ADD" (not "Add to Cart").
- Error messages stay on-brand: "The void is unreachable" (not "Server error").
- Price format: `280.00 EUR` (decimal, space, EUR).
