'use client';

import { MessageCircle } from 'lucide-react';
import { storeConfig } from '@/lib/store';

export default function FloatingWhatsApp() {
  const message = encodeURIComponent('السلام عليكم، أريد الاستفسار عن منتجاتكم في متجر MOSE');
  const href = `https://wa.me/${storeConfig.whatsapp.number}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-6 left-6 z-50 flex items-center gap-3"
      aria-label="تواصل معنا عبر واتساب"
    >
      <span
        className="max-w-0 overflow-hidden whitespace-nowrap rounded-full bg-primary-900/90 px-0 py-2
                   font-arabic text-sm text-ivory opacity-0 shadow-md transition-all duration-300
                   group-hover:max-w-xs group-hover:px-4 group-hover:opacity-100"
      >
        تواصل واتساب
      </span>
      <span
        className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-500 text-ivory
                   shadow-lg ring-2 ring-accent-300/60 transition-transform duration-200
                   hover:scale-105 hover:bg-accent-600"
      >
        <MessageCircle className="h-6 w-6" strokeWidth={2} />
      </span>
    </a>
  );
}
