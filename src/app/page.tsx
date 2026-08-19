import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ProductCard } from '@/components/ProductCard';
import { CategorySection } from '@/components/CategorySection';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import NewsletterSignup from '@/components/NewsletterSignup';
import { BrandStory } from '@/components/BrandStory';
import TrustBadges from '@/components/TrustBadges';
import FaqSection from '@/components/FaqSection';
import InstagramGrid from '@/components/InstagramGrid';
import HomeMobileCta from '@/components/HomeMobileCta';
import { EditorialEdit, type EditProduct } from '@/components/EditorialEdit';
import { getStoreSettings } from '@/lib/store-settings';

export const dynamic = 'force-dynamic';

export const revalidate = 300;

function toCard(p: {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  image?: string | null;
  category?: { name: string } | null;
  badge?: string | null;
  rating: number;
  reviewsCount: number;
}): EditProduct {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    originalPrice: p.compareAtPrice ?? undefined,
    image: p.image || '/products/placeholder.jpg',
    category: p.category?.name || '',
    badge: p.badge || undefined,
    rating: p.rating,
    reviews: p.reviewsCount,
  };
}

export default async function HomePage() {
  const settings = await getStoreSettings();
  const [featuredProducts, categories, jellaba, takchita, newArrivals] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      where: { OR: [{ isBestSeller: true }, { isFeatured: true }] },
      take: 8,
      orderBy: [{ isBestSeller: 'desc' }, { reviewsCount: 'desc' }],
    }),
    prisma.category.findMany({ orderBy: { order: 'asc' }, include: { _count: { select: { products: true } } } }),
    prisma.product.findMany({ where: { category: { slug: 'jellaba' } }, include: { category: true }, take: 4 }),
    prisma.product.findMany({ where: { category: { slug: 'takchita' } }, include: { category: true }, take: 4 }),
    prisma.product.findMany({ where: { isNew: true }, include: { category: true }, take: 4 }),
  ]);

  const productsForCards = featuredProducts.slice(0, 4).map(toCard);

  const categoriesForSection = categories.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description || '',
    image: c.image || '/categories/jellaba.jpg',
    count: c._count.products,
  }));

  return (
    <main className="flex-1">
      <HeroSection headline={settings.heroHeadline || undefined} subheadline={settings.heroSubheadline || undefined} />
      <HomeMobileCta />
      <TrustBadges />
      <CategorySection categories={categoriesForSection} />
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-primary-900">الأكثر مبيعاً</h2>
            <Link
              href="/products"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              عرض الكل
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productsForCards.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      <BrandStory story={settings.brandStory} />
      <EditorialEdit
        eyebrow="Edit رقم ٠١ — الجلابة"
        title="إصدار الجلابة"
        description="الجلابة المغربية كما يجب: صوف فاسي للشتاء، كتان خالص للصيف. قطع نختاروها بعناية لراحة تلبسها فخمة كل الأيام."
        href="/categories/jellaba"
        products={jellaba.map(toCard)}
      />
      <EditorialEdit
        eyebrow="Edit رقم ٠٢ — المناسبات"
        title="إصدار المناسبات"
        description="التكشيطة والقفطان ديال السهرة والحفلات — تطريز يدوي، خامات نبيلة، ولمسة تخلّيك مميزة فكل مناسبة."
        href="/categories/takchita"
        products={takchita.map(toCard)}
      />
      {newArrivals.length > 0 && (
        <EditorialEdit
          eyebrow="الوافدات الجديدات"
          title="جديد موسى"
          description="آخر القطع اللي وصلات الأتولييه ديالنا — لوجي قبل ما تفوتك."
          href="/products"
          products={newArrivals.map(toCard)}
        />
      )}
      <FeaturesSection />
      <FaqSection />
      <InstagramGrid />
      <NewsletterSignup />
    </main>
  );
}