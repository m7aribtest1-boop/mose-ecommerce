'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import { storeConfig } from '@/lib/store';
import { track } from '@/lib/analytics';

interface Variant { id: string; size: string; color?: string | null; stock: number; price?: number | null; sku: string; }
export interface BuyProps {
  product: {
    id: string; name: string; price: number; compareAtPrice?: number;
    description?: string; image?: string; variants: Variant[];
  };
}

export default function BuyBox({ product }: BuyProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');

  const variant = product.variants.find((v) => v.size === selectedSize);
  const outOfStock = selectedSize === '' ? false : !variant || variant.stock <= 0;
  const remaining = selectedSize ? (variant?.stock ?? 0) : 0;

  useEffect(() => {
    track('PRODUCT_VIEW', { productId: product.id });
  }, [product.id]);

  function handleAdd() {
    if (!selectedSize) { setError('الرجاء اختيار المقاس'); return; }
    if (outOfStock) { setError('هذا المقاس غير متوفر حالياً'); return; }
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.compareAtPrice || undefined,
        image: product.image || '/products/placeholder.jpg',
        category: '',
        rating: 0,
        reviews: 0,
      },
      quantity,
      selectedSize
    );
    track('ADD_TO_CART', { productId: product.id, size: selectedSize });
    setAdded(true); setError('');
    setTimeout(() => setAdded(false), 2500);
  }

  function handleBuyNow() {
    if (!selectedSize) { setError('الرجاء اختيار المقاس'); return; }
    handleAdd();
    setTimeout(() => router.push('/checkout'), 800);
  }

  const waMessage = `سلام، عجبني المنتج: ${product.name}${selectedSize ? ` (مقاس ${selectedSize})` : ''} — سعره ${product.price} درهم فمتجر موسى.`;

  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div id="buy-box">
      <div className="flex items-baseline gap-3 mb-6">
        <span className="text-3xl font-bold text-primary-600">{formatPrice(product.price)}</span>
        {discount > 0 && (
          <>
            <span className="text-lg text-secondary-400 line-through">{formatPrice(product.compareAtPrice!)}</span>
            <span className="bg-primary-50 text-primary-700 text-xs font-bold px-2 py-1 rounded-full">-{discount}%</span>
          </>
        )}
      </div>

      <div className="border-t border-secondary-200 pt-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-primary-900">اختر المقاس</h3>
          <Link href="/size-guide" className="text-sm text-primary-600 underline">دليل المقاسات 📏</Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((v) => (
            <button
              key={v.id}
              onClick={() => { setSelectedSize(v.size); setError(''); }}
              disabled={v.stock <= 0}
              className={`px-5 py-3 text-sm font-medium rounded-lg border-2 transition-all ${
                v.stock <= 0
                  ? 'bg-secondary-100 border-secondary-200 text-secondary-400 line-through cursor-not-allowed'
                  : selectedSize === v.size
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white border-secondary-300 text-secondary-700 hover:border-primary-600'
              }`}
            >
              {v.size}
              {v.stock > 0 && v.stock <= 2 && <span className="block text-[10px] font-normal">فقط {v.stock} متبقي</span>}
            </button>
          ))}
        </div>
        <Link
          href={`https://wa.me/${storeConfig.whatsapp.number}?text=${encodeURIComponent(`السلام عليكم، بغيت المساعدة فـ المقاس ديال: ${product.name}`)}`}
          target="_blank" rel="noreferrer"
          onClick={() => track('WHATSAPP_CLICK', { productId: product.id })}
          className="text-sm text-accent-600 hover:underline mt-2 inline-block"
        >
          متأكدة من المقاس؟ 💬 راسلينا طولك ووزنك على واتساب
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <label className="font-medium text-primary-900">الكمية:</label>
        <div className="flex items-center border border-secondary-300 rounded-lg">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-secondary-100">−</button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <button onClick={() => setQuantity(Math.min(remaining || 50, quantity + 1))} className="px-4 py-2 hover:bg-secondary-100">+</button>
        </div>
      </div>

      {error && <div className="bg-primary-50 text-primary-600 text-sm rounded-lg p-3 mb-4">{error}</div>}
      {added && <div className="bg-accent-50 text-accent-700 text-sm rounded-lg p-3 mb-4">✓ تمت الإضافة إلى السلة</div>}

      <div className="flex gap-3 mb-5">
        <button onClick={handleBuyNow} className="flex-1 btn-primary py-4 text-lg">اشترِ الآن</button>
        <a
          href={`https://wa.me/${storeConfig.whatsapp.number}?text=${encodeURIComponent(waMessage)}`}
          target="_blank" rel="noreferrer"
          onClick={() => track('WHATSAPP_CLICK', { productId: product.id })}
          className="flex-1 btn-outline py-4 text-lg rounded-xl flex items-center justify-center transition"
        >
          💬 واتساب
        </a>
      </div>
      <button onClick={handleAdd} className="w-full btn-outline py-3 mb-5">أضف للسلة</button>

      {selectedSize && remaining > 0 && (
        <div className="flex items-center gap-2 text-accent-600 text-sm mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>متوفر — شحن 24-72 ساعة حسب المدينة</span>
        </div>
      )}

      <div className="border-t border-secondary-200 pt-5">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-secondary-700">🚚 <span>توصيل 24-72 ساعة</span></div>
          <div className="flex items-center gap-2 text-secondary-700">💵 <span>الدفع عند الاستلام</span></div>
          <div className="flex items-center gap-2 text-secondary-700">🔄 <span>إرجاع خلال 7 أيام</span></div>
          <div className="flex items-center gap-2 text-secondary-700">💬 <span>تأكيد عبر واتساب</span></div>
        </div>
      </div>
    </div>
  );
}