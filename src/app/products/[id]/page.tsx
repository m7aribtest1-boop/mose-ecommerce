import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import BuyBox from '@/components/BuyBox';
import { ProductGallery } from '@/components/ProductGallery';
import { ProductCard } from '@/components/ProductCard';
import ProductAccordion from '@/components/ProductAccordion';
import { ProductReviews } from '@/components/ProductReviews';
import type { Review } from '@prisma/client';
import ReviewForm from '@/components/ReviewForm';
import { WishlistButton } from '@/components/WishlistButton';
import { TrustBadges } from '@/components/TrustBadges';
import { storeConfig } from '@/lib/store';
import StickyMobileBuyBar from '@/components/StickyMobileBuyBar';
import { formatPrice } from '@/lib/utils';

interface PageProps {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
}

async function getProduct(id: string) {
  return prisma.product.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { variants: true, category: true },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) return { title: 'منتج غير موجود | متجر موسى' };
  return {
    title: product.seoTitle || `${product.name} | متجر موسى`,
    description: product.seoDescription || product.description || undefined,
    openGraph: { title: product.name, description: product.description || undefined, images: product.image ? [product.image] : undefined },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId ?? undefined, id: { not: product.id } },
    include: { category: true },
    take: 4,
  });

  const reviews = await prisma.review.findMany({
    where: { productId: product.id, status: 'approved' },
    orderBy: { createdAt: 'desc' },
    take: 12,
  });

  const primaryImage = product.image || '/products/placeholder.jpg';

  const images = (() => {
    try {
      const arr = JSON.parse(product.images || '[]');
      return Array.isArray(arr) ? arr.filter(Boolean) : [];
    } catch {
      return [];
    }
  })();

  return (
    <main className="flex-1 pb-24 md:pb-0">
      <section className="py-8 bg-secondary-50">
        <div className="container-custom">
          <nav className="flex items-center gap-2 text-sm text-secondary-600 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary-600">الرئيسية</Link>
            <span className="text-secondary-400">/</span>
            <Link href="/products" className="hover:text-primary-600">جميع المنتجات</Link>
            {product.category && (
              <>
                <span className="text-secondary-400">/</span>
                <Link href={`/categories/${product.category.id}`} className="hover:text-primary-600">{product.category.name}</Link>
              </>
            )}
            <span className="text-secondary-400">/</span>
            <span className="text-primary-900 font-medium">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10">
            <ProductGallery images={images} name={product.name} primaryImage={primaryImage} badge={product.badge} />

            <div>
              <div className="flex items-center gap-3 mb-3">
                {product.category && (
                  <span className="inline-block text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                    {product.category.name}
                  </span>
                )}
                <WishlistButton productId={product.id} className="w-10 h-10" />
              </div>
              <h1 className="text-3xl font-bold text-primary-900 mb-3">{product.name}</h1>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-1.5 text-accent-500 text-lg leading-none">
                  {'★★★★★'.split('').slice(0, Math.round(product.rating)).join('')}
                  <span className="text-base font-semibold text-primary-900 mr-1">{product.rating}/5</span>
                </div>
                <span className="text-secondary-500 text-sm">({product.reviewsCount} تقييم مُوثّق)</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-secondary-700 mb-6">
                <span className="flex items-center gap-1.5"><svg className="w-4 h-4 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> الدفع عند الاستلام</span>
                <span className="flex items-center gap-1.5"><svg className="w-4 h-4 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> إرجاع خلال 7 أيام</span>
                <span className="flex items-center gap-1.5"><svg className="w-4 h-4 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> توصيل 24-72 ساعة</span>
              </div>

              {storeConfig.prepaid.enabled && (
                <div className="flex items-center gap-2 text-sm text-accent-700 bg-accent-50 border border-accent-100 rounded-lg px-3 py-2 mb-6">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9V9h2v4zm0-6H9V5h2v2z" /></svg>
                  {storeConfig.prepaid.note}
                </div>
              )}

              <TrustBadges className="mb-6" />

              <BuyBox
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  compareAtPrice: product.compareAtPrice ?? undefined,
                  description: product.description ?? undefined,
                  image: primaryImage,
                  variants: product.variants,
                }}
              />


            </div>
          </div>
        </div>
      </section>

      <ProductAccordion
        product={{
          name: product.name,
          description: product.description,
          material: product.material,
          sizes: Array.from(new Set((product.variants || []).map((v) => v.size))),
        }}
      />

      <ProductReviews reviews={reviews} />
      <div className="container-custom">
        <ReviewForm productId={product.id} />
      </div>

      {related.length > 0 && (
        <section className="py-16 bg-secondary-50">
          <div className="container-custom">
            <h2 className="text-2xl font-bold text-primary-900 text-center mb-10">قد يعجبك أيضاً</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((r) => (
                <ProductCard
                  key={r.id}
                  product={{
                    id: r.id,
                    name: r.name,
                    price: r.price,
                    originalPrice: r.compareAtPrice ?? undefined,
                    image: r.image || '/products/placeholder.jpg',
                    category: r.category?.name || '',
                    badge: r.badge || undefined,
                    rating: r.rating,
                    reviews: r.reviewsCount,
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}
      <StickyMobileBuyBar price={product.price} productName={product.name} />
    </main>
  );
}

// إعادة توليد الصفحة (ISR) — الأسعار والمخزون محدثة
export const revalidate = 300;