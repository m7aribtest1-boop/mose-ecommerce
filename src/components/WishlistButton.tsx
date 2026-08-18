'use client';
import { useWishlist } from '@/hooks/useWishlist';

export function WishlistButton({ productId, className = '' }: { productId: string; className?: string }) {
  const { has, toggle } = useWishlist();
  const active = has(productId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      aria-label={active ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
      title={active ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
      className={`flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm border border-secondary-200 text-secondary-700 hover:text-primary-600 hover:border-primary-300 transition ${className}`}
    >
      <svg
        className={`w-5 h-5 ${active ? 'text-primary-600' : 'text-secondary-500'}`}
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
