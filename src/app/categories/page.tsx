import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { prisma } from '@/lib/db';

export const metadata: Metadata = {
  title: 'الفئات',
  description: 'استكشف تشكيلاتنا المتنوعة من الجلابة، القفطان، التكشيطة والإكسسوارات المغربية الأصيلة',
};

export const revalidate = 300;

export default async function CategoriesPage() {
  const allCategories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { products: true } } },
  });

  const categories = allCategories.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description || '',
    image: c.image || '/categories/jellaba.jpg',
    count: c._count.products,
  }));
  return (
    <main className="flex-1">
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-16 lg:py-24">
        <div className="container-custom text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">فئات المنتجات</h1>
          <p className="text-white/90 max-w-2xl mx-auto text-lg">
            استكشف تشكيلاتنا المتنوعة من الجلابة، القفطان، التكشيطة والإكسسوارات المغربية الأصيلة
          </p>
        </div>
      </section>

      <section className="py-16 bg-secondary-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, i) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="group card overflow-hidden h-full"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    loading={i === 0 ? undefined : 'lazy'}
                    priority={i === 0}
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-accent-300 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-white/80 text-sm line-clamp-2">{category.description}</p>
                    <div className="mt-4 flex items-center gap-3">
                      <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                        {category.count} منتج
                      </span>
                      <span className="inline-flex items-center gap-1 text-white/90 group-hover:translate-x-1 transition-transform">
                        استكشف
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
