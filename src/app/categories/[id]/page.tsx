import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ProductCard } from '@/components/ProductCard';

export const revalidate = 300;

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = await prisma.category.findFirst({ where: { OR: [{ id: params.id }, { slug: params.id }] } });
  if (!category) return { title: 'الفئة غير موجودة' };
  return { title: `${category.name} | متجر موسى`, description: category.description || undefined };
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const category = await prisma.category.findFirst({ where: { OR: [{ id: params.id }, { slug: params.id }] } });
  if (!category) notFound();

  const products = await prisma.product.findMany({
    where: { categoryId: category.id },
    include: { category: true },
    orderBy: [{ isBestSeller: 'desc' }, { createdAt: 'desc' }],
  });

  return (
    <main className="flex-1">
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-16 lg:py-24">
        <div className="container-custom text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{category.name}</h1>
          <p className="text-white/90 max-w-2xl mx-auto text-lg">{category.description}</p>
          <p className="text-white/70 mt-2">{products.length} منتج متاح</p>
        </div>
      </section>
      <section className="py-12 bg-secondary-50">
        <div className="container-custom">
          {products.length === 0 ? (
            <div className="bg-white rounded-xl border border-secondary-100 p-16 text-center">
              <p className="text-4xl mb-4">🧵</p>
              <h3 className="text-xl font-bold text-primary-900 mb-2">لا توجد منتجات في هذه الفئة بعد</h3>
              <p className="text-secondary-500">تابعنا على واتساب ليصلك كل جديد أولاً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    originalPrice: product.compareAtPrice ?? undefined,
                    image: product.image || '/products/placeholder.jpg',
                    category: product.category?.name || '',
                    badge: product.badge || undefined,
                    rating: product.rating,
                    reviews: product.reviewsCount,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}