'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/data';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { items, count, subtotal, shipping, total, updateQuantity, removeItem } = useCart();
  const savings = items.reduce(
    (sum, item) => sum + Math.max(0, (item.product.originalPrice ?? item.product.price) - item.product.price) * item.quantity,
    0
  );
  const toFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  if (items.length === 0) {
    return (
      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-12 lg:py-16">
          <div className="container-custom text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">سلة التسوق</h1>
          </div>
        </section>
        <section className="py-20 bg-secondary-50">
          <div className="container-custom max-w-lg text-center">
            <div className="text-6xl mb-6">🛒</div>
            <h2 className="text-2xl font-bold text-primary-900 mb-3">سلتك فارغة</h2>
            <p className="text-secondary-600 mb-8">اكتشف تشكيلتنا من الجلابة والقفطان المغربي الأصيل</p>
            <Link href="/products" className="btn-primary px-10 py-4 inline-block">تصفح المنتجات</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-12 lg:py-16">
        <div className="container-custom text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">سلة التسوق</h1>
          <p className="text-white/80">{count} منتج في سلتك</p>
        </div>
      </section>

      <section className="py-12 bg-secondary-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}-${item.color}`} className="card p-4 flex flex-col sm:flex-row gap-4">
                  <div className="relative w-full sm:w-24 h-32 sm:h-24 bg-secondary-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <Link href={`/products/${item.product.id}`} className="font-semibold text-primary-900 hover:text-primary-600">
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-secondary-500 mt-1">
                          {[item.size, item.color].filter(Boolean).join(' - ')}
                        </p>
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-primary-600">{formatPrice(item.product.price)}</div>
                        {item.product.originalPrice && (
                          <div className="text-sm text-secondary-400 line-through">{formatPrice(item.product.originalPrice)}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center border border-secondary-300 rounded-lg">
                        <button
                          className="px-3 py-1.5 hover:bg-secondary-100"
                          aria-label="إنقاص"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size, item.color)}
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          className="px-3 py-1.5 hover:bg-secondary-100"
                          aria-label="زيادة"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size, item.color)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="text-sm text-primary-600 hover:underline"
                        onClick={() => removeItem(item.product.id, item.size, item.color)}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h2 className="text-xl font-bold text-primary-900 mb-6">ملخص الطلب</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-secondary-600">
                    <span>المجموع الفرعي</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-accent-600 font-medium">
                      <span>التوفير</span>
                      <span>-{formatPrice(savings)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-secondary-600">
                    <span>الشحن</span>
                    <span>{shipping === 0 ? 'مجاني' : formatPrice(shipping)}</span>
                  </div>
                  {toFreeShipping > 0 && (
                    <div className="bg-primary-50 text-primary-700 px-3 py-2 rounded-lg text-xs">
                      أضف {formatPrice(toFreeShipping)} للحصول على شحن مجاني
                    </div>
                  )}
                  <div className="border-t border-secondary-200 pt-3 flex justify-between font-bold text-primary-900">
                    <span>المجموع</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                <Link href="/checkout" className="btn-primary w-full mt-6 py-4 text-center block">
                  إتمام الطلب
                </Link>
                <Link href="/products" className="btn-outline w-full mt-3 py-3 text-center block">
                  متابعة التسوق
                </Link>
                <div className="mt-4 flex justify-center gap-3 text-xs text-secondary-500">
                  <span className="bg-secondary-100 px-2 py-1 rounded">الدفع عند الاستلام</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
