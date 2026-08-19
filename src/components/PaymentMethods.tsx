export function PaymentMethods({ className = '' }: { className?: string }) {
  const methods = [
    { label: 'الدفع عند الاستلام', icon: '💵' },
  ];
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {methods.map((m) => (
        <span
          key={m.label}
          className="inline-flex items-center gap-1.5 rounded-lg border border-secondary-300 bg-white px-3 py-1.5 text-xs font-semibold text-primary-800"
        >
          <span aria-hidden="true">{m.icon}</span>
          {m.label}
        </span>
      ))}
    </div>
  );
}
