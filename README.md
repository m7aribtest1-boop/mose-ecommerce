# متجر موسى (MOSE) — E-commerce مغربي كامل

منصة تجارة إلكترونية متكاملة لبيع الجلابة والقفطان والتكشيطة المغربية، بواجهة عربية RTL، جاهزة للإطلاق والتخصيص. مبنيّة بـ Next.js 14 (App Router) + TypeScript + Tailwind CSS + Prisma + PostgreSQL.

---

## المزايا

- **واجهة متجر عربية RTL** فاخرة: رئيسية، منتجات (فلترة/بحث)، تفاصيل منتج (مقاسات + كمية + شراء فوري + واتساب)، فئات، سلة، إتمام طلب، حسابي، من نحن، اتصل بنا.
- **قاعدة بيانات حقيقية** (Prisma + PostgreSQL): منتجات، فئات، متغيّرات (مقاسات S–XXL + مخزون)، مراجعات، كوبونات، طلبات، عملاء، مشتركو نشرة.
- **نظام طلبات** مع تحقق Zod + خصم مخزون + سجل عميل + درجة مخاطرة + رقم طلب `MOS-XXXX-XXXX` + الدفع عند الاستلام (COD).
- **لوحة إدارة كاملة** `/admin`: مبيعات، طلبات اليوم، متوسط السلة (AOV)، نسبة رفض COD، المخزون المنخفض + إدارة الطلبات (تحديث حالة/إرجاع/استرداد) + إضافة منتجات بمقاسات + إدارة العملاء.
- **أمان**: مصادقة أدمن بكوكيز httpOnly (12 ساعة) + **2FA برمز TOTP** (Google Authenticator) + ضبط كلمة السر.
- **تحليلات**: تتبّع مشاهدات المنتجات + لوحة إحصائية.
- **نشرة إخبارية** مع التقاط المدينة، **إشعارات** فورية داخل اللوحة.
- **كوبونات** (مثال: `MARHABA10`).
- **SEO عربي** كامل (عناوين، أوصاف، Open Graph، RTL، صور ديناميكية).
- **إعدادات قابلة للتعديل** من اللوحة (رقم واتساب، شحن، أسئلة شائعة...).

## الستاك

| | |
|---|---|
| Framework | Next.js 14.2 (App Router) |
| اللغة | TypeScript 5 |
| الأنماط | Tailwind CSS 3.4 + نظام تصميم ذهبي/كحلي |
| قاعدة البيانات | Prisma 6.19 — PostgreSQL (الإنتاج) / SQLite (التطوير المحلي) |
| المصادقة | JWT في كوكيز + 2FA (TOTP) |
| اختبارات | Jest (30 اختبار) |

## التشغيل

```bash
npm install
npx prisma db push        # تزامن المخطط مع قاعدة البيانات
npm run seed              # بذر بيانات تجريبية (منتجات/فئات/مراجعات)
npm run dev               # http://localhost:3000
```

البناء والإنتاج:

```bash
npm run build
npm run start
```

## الاختبارات

```bash
npm test             # Jest (الوحدة + التكامل)
```

## أوامر مفيدة

```bash
npm run seed                  # إعادة بذر البيانات التجريبية
npx prisma studio             # تصفح قاعدة البيانات
```

## بيانات الدخول الافتراضية (مهم — غيّرها قبل الإطلاق)

- الأدمن: `admin@mose.ma` / `admin1234`
- كوبون خصم: `MARHABA10` (10%)

## بنية المشروع

```
src/
  app/            # الصفحات + API routes (/admin، /products، /api/...)
  components/     # مكوّنات الواجهة
  lib/            # prisma، store (الإعدادات)، utils، validation
  hooks/          # useCart وغيرها
prisma/
  schema.prisma   # المخطط (بدّل provider إلى sqlite للتطوير المحلي)
  seed.ts         # بيانات البذر
public/
  products/       # صور المنتجات
  categories/     # صور الفئات
```

## API الرئيسية

| المسار | الوظيفة |
| :--- | :--- |
| `GET /api/products` | قائمة المنتجات (فلترة فئة + بحث) |
| `GET /api/products/[id]` | تفاصيل منتج |
| `POST /api/orders` | إنشاء طلب (COD) |
| `POST /api/coupons/validate` | التحقق من الكوبون |
| `POST /api/newsletter` | الاشتراك في النشرة |
| `/api/auth/*` + `/api/admin/*` | المصادقة وإدارة اللوحة |

---

# MOSE Store — Full Arabic RTL E-commerce (English)

A complete, production-ready Arabic RTL e-commerce platform for Moroccan traditional clothing (Djellaba, Kaftan, Takchita), ready to rebrand, deploy, and sell with.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS 3 · Prisma 6 + PostgreSQL · JWT auth + 2FA · Jest.

**Highlights:** full storefront, cart, COD checkout + WhatsApp, product variants (S–XXL, stock), coupons, customer reviews, newsletter with city capture, complete admin panel (dashboard, orders, products, customers), analytics (product views), 2FA, notifications, Arabic SEO + RTL, 30 passing tests.

**Quick start:** `npm install` → `npx prisma db push` → `npm run seed` → `npm run dev`.

**Default admin:** `admin@mose.ma` / `admin1234` (change before launch).