'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Variant { id: string; size: string; stock: number; sku: string; }
interface Product {
  id: string; name: string; slug: string; price: number; compareAtPrice?: number;
  category?: { name: string } | null; badge?: string; inStock: boolean;
  isBestSeller: boolean; isNew: boolean; isFeatured: boolean; variants: Variant[];
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', price: '', compareAtPrice: '', description: '', image: '',
    material: '', care: '', categoryId: '', badge: '', sizes: 'S,M,L,XL,XXL', stock: '10',
    isBestSeller: false, isNew: false,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      if (res.status === 401) { router.push('/admin/login'); return; }
      const data = await res.json();
      setProducts(data.products || []);
    } catch {} finally { setLoading(false); }
  }, [router]);

  useEffect(() => { load(); }, [load]);

  const totalStock = (p: Product) => p.variants.reduce((s, v) => s + v.stock, 0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
          sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      });
      if (res.ok) { setShowForm(false); load(); }
    } catch {}
  }

  return (
    <main className="min-h-screen bg-secondary-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/admin" className="text-sm text-primary-600 hover:underline">← اللوحة</Link>
            <h1 className="text-2xl font-bold text-primary-900 mt-1">المنتجات والمخزون</h1>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm">
            {showForm ? 'إلغاء' : '+ منتج جديد'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={submit} className="bg-white rounded-xl shadow-sm p-6 mb-6 grid md:grid-cols-3 gap-4">
            <input required placeholder="اسم المنتج" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border border-secondary-300 rounded-lg px-3 py-2 text-sm" />
            <input required placeholder="السعر (درهم)" type="number" value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="border border-secondary-300 rounded-lg px-3 py-2 text-sm" />
            <input placeholder="السعر قبل الخصم (اختياري)" type="number" value={form.compareAtPrice}
              onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
              className="border border-secondary-300 rounded-lg px-3 py-2 text-sm" />
            <input placeholder="صورة (/products/...) (اختياري)" value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="border border-secondary-300 rounded-lg px-3 py-2 text-sm" />
            <input placeholder="الخامة (اختياري)" value={form.material}
              onChange={(e) => setForm({ ...form, material: e.target.value })}
              className="border border-secondary-300 rounded-lg px-3 py-2 text-sm" />
            <input placeholder="المقاسات مفصولة بفاصلة" value={form.sizes}
              onChange={(e) => setForm({ ...form, sizes: e.target.value })}
              className="border border-secondary-300 rounded-lg px-3 py-2 text-sm" />
            <input placeholder="مخزون لكل مقاس" type="number" value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="border border-secondary-300 rounded-lg px-3 py-2 text-sm" />
            <select value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="border border-secondary-300 rounded-lg px-3 py-2 text-sm">
              <option value="">بدون فئة</option>
              <option value="jellaba">الجلابة</option>
              <option value="qaftan">القفطان</option>
              <option value="takchita">التكشيطة</option>
              <option value="accessories">الإكسسوارات</option>
            </select>
            <input placeholder="شارة (اختياري)" value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
              className="border border-secondary-300 rounded-lg px-3 py-2 text-sm" />
            <div className="flex items-center gap-4 text-sm">
              <label className="flex items-center gap-1"><input type="checkbox" checked={form.isBestSeller} onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })} /> الأكثر مبيعاً</label>
              <label className="flex items-center gap-1"><input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} /> جديد</label>
            </div>
            <textarea placeholder="الوصف (اختياري)" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border border-secondary-300 rounded-lg px-3 py-2 text-sm md:col-span-2" rows={2} />
            <button type="submit" className="bg-green-600 text-white rounded-lg px-4 py-2 text-sm self-end">حفظ المنتج</button>
          </form>
        )}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary-50 text-secondary-600">
              <tr>
                <th className="text-right px-4 py-3">المنتج</th>
                <th className="text-right px-4 py-3">الفئة</th>
                <th className="text-right px-4 py-3">السعر</th>
                <th className="text-right px-4 py-3">المخزون الإجمالي</th>
                <th className="text-right px-4 py-3">الوضع</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-secondary-100">
                  <td className="px-4 py-3">
                    <div className="font-medium text-primary-900">{p.name}</div>
                    <div className="text-xs text-secondary-400">{p.slug}{p.badge && ` · ${p.badge}`}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {p.variants.map((v) => (
                        <span key={v.id} className={`text-xs px-1.5 py-0.5 rounded ${v.stock <= 2 ? 'bg-red-100 text-red-700' : 'bg-secondary-100 text-secondary-600'}`}>
                          {v.size}: {v.stock}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-secondary-600">{p.category?.name || '—'}</td>
                  <td className="px-4 py-3">{p.price.toLocaleString('fr-MA')} درهم</td>
                  <td className="px-4 py-3">
                    <span className={totalStock(p) <= 10 ? 'text-red-600 font-semibold' : 'text-primary-900'}>{totalStock(p)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${p.inStock ? 'bg-green-100 text-green-700' : 'bg-secondary-200 text-secondary-500'}`}>
                      {p.inStock ? 'متوفر' : 'غير متوفر'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}