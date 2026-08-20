# REBRAND — إعادة إطلاق المتجر بعلامة جديدة

> غايتك كصاحب مشروع: تعاود الإطلاق تحت اسم وبراند جديد فـ أقل وقت. هاد الدليل كيجمع **كل** ما عندو علاقة بالبراند فـ مكان واحد. نقدر تخلصه فـ 30–60 دقيقة مع `npm run seed` في الأخير.

## 1. الاسم والشعار والهوية النصية

| العنصر | المكان | ملاحظات |
|---|---|---|
| اسم المتجر (DB / يعرض فكل الصفحات) | `/admin` → الإعدادات → `storeName` + جدول `StoreSettings` | يظهر فـ العنوان والهيدر |
| الاسم الافتراضي فالكود | `src/lib/store.ts` → `storeConfig.name` | قيمة احتياطية |
| شعار الهيدر "موسى." | `src/components/Header.tsx` (السطر ~50) | غيّر النص والحرف ديال الدائرة |
| شعار الفوتر "MOSE" + "موسى." + الوصف | `src/components/Footer.tsx` | الأسطر 38–47 |
| اسم المتجر فالـ metadata/SEO | `src/app/layout.tsx` (الأسطر 27–48) | `title`, `template`, `siteName`, `authors`, `publisher`, og |
| أسماء الصفحات القانونية | `src/app/{privacy,terms,shipping-policy,returns-policy,size-guide,about,contact}/*/page.tsx` | `title` ديال كل صفحة |
| براند "موسى" فـ نصوص ثابتة | `BuyBox.tsx`, `FloatingWhatsApp.tsx`, `ConsentBanner.tsx`, `NewsletterSignup.tsx`, `auth/*/page.tsx`, `orders/success/page.tsx`, `HomeMobileCta.tsx` (إن وُجد) | ابحث بـ `grep -rn "موسى" src` |
| قصص/نصوص تسويقية | `/admin` → `heroHeadline`, `heroSubheadline`, `brandStory`, `aboutText`, `sizeGuideText`, `shippingText` | كلها فـ `StoreSettings` (DB) |

## 2. الألوان والخطوط

| العنصر | المكان |
|---|---|
| لوحة الألوان (ivory/ink/gold...) | `tailwind.config.js` → `theme.extend.colors` |
| لون المتصفح (themeColor) | `src/app/layout.tsx` |
| الخطوط (Amiri / Inter) | `src/app/layout.tsx` (font variables) + `globals.css` (`.arabic-text`) |

## 3. الشعارات والأيقونات (favicon)

| العنصر | المكان |
|---|---|
| Favicon `.ico` | `public/favicon.ico` (وُلّد بـ `node scripts/genfavicon.js`) |
| أيقونات SVG | `public/icon.svg`, `public/favicon.svg` |
| أيقونات المتجر (إن كانت منوّلة) | `scripts/genbrandicons.js` |

## 4. الفئات والمنتجات (الكتالوج)

| العنصر | المكان |
|---|---|
| فئات تجريبية | `prisma/seed.ts` → مصفوفة `categories` + جدول `categories` فـ DB |
| منتجات تجريبية | `prisma/seed.ts` → مصفوفة `products` |
| الصور | `public/products/*.jpg`, `public/categories/*.jpg` — بدّلها بصورك الخاصة (نفس الأسماء ولا غيّر الـ path فـ الـ DB) |
| الاعتمادات | `public/IMAGES-CREDITS.md` |

## 5. رقم واتساب والقنوات

| العنصر | المكان |
|---|---|
| رقم واتساب (يعرض فالأزرار) | `/admin` → الإعدادات → `whatsappNumber` + افتراضياً `src/lib/store.ts` → `storeConfig.whatsapp.number` |
| روابط الشبكات الاجتماعية | `/admin` → الإعدادات → `socialJson` |
| رسائل واتساب الجاهزة | `BuyBox.tsx`, `FloatingWhatsApp.tsx`, `orders/success/page.tsx` |

## 6. البيانات والأسرار

| العنصر | المكان |
|---|---|
| كلمة سر الأدمن | تُولّد **عشوائياً** عند أول بذر وتُطبع مرة واحدة — غيّرها من `/admin` → الإعدادات → "تغيير كلمة المرور" |
| مفاتيح/أسرار | `MOSE_SESSION_SECRET` + `DATABASE_URL` — راجع `.env.example`؛ لا تنسخ أبداً أسرار الـ repo السابق |
| بيانات تجريبية | `node scripts/clean-db.js` ثم `npm run seed` — كيمسح كل بيانات المعاملات/الشخصية ويعيد بذر كتالوج نظيف |

## 7. خطوات التلخيص (Checklist)

- [ ] 1. `grep -rn "موسى" src` → غيّر كل النصوص الظاهرة للمستخدم
- [ ] 2. `tailwind.config.js` + `layout.tsx` → الألوان والخط وthemeColor
- [ ] 3. `public/favicon.ico` + `icon.svg` + `favicon.svg` → شعارك
- [ ] 4. `public/products/*` + `public/categories/*` → صور منتجاتك
- [ ] 5. `/admin` → storeName + whatsappNumber + hero/brandStory/socialJson
- [ ] 6. `npm run seed` → إعادة بذر الكتالوج تحت الفئات ديالك
- [ ] 7. غيّر كلمة سر الأدمن فوراً من `/admin`
- [ ] 8. `npm run build` + `npm test` → تأكد كلشي خدام قبل الإطلاق

> نصيحة: فـ الصفقة ديالك قُل للمشتري: "التجديد يحتاج 8 خطوات موثّقة — هاد الدليل". هذا هو مفتاح بيع white-label بثمن أعلى.