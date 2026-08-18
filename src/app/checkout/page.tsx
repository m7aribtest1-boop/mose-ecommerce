'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import { storeConfig } from '@/lib/store';
import { track } from '@/lib/analytics';
import { PaymentMethods } from '@/components/PaymentMethods';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState({ customerName: '', phone: '', email: '', city: '', address: '', notes: '' });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState<{ valid: boolean; discount: number; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sizeConflicts, setSizeConflicts] = useState<string[]>([]);

  const discount = coupon?.valid ? coupon.discount : 0;
  const shipping = subtotal - discount >= storeConfig.shipping.freeShippingThreshold || subtotal === 0 ? 0 : storeConfig.shipping.standardFee;
  const total = subtotal - discount + shipping;

  useEffect(() => {
    setSizeConflicts(items.filter((i) => !i.size).map((i) => i.product.name));
  }, [items]);

  async function validateCoupon() {
    if (!couponCode.trim()) return setCoupon(null);
    const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(couponCode)}&subtotal=${subtotal}`);
    setCoupon(await res.json());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (sizeConflicts.length > 0) {
      setError(`يرجى اختيار المقاس للمنتجات التالية: ${sizeConflicts.join('، ')} — استخدم خيار "أضف للسلة" في صفحة المنتج.`);
      return;
    }
    setLoading(true);
    try {
      track('CHECKOUT_START', { itemCount: items.length });
      const payload = {
        ...form,
        paymentMethod,
        couponCode: coupon?.valid ? couponCode : '',
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
        })),
      };
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'تعذر تسجيل الطلب'); return; }
      clearCart();
      sessionStorage.setItem('mose-last-order', JSON.stringify(data.order));
      router.push('/orders/success');
    } catch {
      setError('خطأ في الاتصال — أعد المحاولة');
    } finally { setLoading(false); }
  }

  if (items.length === 0) {
    return (
      <main className="flex-1 bg-secondary-50 py-20">
        <div className="container-custom max-w-lg text-center">
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="text-2xl font-bold mb-3">سلتك فارغة</h1>
          <Link href="/products" className="btn-primary inline-block px-10 py-4">تصفح المنتجات</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-12">
        <div className="container-custom text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">إتمام الطلب</h1>
          <p className="text-white/80 mt-2">الدفع عند الاستلام ✓ تأكيد عبر واتساب ✓ توصيل 24-72 ساعة</p>
        </div>
      </section>

      <section className="py-12 bg-secondary-50">
        <div className="container-custom max-w-4xl">
          {sizeConflicts.length > 0 && (
            <div className="bg-accent-50 border border-accent-300 text-accent-800 rounded-lg p-4 mb-6 text-sm">
              ⚠ بعض المنتجات في سلتك بدون مقاس محدد: <b>{sizeConflicts.join('، ')}</b> — يمكنك المتابعة، وسنتواصل معك لتأكيد المقاس.
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="card p-6 mb-6">
              <h2 className="text-xl font-bold text-primary-900 mb-6">معلومات الشحن</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">الاسم الكامل *</label>
                  <input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="input-field" placeholder="الاسم الكامل" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">رقم الهاتف *</label>
                  <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="input-field" placeholder="06 XX XX XX XX" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-1">البريد الإلكتروني</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field" placeholder="example@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">المدينة *</label>
                  <select required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field">
                    <option value="">اختر المدينة</option>
                    <option>الدار البيضاء</option><option>الرباط</option><option>مراكش</option>
                    <option>فاس</option><option>طنجة</option><option>أكادير</option>
                    <option>مكناس</option><option>وجدة</option><option>القنيطرة</option><option>تطوان</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">العنوان / الحي</label>
                  <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="input-field" placeholder="الحي والشارع" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-1">ملاحظات (اختياري)</label>
                  <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="input-field" placeholder="مثال: اتصلوا قبل التوصيل" />
                </div>
              </div>
            </div>

            <div className="card p-6 mb-6">
              <h2 className="text-xl font-bold text-primary-900 mb-6">طرق الدفع</h2>
              <PaymentMethods className="mb-6" />
              <div className="space-y-3">
                {[
                  { id: 'COD', title: 'الدفع عند الاستلام', desc: 'ادفع نقداً عند استلام طلبك — الأكثر استعمالاً في المغرب' },
                  { id: 'CMI', title: 'بطاقة بنكية (CMI)', desc: 'بدفع آمن عبر البوابة الإلكترونية' },
                  { id: 'CASH_PLUS', title: 'الدفع نقداً في وكالة Cash Plus', desc: 'ادفع عبر وكالة بشركة كاش بلس' },
                  { id: 'BANK_TRANSFER', title: 'تحويل بنكي', desc: 'للطلبات الكبيرة والدياسبورا' },
                ].map((p) => (
                  <label key={p.id}
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${paymentMethod === p.id ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-primary-300'}`}>
                    <input type="radio" name="payment" checked={paymentMethod === p.id}
                      onChange={() => setPaymentMethod(p.id)} className="w-4 h-4 text-primary-600" />
                    <div>
                      <div className="font-medium text-primary-900">{p.title}</div>
                      <div className="text-sm text-secondary-500">{p.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
                📞 سيتم تأكيد طلبك هاتفياً أو عبر واتساب قبل الشحن — حماية من الطلبات الوهمية وضمان وصولك.
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-bold text-primary-900 mb-4">المنتجات</h2>
              <div className="space-y-2 text-sm mb-4">
                {items.map((i) => (
                  <div key={`${i.product.id}-${i.size}`} className="flex justify-between text-secondary-700">
                    <span>{i.product.name} {i.size && <span className="text-secondary-400">(مقاس {i.size})</span>} × {i.quantity}</span>
                    <span>{formatPrice(i.product.price * i.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mb-4">
                <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)}
                  className="input-field flex-1" placeholder="كود الخصم (مثال: MARHABA10)" />
                <button type="button" onClick={validateCoupon} className="btn-outline px-5">تطبيق</button>
              </div>
              {coupon && (coupon.valid
                ? <div className="text-accent-600 text-sm mb-4">✓ الكود صالح — خصم {formatPrice(coupon.discount)}</div>
                : <div className="text-primary-600 text-sm mb-4">{coupon.error}</div>)}

              <div className="space-y-2 text-sm border-t border-secondary-200 pt-4">
                <div className="flex justify-between text-secondary-600"><span>المجموع الفرعي</span><span>{formatPrice(subtotal)}</span></div>
                {discount > 0 && <div className="flex justify-between text-accent-600"><span>الخصم</span><span>-{formatPrice(discount)}</span></div>}
                <div className="flex justify-between text-secondary-600">
                  <span>الشحن</span>
                  <span>{shipping === 0 ? 'مجاني' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-primary-900 pt-2">
                  <span>المجموع</span><span className="text-primary-600">{formatPrice(total)}</span>
                </div>
              </div>

              {error && <div className="bg-primary-50 text-primary-600 rounded-lg p-3 text-sm mt-4">{error}</div>}

              <button type="submit" disabled={loading}
                className="btn-primary w-full py-4 text-lg mt-6 disabled:opacity-50">
                {loading ? 'جارٍ تسجيل الطلب...' : `تأكيد الطلب — ${formatPrice(total)}`}
              </button>
              <p className="text-center text-xs text-secondary-500 mt-3">
                بتأكيد الطلب أنت توافق على <Link href="/terms" className="underline">شروط الاستخدام</Link> و<Link href="/privacy" className="underline">سياسة الخصوصية</Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}