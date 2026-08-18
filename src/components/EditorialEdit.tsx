import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';

export interface EditProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  badge?: string;
  rating: number;
  reviews: number;
}

export function EditorialEdit({
  eyebrow,
  title,
  description,
  href,
  products,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  products: EditProduct[];
}) {
  return (
    <section className="py-16 bg-ivory">
      <div className="container-custom">
        <div className="max-w-2xl mb-8">
          <span className="eyebrow block mb-2">{eyebrow}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-3">{title}</h2>
          <p className="text-secondary-600 leading-relaxed">{description}</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="mt-8">
          <Link href={href} className="btn-outline px-7 py-3">
            اكتشفي الإصدار
          </Link>
        </div>
      </div>
    </section>
  );
}
