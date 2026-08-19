# Features List — MOSE E-commerce

Use as the selling points / handover summary.

## Storefront (Storefront / الواجهة)

- Arabic RTL premium design (Amiri serif + Inter), gold/ink/ivory palette
- Home: hero, featured products, brand story, editorial grid, testimonials, FAQ
- Products: search + category filter + sort, infinite grid, product cards
- Product detail: gallery with thumbnails, size picker (S–XXL), quantity, live stock, buy now, WhatsApp order button, size guide, related products, reviews
- Categories: 4 (Djellaba, Kaftan, Takchita, Accessories)
- Cart: localStorage, coupons, quantity, subtotal
- Checkout: COD only (payment on delivery) + WhatsApp confirmation, shipping city/cost, risk scoring
- Customer account: orders, addresses, profile
- Legal pages: shipping, returns (7 days), terms, privacy, size guide, about, contact
- Floating WhatsApp button + mobile sticky buy bar

## Admin Panel (/admin)

- Dashboard: revenue, today's orders, AOV, COD refusal rate, low-stock alerts, recent orders
- Orders: list/filter, status updates, return/refund flow
- Products: create/edit with variants (sizes + stock), images, SEO fields, badges, compare-at prices
- Customers: list with order totals and risk levels
- Settings: store name, WhatsApp number, shipping rules, FAQ, maintenance
- Newsletter: subscribers list (email + city), export
- Security: admin login (httpOnly cookie, 12h), 2FA (TOTP via Google Authenticator), change password

## Backend / Data

- Prisma 6 + PostgreSQL (SQLite locally) — real relational DB
- 12 seeded products, 4 categories, 5 sizes with stock per variant
- Orders with Zod validation, inventory deduction, order number MOS-XXXX-XXXX, customer history, fraud/risk score
- Coupons (percentage/fixed, min subtotal, max discount, active toggle)
- Reviews (approval workflow)
- Newsletter subscribers with city
- Product view analytics

## API

- REST endpoints: products, product detail, orders, coupons, newsletter, auth, admin (20+ routes)
- Input validation with Zod, typed responses

## SEO & Performance

- Arabic meta titles/descriptions, Open Graph, dynamic OG images
- RTL + Arabic fonts, mobile-first responsive
- Server components + ISR, image optimization (next/image)

## Quality

- 30 passing Jest tests (unit + integration)
- Production build passing (50+ routes), deployed on Vercel