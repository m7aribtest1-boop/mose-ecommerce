'use client';

import { useState } from 'react';

export function ProductGallery({
  images,
  name,
  primaryImage,
  badge,
}: {
  images: string[];
  name: string;
  primaryImage: string;
  badge?: string | null;
}) {
  const all = images.length ? images : [primaryImage];
  const [active, setActive] = useState(0);
  const src = all[active] || primaryImage;

  return (
    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-secondary-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={name} className="w-full h-full object-cover img-reveal" />
      {badge && (
        <div className="absolute top-4 right-4 bg-primary-600 text-white text-sm font-medium px-3 py-1 rounded-full">
          {badge}
        </div>
      )}
      {all.length > 1 && (
        <div className="absolute bottom-3 inset-x-3 flex justify-center gap-2">
          {all.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`الصورة ${i + 1}`}
              className={`w-14 h-16 rounded-lg overflow-hidden border-2 transition ${active === i ? 'border-accent-500' : 'border-white/70 hover:border-accent-300'}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}