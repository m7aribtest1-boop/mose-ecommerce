'use client';

export default function AnnouncementBar() {
  return (
    <div className="w-full bg-primary-900 py-1.5 text-center text-ivory/80 border-b border-white/10">
      <p className="font-sans text-xs tracking-[0.15em] uppercase">
        أول طلب؟ خصم <span className="text-accent-400 font-bold">10%</span> بكود{' '}
        <span className="text-accent-400 font-bold">MARHABA10</span>
        {' '}· توصيل مجاني فوق <span className="text-accent-400">500 درهم</span>
        {' '}· الدفع عند الاستلام
      </p>
    </div>
  );
}
