'use client';

import Link from 'next/link';

export default function HomeMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-accent-300/70 bg-ivory/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_35px_rgba(2,44,34,0.15)] backdrop-blur-md md:hidden">
      <div className="mx-auto flex max-w-lg items-center gap-2">
        <Link
          href="/products"
          className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-primary-800 px-4 py-3 font-arabic text-sm font-bold text-ivory shadow-sm transition-colors hover:bg-primary-900"
        >
          تسوّق الآن
        </Link>
        <Link
          href="/cart"
          aria-label="السلة"
          className="inline-flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-xl border border-accent-400 bg-accent-50 text-primary-800 transition-colors hover:bg-accent-100"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
