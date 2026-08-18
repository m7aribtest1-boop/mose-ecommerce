# متجر موسى — E-commerce المغربي (جلابة وقفطان)

متجر إلكتروني كامل مبني بـ Next.js 14 (App Router) + TypeScript + Tailwind CSS، بواجهة عربية RTL لتسويق الجلابة والقفطان والتكشيطة المغربية.

## المزايا

- 10 صفحات: الرئيسية، المنتجات، تفاصيل المنتج، الفئات، تفاصيل الفئة، السلة، إتمام الطلب، من نحن، اتصل بنا
- سلة تسوق حية مع localStorage (خطاف `useCart`)
- 4 API routes: المنتجات، تفاصيل المنتج، الطلبات، الاتصال
- تخطيط RTL كامل مع خطوط عربية (Amiri + Inter)
- بيانات مشتركة (`src/lib/data.ts`) ومستخرجات (`src/lib/utils.ts`)
- اختبارات: 30 اختبار وحدة/تكامل (Jest) + سيناريوهات e2e (Cypress)

## التشغيل

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # بناء الإنتاج
npm run start      # تشغيل البناء
```

## الاختبارات

```bash
npm test             # Jest (الوحدة + التكامل)
npm run test:e2e     # Cypress (يحتاج الخادم شغال: npm run dev)
npm run test:e2e:open
npm run test:coverage
```

## البنية

```
src/
  app/          # الصفحات + API routes
  components/   # Header, Footer, ProductCard, HeroSection, ...
  hooks/        # useCart
  lib/          # data.ts (منتجات/فئات) + utils.ts (حسابات، تحقق)
  types/        # أنواع مشتركة (Product, Order, CartItem)
  styles/       # Tailwind
tests/
  unit/         # اختبارات utils, data, useCart
  integration/  # اختبارات سلة -> طلب
  e2e/          # سيناريوهات Cypress
public/
  products/     # صور المنتجات
  categories/   # صور الفئات
```

## API

| المسار | الوظيفة |
| :--- | :--- |
| `GET /api/products?category=&q=` | قائمة المنتجات مع فلترة وبحث |
| `GET /api/products/[id]` | تفاصيل منتج |
| `POST /api/orders` | إنشاء طلب (تحقق من البيانات) |
| `POST /api/contact` | إرسال رسالة اتصال |

## التقنيات

Next.js 14.2 - React 18 - TypeScript 5.4 - Tailwind 3.4 - Jest 29 - Cypress 13
