import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ProductCard } from '@/components/ProductCard';

export const metadata: Metadata = {
  title: 'جميع المنتجات',
  description: 'اكتشف تشكيلتنا الكاملة من الجلابة والقفطان والتكشيطة والإكسسوارات المغربية الأصيلة',
};

export const revalidate = 300;

export default async function ProductsPage({ searchParams }: { searchParams?: { q?: string } }) {
  const q = (searchParams?.q || '').trim();
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: [{ isBestSeller: 'desc' }, { createdAt: 'desc' }],
    }),
    prisma.category.findMany({ orderBy: { order: 'asc' }, include: { _count: { select: { products: true } } } }),
  ]);

  const allProducts = products
    .map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    originalPrice: p.compareAtPrice ?? undefined,
    image: p.image || '/products/placeholder.jpg',
    category: p.category?.name || '',
    badge: p.badge || undefined,
      rating: p.rating,
      reviews: p.reviewsCount,
    }))
    .filter((p) => (q ? p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase()) : true));

  return (
    <main className="flex-1">
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-16 lg:py-24">
        <div className="container-custom text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">جميع المنتجات</h1>
          <p className="text-white/90 max-w-2xl mx-auto text-lg">
            {q
              ? `نتائج البحث عن «${q}» — ${allProducts.length} منتج`
              : 'اكتشف تشكيلتنا الكاملة من الجلابة والقفطان والتكشيطة والإكسسوارات المغربية الأصيلة'}
          </p>
        </div>
      </section>

      <section className="py-12 bg-secondary-50">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl p-4 border border-secondary-100 sticky top-24">
                <h3 className="font-semibold text-primary-900 mb-4">الفئة</h3>
                <div className="space-y-2">
                  <Link href="/products" className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white">
                    <span>الكل</span>
                    <span className="bg-white/20 px-2 rounded-full text-xs">{allProducts.length}</span>
                  </Link>
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/categories/${c.id}`}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-secondary-700 hover:bg-secondary-50"
                    >
                      <span>{c.name}</span>
                      <span className="text-secondary-400 text-xs">{c._count.products}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <span>{allProducts.length} منتج</span>
                </div>
              </div>

              {allProducts.length === 0 ? (
                <div className="bg-white rounded-xl border border-secondary-100 p-16 text-center">
                  <p className="mb-4"><svg className="w-16 h-16 mx-auto text-secondary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg></p>
                  <h3 className="text-xl font-bold text-primary-900 mb-2">لا توجد منتجات بعد</h3>
                  <p className="text-secondary-500">سنضيف تشكيلتنا الكاملة قريباً — تابعونا على واتساب!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {allProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}