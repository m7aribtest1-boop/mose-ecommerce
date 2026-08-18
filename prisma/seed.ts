import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const categories = [
  { id: 'jellaba', name: 'الجلابة', slug: 'jellaba', description: 'جلابة فاسية، صيفية، شتوية، للمناسبات', image: '/categories/jellaba.jpg', order: 1 },
  { id: 'qaftan', name: 'القفطان', slug: 'qaftan', description: 'قفطان مخزني، عروس، مودرن، يومي', image: '/categories/qaftan.jpg', order: 2 },
  { id: 'takchita', name: 'التكشيطة', slug: 'takchita', description: 'تكشيطة عروس، سهرة، مناسبات', image: '/categories/takchita.jpg', order: 3 },
  { id: 'accessories', name: 'الإكسسوارات', slug: 'accessories', description: 'أحزمة، مجوهرات، حقائب، نعال', image: '/categories/accessories.jpg', order: 4 },
];

const products = [
  { slug: 'jellaba-fassia', name: 'الجلابة الفاسية', price: 299, compareAtPrice: 399, image: '/products/jellaba-fassi.jpg', categoryId: 'jellaba', badge: 'الأكثر مبيعاً', rating: 4.9, reviewsCount: 127, isBestSeller: true, material: 'صوف فاسي مخلوط بالقطن', care: 'غسل يدوي بماء بارد' },
  { slug: 'qaftan-makhzani', name: 'القفطان المخزني', price: 1800, compareAtPrice: 2400, image: '/products/qaftan-makhzeni.jpg', categoryId: 'qaftan', badge: 'جديد', rating: 4.8, reviewsCount: 89, isNew: true, material: 'ساتان + تطريز صقلي', care: 'تنظيف جاف فقط' },
  { slug: 'jellaba-sayfiya', name: 'الجلابة الصيفية (الكتانية)', price: 399, compareAtPrice: 499, image: '/products/jellaba-summer.jpg', categoryId: 'jellaba', badge: 'عرض الصيف', rating: 4.7, reviewsCount: 203, material: 'كتان خالص', care: 'غسل آلي برنامج خفيف' },
  { slug: 'qaftan-arroussa', name: 'قفطان العروس', price: 4500, compareAtPrice: 5500, image: '/products/qaftan-bride.jpg', categoryId: 'qaftan', badge: 'حصري', rating: 5.0, reviewsCount: 45, isFeatured: true, material: 'ورق ذهبي + حرير', care: 'تنظيف جاف فقط' },
  { slug: 'takchita-arroussa-fassia', name: 'تكشيطة العروس الفاسية', price: 3200, compareAtPrice: 4200, image: '/products/takchita-bride.jpg', categoryId: 'takchita', badge: 'الأكثر مبيعاً', rating: 4.9, reviewsCount: 67, isBestSeller: true, material: 'حرير + سفسيفي', care: 'تنظيف جاف فقط' },
  { slug: 'jellaba-chatiawiya', name: 'الجلابة الشتوية (الصوف)', price: 599, compareAtPrice: 799, image: '/products/jellaba-winter.jpg', categoryId: 'jellaba', badge: 'عرض الشتاء', rating: 4.8, reviewsCount: 156, material: 'صوف تقليدي', care: 'تنظيف جاف' },
  { slug: 'qaftan-modern', name: 'قفطان مودرن يومي', price: 899, compareAtPrice: 1199, image: '/products/qaftan-modern.jpg', categoryId: 'qaftan', badge: 'جديد', rating: 4.6, reviewsCount: 134, isNew: true, material: 'مخمل + تطريز', care: 'تنظيف جاف فقط' },
  { slug: 'takchita-dahabiya', name: 'تكشيطة سهرة ذهبية', price: 2800, compareAtPrice: 3500, image: '/products/takchita-gold.jpg', categoryId: 'takchita', badge: 'عرض محدود', rating: 4.7, reviewsCount: 92, isFeatured: true, material: 'تافتا + تطريز ذهبي', care: 'تنظيف جاف فقط' },
  { slug: 'hizam-jildi', name: 'حزام جلدي مغربي', price: 249, compareAtPrice: 349, image: '/products/belt.jpg', categoryId: 'accessories', badge: 'جديد', rating: 4.8, reviewsCount: 78, isNew: true, material: 'جلد طبيعي', care: 'مسح بقطعة جافة' },
  { slug: 'madma-harir', name: 'مضمة حرير', price: 199, compareAtPrice: 299, image: '/products/madma.jpg', categoryId: 'accessories', badge: 'عرض', rating: 4.9, reviewsCount: 234, material: 'حرير طبيعي', care: 'غسل يدوي لطيف' },
  { slug: 'na3al-maghribi', name: 'نعال مغربية جلدية', price: 349, compareAtPrice: 449, image: '/products/slippers.jpg', categoryId: 'accessories', badge: 'الأكثر مبيعاً', rating: 4.8, reviewsCount: 187, isBestSeller: true, material: 'جلد طبيعي', care: 'مسح بقطعة رطبة' },
  { slug: 'hakiba-jildiya', name: 'حقيبة جلدية يدوية', price: 899, compareAtPrice: 1199, image: '/products/bag.jpg', categoryId: 'accessories', badge: 'جديد', rating: 4.7, reviewsCount: 56, isNew: true, material: 'جلد طبيعي مصنوع يدوياً', care: 'كريم جلدي خاص' },
  { slug: 'jellaba-atlas', name: 'الجلابة الأطلسية', price: 650, compareAtPrice: 850, image: '/products/jellaba-fassi-3.jpg', categoryId: 'jellaba', badge: 'الأكثر طلباً', rating: 0, reviewsCount: 0, isBestSeller: true, material: 'صوف الأطلس المنسوج يدوياً', care: 'تنظيف جاف', description: 'جلابة أطلسية بدوزان تقليدي، منسوجة من صوف الأطلس الخالص بأيدي المعلمات. دفء وحضور مغربي أصيل لكل المناسبات.' },
  { slug: 'qaftan-sdrati-moderne', name: 'قفطان مودرن مرصّع', price: 750, compareAtPrice: 999, image: '/products/qaftan-modern.jpg', categoryId: 'qaftan', badge: 'جديد', rating: 0, reviewsCount: 0, isNew: true, material: 'تفتا فرنسي + تطريز لؤلؤي', care: 'تنظيف جاف فقط', description: 'قفطان مودرن بقصّة عصرية وتطريز لؤلؤي يدوي على الصدر والأكمام. أنيق للسهرة وللعمل دون إثقال.' },
  { slug: 'takchita-sahra-makhmal', name: 'تكشيطة سهرة مخملية', price: 1500, compareAtPrice: 1990, image: '/products/takchita-gold.jpg', categoryId: 'takchita', badge: 'عرض محدود', rating: 0, reviewsCount: 0, isFeatured: true, material: 'مخمل + سفسيفي ذهبي', care: 'تنظيف جاف فقط', description: 'تكشيطة سهرة من المخمل الفاخر مع سفسيفي (sfifa) ذهبي محروك يدوياً. تألّق مغربي للحفلات والمناسبات الكبيرة.' },
  { slug: 'qaftan-travail', name: 'قفطان عمل أنيق', price: 690, compareAtPrice: 890, image: '/products/qaftan-makhzeni.jpg', categoryId: 'qaftan', badge: 'الأكثر طلباً', rating: 0, reviewsCount: 0, isNew: true, material: 'ساتان مطرّز', care: 'تنظيف جاف فقط', description: 'قفطان يومي بقصّة رسمية مريحة، مناسب للعمل والزيارات. تطريز خفيف يعطيه وقاراً دون تكلف.' },
];

async function main() {
  console.log('Seeding MOSE database...');

  for (const c of categories) {
    await prisma.category.upsert({ where: { id: c.id }, update: c, create: c });
  }

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const stockByCategory: Record<string, number[]> = {
    jellaba: [8, 15, 20, 12, 6],
    qaftan: [5, 10, 12, 8, 4],
    takchita: [3, 6, 8, 5, 2],
    accessories: [20, 20, 20, 15, 10],
  };

  for (const p of products) {
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    const product = existing
      ? await prisma.product.update({
          where: { slug: p.slug },
          data: {
            ...p,
            seoTitle: `${p.name} | متجر موسى`,
            seoDescription: `تسوق ${p.name} الأصيل — توصيل سريع + الدفع عند الاستلام + إرجاع سهل. متجر موسى للملابس المغربية التقليدية.`,
          },
        })
      : await prisma.product.create({
          data: {
            ...p,
            seoTitle: `${p.name} | متجر موسى`,
            seoDescription: `تسوق ${p.name} الأصيل — توصيل سريع + الدفع عند الاستلام + إرجاع سهل. متجر موسى للملابس المغربية التقليدية.`,
          },
        });

    const existingVariants = await prisma.productVariant.count({ where: { productId: product.id } });
    if (existingVariants > 0) continue;

    const stocks = stockByCategory[p.categoryId] || [10, 10, 10, 10, 10];
    for (let i = 0; i < sizes.length; i++) {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          sku: `${p.slug.toUpperCase()}-${sizes[i]}`,
          size: sizes[i],
          color: null,
          stock: stocks[i],
        },
      });
    }
  }

  const reviews = [
    { slug: 'jellaba-fassia', author: 'سعاد', rating: 5, title: 'خياطة رائعة', body: 'جلابة فاسية بجودة عالية، القماش ممتاز والخياطة متقنة. وصلت فـ 48 ساعة وتغليف أنيق.' },
    { slug: 'jellaba-fassia', author: 'نعيمة', rating: 5, title: 'مريحة وأنيقة', body: 'اشريتها لعيد الأضحى، الكل سأل عليها. المقاس صحيح وتتنفس.' },
    { slug: 'qaftan-makhzani', author: 'أميمة', rating: 5, title: 'قفطان عروس يحلم', body: 'التطريز الصقلي خرافي، شعلة فخامة. الدعم عبر واتساب رد بسرعة على مقاسي.' },
    { slug: 'qaftan-arroussa', author: 'سلمى', rating: 5, title: 'لحفل زفافي', body: 'الورق الذهبي + الحرير يبهر. الثمن يسوى، والشحن محمي.' },
    { slug: 'takchita-arroussa-fassia', author: 'خديجة', rating: 5, title: 'تكشيطة أسطورية', body: 'السفسيفي ماشي رخيص، خدمتو يدوية واضحة. فرحانة بيها.' },
    { slug: 'jellaba-sayfiya', author: 'أسماء', rating: 5, title: 'كتان خالص', body: 'خفيفة على الصيف، الملمس طبيعي ماشي صناعي. كنرجع نشري من عندكم.' },
    { slug: 'jellaba-chatiawiya', author: 'فاطمة', rating: 4, title: 'دافية ومزيانة', body: 'الصوف التقليدي سخن مزيان. تمنيتها شحال شوية بوحدها ولكن راضية.' },
    { slug: 'qaftan-modern', author: 'ريم', rating: 5, title: 'يومي وعملي', body: 'قفطان مودرن نقدر نلبسو للخدمة ولا سهرة. المخمل كيبركي.' },
    { slug: 'takchita-dahabiya', author: 'هند', rating: 5, title: 'سهرة ذهبية', body: 'التطريز الذهبي كيضوي. جاتني تعليقات بزاف.' },
    { slug: 'na3al-maghribi', author: 'زينب', rating: 5, title: 'راحة فالقدم', body: 'نعال جلدية مريحة، الخياطة مغربية أصيلة. كنصح بيها.' },
  ];

  const reviewCount = await prisma.review.count();
  if (reviewCount === 0) {
    for (const r of reviews) {
      const prod = await prisma.product.findUnique({ where: { slug: r.slug } });
      if (!prod) continue;
      await prisma.review.create({
        data: { productId: prod.id, author: r.author, rating: r.rating, title: r.title, body: r.body, status: 'approved', source: 'seed' },
      });
    }
    console.log(`Seeded ${reviews.length} reviews`);
  }

  await prisma.coupon.upsert({
    where: { code: 'MARHABA10' },
    update: {},
    create: {
      code: 'MARHABA10',
      type: 'PERCENT',
      value: 10,
      maxDiscount: 50,
      minSubtotal: 350,
      active: true,
    },
  });

  const adminExists = await prisma.adminUser.count();
  if (adminExists === 0) {
    const passwordHash = await bcrypt.hash('admin1234', 10);
    await prisma.adminUser.create({
      data: { email: 'admin@mose.ma', name: 'مدير موسى', passwordHash },
    });
  }

  console.log('Seeding complete. Admin login: admin@mose.ma / admin1234');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
