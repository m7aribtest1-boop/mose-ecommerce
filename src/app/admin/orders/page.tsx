'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type OrderStatus =
  | 'pending' | 'confirmation_required' | 'confirmed' | 'preparing' | 'shipped'
  | 'out_for_delivery' | 'delivered' | 'cancelled' | 'refused' | 'returned' | 'refunded';

const STATUS_LABELS: Record<string, string> = {
  pending: 'قيد الانتظار', confirmation_required: 'بانتظار التأكيد', confirmed: 'مؤكد',
  preparing: 'قيد التحضير', shipped: 'تم الشحن', out_for_delivery: 'قيد التوصيل',
  delivered: 'تم التسليم', cancelled: 'ملغي', refused: 'مرفوض', returned: 'مسترجع', refunded: 'مسترد',
};

const STATUS_ORDER: OrderStatus[] = [
  'pending', 'confirmation_required', 'confirmed', 'preparing', 'shipped', 'out_for_delivery', 'delivered',
];

const ALL_STATUSES: OrderStatus[] = [...STATUS_ORDER, 'cancelled', 'refused', 'returned', 'refunded'];

interface OrderItem {
  id: string; name: string; price: number; quantity: number; size?: string; color?: string;
}
interface Order {
  id: string; orderNumber: string; customerName: string; phone: string; email?: string;
  city: string; address?: string; notes?: string; status: OrderStatus; paymentMethod: string;
  paymentStatus: string; subtotal: number; shippingFee: number; discount: number; couponCode?: string;
  total: number; riskScore: number; codConfirmation: boolean; createdAt: string; items: OrderItem[];
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?status=${filter}&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (res.status === 401) { router.push('/admin/login'); return; }
      setOrders(data.orders || []);
    } catch { setError('خطأ في التحميل'); }
    finally { setLoading(false); }
  }, [filter, query, router]);

  useEffect(() => { load(); }, [load]);

  async function setStatus(id: string, status: OrderStatus | 'refund') {
    const body = status === 'refund' ? { id, action: 'refund' } : { id, status };
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) load();
    } catch {}
  }

  const fmt = (n: number) => `${n.toLocaleString('fr-MA')} درهم`;

  return (
    <main className="min-h-screen bg-secondary-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <Link href="/admin" className="text-sm text-primary-600 hover:underline">← اللوحة</Link>
            <h1 className="text-2xl font-bold text-primary-900 mt-1">إدارة الطلبات</h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-secondary-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="all">كل الحالات</option>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="بحث برقم الطلب / الاسم / الهاتف"
              className="border border-secondary-300 rounded-lg px-3 py-2 text-sm w-64"
            />
            <button onClick={load} className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm">تحديث</button>
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-600 rounded-lg px-4 py-2 mb-4">{error}</div>}
        {loading && <div className="text-secondary-500 py-10 text-center">جارٍ التحميل...</div>}

        <div className="space-y-3">
          {!loading && orders.map((o) => (
            <div key={o.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 flex flex-wrap items-center justify-between gap-3 cursor-pointer" onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
                <div>
                  <div className="font-bold text-primary-900">{o.orderNumber} <span className="text-secondary-500 font-normal text-sm">— {o.customerName}</span></div>
                  <div className="text-sm text-secondary-500">
                    {o.city} · {o.phone} · {new Date(o.createdAt).toLocaleDateString('fr-MA')}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {o.riskScore >= 50 && (
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full" title="طلب عالي الخطورة">⚠ خطر ({o.riskScore})</span>
                  )}
                  <span className="font-bold text-primary-600">{fmt(o.total)}</span>
                  <select
                    value={o.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)}
                    className="border border-secondary-300 rounded-lg px-2 py-1.5 text-sm bg-white"
                  >
                    {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                </div>
              </div>
              {expanded === o.id && (
                <div className="border-t border-secondary-200 p-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-primary-900 mb-2">المنتجات</h3>
                      <ul className="space-y-1 text-sm text-secondary-700">
                        {o.items.map((i) => (
                          <li key={i.id} className="flex justify-between">
                            <span>{i.name} {i.size && <span className="text-secondary-400">(مقاس {i.size})</span>} × {i.quantity}</span>
                            <span>{fmt(i.price * i.quantity)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="text-sm text-secondary-500 mt-3 space-y-1">
                        <div className="flex justify-between"><span>المجموع الفرعي</span><span>{fmt(o.subtotal)}</span></div>
                        <div className="flex justify-between"><span>الشحن</span><span>{o.shippingFee ? fmt(o.shippingFee) : 'مجاني'}</span></div>
                        {o.discount > 0 && <div className="flex justify-between text-green-600"><span>الخصم {o.couponCode && `(${o.couponCode})`}</span><span>-{fmt(o.discount)}</span></div>}
                        <div className="flex justify-between font-bold text-primary-900 pt-1 border-t"><span>المجموع</span><span>{fmt(o.total)}</span></div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary-900 mb-2">العميل والشحن</h3>
                      <div className="text-sm text-secondary-700 space-y-1">
                        <div><span className="text-secondary-500">الدفع:</span> <span className={`${o.paymentStatus === 'paid' ? 'text-green-600' : ''}`}>{o.paymentMethod} ({o.paymentStatus})</span></div>
                        <div><span className="text-secondary-500">العنوان:</span> {o.address || '—'}، {o.city}</div>
                        {o.notes && <div><span className="text-secondary-500">ملاحظات:</span> {o.notes}</div>}
                        {o.codConfirmation && <div className="text-green-600 mt-1">✓ تم تأكيده للعميل</div>}
                      </div>
                      <div className="flex gap-2 mt-4 flex-wrap">
                        <a
                          href={`https://wa.me/${o.phone.replace('+', '')}`}
                          target="_blank" rel="noreferrer"
                          className="bg-green-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-green-700"
                        >
                          واتساب العميل
                        </a>
                        {o.status === 'delivered' && (
                          <button
                            onClick={() => setStatus(o.id, 'refund')}
                            className="bg-accent-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-accent-700"
                          >
                            استرداد وإرجاع المخزون
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {!loading && orders.length === 0 && (
            <div className="bg-white rounded-xl p-10 text-center text-secondary-500">لا توجد طلبات في هذه الفئة</div>
          )}
        </div>
      </div>
    </main>
  );
}