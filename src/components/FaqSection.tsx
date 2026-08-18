'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'كيف أختار المقاس المناسب لي؟',
    a: 'كل منتج يأتي بمقاسات من S إلى XXL. يمكنك الاطلاع على دليل المقاسات الخاص بنا، وفي حال احتجتِ مساعدة إضافية نحن متوفرون عبر واتساب لمساعدتك في اختيار المقاس المثالي.',
  },
  {
    q: 'كم تستغرق مدة التوصيل؟',
    a: 'التوصيل داخل الدار البيضاء يتم خلال 24 إلى 48 ساعة، وباقي المدن الكبرى خلال 48 إلى 72 ساعة. يمكنك الدفع عند الاستلام في جميع أنحاء المغرب.',
  },
  {
    q: 'هل الدفع عند الاستلام متاح؟',
    a: 'نعم، نوفر خدمة الدفع عند الاستلام لجميع الطلبات داخل المغرب، مع إمكانية الدفع الإلكتروني حسب توفره.',
  },
  {
    q: 'ما هي سياسة الإرجاع والاستبدال؟',
    a: 'يمكنك إرجاع المنتج أو استبداله خلال 7 أيام من الاستلام، بشرط أن يكون بحالته الأصلية (غير ملبوس، غير مغسول، مع الإكرليكات محفوظة) وفقاً للقانون 31-08.',
  },
  {
    q: 'هل يمكن تفصيل القطعة حسب الطلب؟',
    a: 'نعم، نوفر خدمة التفصيل حسب الطلب لأجل المناسبات الخاصة. تواصلي معنا عبر واتساب لمناقشة التفاصيل والقياسات والخامات المفضلة لديك.',
  },
  {
    q: 'كيف أعتني بالقفطان أو الجلابة للحفاظ على جمالها؟',
    a: 'ننصح بالتنظيف الجاف للقطع الحريرية والمطرزة، وتجنب التعرض المباشر لأشعة الشمس لفترات طويلة، وحفظها في غطاء قماشي للحماية من الغبار.',
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 bg-white">
      <div className="container-custom max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="font-arabic text-3xl md:text-4xl text-primary-800 mb-3">الأسئلة الشائعة</h2>
          <div className="w-16 h-0.5 bg-accent-500 mx-auto" />
        </div>

        <div className="divide-y divide-accent-100 rounded-2xl border border-accent-200 overflow-hidden bg-ivory">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-right transition-colors hover:bg-accent-50/40"
                  aria-expanded={isOpen}
                >
                  <span className={`font-arabic text-lg font-semibold transition-colors ${isOpen ? 'text-primary-800' : 'text-primary-900'}`}>
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-accent-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    strokeWidth={1.6}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-primary-900/75 leading-8">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
