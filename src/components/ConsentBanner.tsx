'use client';

import { useEffect, useState } from 'react';
import { getConsent, setConsent } from '@/lib/analytics';

export default function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (getConsent() === null) setShow(true);
  }, []);

  function decide(value: 'granted' | 'denied') {
    setConsent(value);
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] flex justify-center px-3 pb-3">
      <div className="w-full max-w-3xl rounded-xl border border-encre/10 bg-encre/95 px-4 py-3 text-cream shadow-2xl backdrop-blur sm:flex sm:items-center sm:gap-4">
        <p className="flex-1 text-sm leading-relaxed text-cream/90">
          نستعمل كوكيز تحليلية مجهولة المصدر (بلا معلومات شخصية) باش نحسّنو تجربتك فـ متجر موسى.
          الموافقة اختيارية و يمكنك رفضها.
        </p>
        <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">
          <button
            onClick={() => decide('denied')}
            className="rounded-lg border border-cream/30 px-4 py-2 text-sm text-cream/80 transition hover:bg-cream/10"
          >
            رفض
          </button>
          <button
            onClick={() => decide('granted')}
            className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-encre transition hover:bg-gold/90"
          >
            موافقة
          </button>
        </div>
      </div>
    </div>
  );
}
