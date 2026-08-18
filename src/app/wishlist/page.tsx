'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/hooks/useWishlist';
import { formatPrice } from '@/lib/utils';

interface Prod {
  id: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  image: string | null;
  category?: { name: string } | null;
}

export default function WishlistPage() {
  const { ids, ready, remove } = useWishlist();
  const [products, setProducts] = useState<Prod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    if (ids.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    fetch('/api/products?limit=100')
      .then((r) => r.json())
      .then((d) => {
        if (!active) return;
        const all: Prod[] = (d.products || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          compareAtPrice: p.compareAtPrice ?? null,
          image: p.image,
          category: p.category,
        }));
        setProducts(all.filter((p) => ids.includes(p.id)));
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [ids, ready]);

  return (
    <main className="flex-1 bg-secondary-50 py-12">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-primary-900">قائمة المفضلة</h1>
          <Link href="/products" className="text-primary-600 font-medium hover:underline text-sm">
            ← تصفّح المنتجات
          </Link>
        </div>

        {!ready || loading ? (
          <p className="text-secondary-600">جارٍ التحميل...</p>
        ) : products.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-secondary-600 mb-4">قائمة المفضلة فارغة.</p>
            <Link href="/products" className="btn-primary px-6 py-2.5 text-sm">
              اكتشف منتجاتنا
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="card overflow-hidden group">
                <div className="relative aspect-[3/4] bg-secondary-100">
                  <Link href={`/products/${p.id}`} className="absolute inset-0">
                    <Image
                      src={p.image || '/products/placeholder.jpg'}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </Link>
                  <button
                    onClick={() => remove(p.id)}
                    className="absolute top-3 left-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 shadow border border-secondary-200 text-secondary-700 hover:text-red-600"
                    aria-label="إزالة"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-4">
                  <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                    {p.category?.name || ''}
                  </span>
                  <Link href={`/products/${p.id}`}>
                    <h3 className="font-semibold text-primary-900 mt-2 hover:text-primary-600">{p.name}</h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-primary-900">{formatPrice(p.price)}</span>
                    {p.compareAtPrice && (
                      <span className="text-sm text-secondary-400 line-through">{formatPrice(p.compareAtPrice)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
