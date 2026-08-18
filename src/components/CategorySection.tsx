import Image from 'next/image';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  count: number;
}

interface CategorySectionProps {
  categories: Category[];
}

const friendlyNames: Record<string, { name: string; description: string }> = {
  'قفطان': { name: 'قفطان المناسبات', description: 'للعرس، العقيقة، وكل ليلة تستاهل تلبسي فيها أجمل ما عندك.' },
  'جلابة': { name: 'جلابة كل يوم', description: 'مريحة، أنيقة، وتعيش معاك من الصباح للمساء.' },
  'تكشيطة': { name: 'تكشيطة العُرس', description: 'قطعتين ولا أروع — لليلة العمر أو ليلة أختك.' },
  'إكسسوارات': { name: 'بلغة وإكسسوارات', description: 'اللمسة اللي كتكمّل اللوك: بلغة، حزام، وعطّار.' },
};

function friendly(category: Category) {
  const key = Object.keys(friendlyNames).find((k) => category.name.includes(k));
  if (key) return friendlyNames[key];
  return { name: category.name, description: category.description };
}

export function CategorySection({ categories }: CategorySectionProps) {
  return (
    <section className="py-16 bg-secondary-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary-900 mb-4">تسوق حسب الفئة</h2>
          <p className="text-secondary-600 max-w-2xl mx-auto">
            من الجلابة التقليدية إلى القفطان الفاخر، اكتشف تشكيلاتنا المتنوعة المصنوعة بحرفية مغربية أصيلة
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const f = friendly(category);
            return (
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
                  loading="lazy"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-accent-300 transition-colors">
                    {f.name}
                  </h3>
                  <p className="text-white/80 text-sm line-clamp-2">{f.description}</p>
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
          );
          })}
        </div>
      </div>
    </section>
  );
}
