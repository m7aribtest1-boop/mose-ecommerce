'use client';

import { MessageCircle, ShoppingBag } from 'lucide-react';
import { useCallback } from 'react';
import { storeConfig } from '@/lib/store';

interface StickyMobileBuyBarProps {
  price: number;
  productName?: string;
}

export default function StickyMobileBuyBar({
  price,
  productName = 'المنتج',
}: StickyMobileBuyBarProps) {
  const handleBuyNow = useCallback(() => {
    const buyBox = document.getElementById('buy-box');
    if (buyBox) {
      buyBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const whatsappNumber = storeConfig.whatsapp.number;
  const whatsappMessage = encodeURIComponent(`السلام عليكم، أريد الاستفسار عن ${productName}.`);
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${whatsappMessage}`
    : '#';

  const formattedPrice = new Intl.NumberFormat('ar-MA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);

  return (
    <div
      dir="rtl"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-accent-300/80 bg-ivory/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_35px_rgba(2,44,34,0.15)] backdrop-blur-md md:hidden"
    >
      <div className="mx-auto flex max-w-lg items-center gap-2">
        <div className="min-w-0 flex-1">
          <span className="block font-arabic text-xs text-primary-900/60">السعر</span>
          <span className="block truncate font-arabic text-lg font-bold text-primary-900">
            {formattedPrice} د.م.
          </span>
        </div>

        <button
          type="button"
          onClick={handleBuyNow}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary-800 px-4 py-3 font-arabic text-sm font-bold text-ivory shadow-sm transition-colors hover:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
        >
          <ShoppingBag className="h-5 w-5" aria-hidden="true" />
          <span>اشتري الآن</span>
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`تواصل عبر واتساب بخصوص ${productName}`}
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent-400 bg-accent-50 text-primary-800 transition-colors hover:bg-accent-100 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
