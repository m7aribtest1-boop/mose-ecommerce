import { storeConfig } from '@/lib/store';

const items = [
  { icon: 'truck', label: 'توصيل سريع لكل المغرب' },
  { icon: 'cash', label: 'الدفع عند الاستلام' },
  { icon: 'refresh', label: `إرجاع خلال ${storeConfig.returns.windowDays} أيام` },
  { icon: 'shield', label: 'تأكيد عبر واتساب' },
  { icon: 'star', label: 'تقييمات موثّقة' },
];

function Icon({ name }: { name: string }) {
  const common = 'w-5 h-5';
  switch (name) {
    case 'truck':
      return (
        <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17a3 3 0 100-6 3 3 0 000 6zm0 0h8m0 0a3 3 0 100-6 3 3 0 000 6zm0 0l3-3m-3 3l-3-3M3 7h9l3 4v6" />
        </svg>
      );
    case 'cash':
      return (
        <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m6 0h2M5 7h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" />
        </svg>
      );
    case 'refresh':
      return (
        <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 9a8 8 0 0114-3M20 15a8 8 0 01-14 3" />
        </svg>
      );
    case 'shield':
      return (
        <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
        </svg>
      );
    case 'star':
      return (
        <svg className={common} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.302 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    default:
      return null;
  }
}

export function TrustBadges({ className = '' }: { className?: string }) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 ${className}`}>
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-2 text-sm text-secondary-700 bg-secondary-50 border border-secondary-100 rounded-lg px-3 py-2">
          <span className="text-primary-600">{Icon({ name: it.icon })}</span>
          <span className="leading-tight">{it.label}</span>
        </div>
      ))}
    </div>
  );
}

export default TrustBadges;
