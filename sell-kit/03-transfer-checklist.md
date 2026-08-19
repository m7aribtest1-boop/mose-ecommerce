# Transfer Checklist — MOSE E-commerce

> What the seller must hand over, and what the buyer should verify. Do these BEFORE publishing the listing so the handover is instant.

## 1. Accounts & Access (transfer to buyer)

| Asset | Where | Status |
| :--- | :--- | :--- |
| GitHub repository (source code) | `m7aribtest1-boop/mose-ecommerce` | transfer repo ownership |
| Vercel project | connected to repo, production domain | transfer project |
| PostgreSQL database | Neon (production) — connection string in `mosa_DATABASE_URL_UNPOOLED` | transfer / recreate |
| Local SQLite dev DB | `prisma/dev.db` | included in repo |
| Domain (optional) | currently `mose-ecommerce.vercel.app` — buy `mose.ma` for higher value | add & bind |
| Admin credentials | `admin@mose.ma` / `admin1234` (change to buyer's) | reset after handover |

## 2. Code & Documentation

- [x] `README.md` — setup, commands, credentials (Arabic + English)
- [ ] Source ZIP / repo clone handed over
- [ ] `prisma/schema.prisma` — note: set provider to `postgresql` on the buyer's machine
- [ ] Env variables documented (database URL, JWT secret, session secret)
- [ ] Seed data included (`npm run seed`)

## 3. Buyer verification steps (after handover)

```bash
npm install
# set DATABASE_URL to their PostgreSQL (or use SQLite: provider = "sqlite")
npx prisma db push
npm run seed
npm run build       # must pass
npm run test        # 30 tests must pass
npm run dev         # http://localhost:3000
```

Admin check: open `/admin`, login, change default password, enable 2FA.

## 4. Price-hike checklist (do BEFORE selling to raise value)

- [ ] Register a real domain (e.g. `mose.ma`, ~100 MAD/year)
- [ ] Replace demo product photos with real/own product photography
- [ ] Set a real WhatsApp number (Admin → Settings)
- [ ] Record a 60–90s demo video (storefront + admin)
- [ ] Add real product descriptions and reviews
- [ ] Take screenshots of every page (storefront + admin + mobile)

## 5. Legal / privacy of the demo data

- [ ] Replace fake customer/order seed data before handover (or tell buyer to re-seed)
- [ ] Confirm no secrets/API keys are committed to the repo (check `.env*`, git history)

## 6. Post-sale support scope (offer as goodwill)

- 7 days of setup support (deploy + first product + WhatsApp number)
- Full documentation handover
- Buyer re-seeds database for a clean start