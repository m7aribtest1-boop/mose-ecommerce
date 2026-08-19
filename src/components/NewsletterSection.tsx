'use client';

import { useState } from 'react';

const CITIES = [
  'الدار البيضاء', 'الرباط', 'فاس', 'مراكش', 'أكادير', 'طنجة', 'وجدة', 'تطوان',
  'آسفي', 'الجديدة', 'القنيطرة', 'سطات', 'مكناس', 'الرشيدية', 'ورزازات', 'أخرى / أجنبي',
];

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    
    setStatus('loading');
    setMessage('');
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, city: city || undefined }),
      });
      
      if (response.ok) {
        setStatus('success');
        setMessage('تم الاشتراك بنجاح! ستصلك أحدث العروض والأخبار.');
        setEmail('');
        setCity('');
      } else {
        throw new Error('فشل الاشتراك');
      }
    } catch {
      setStatus('error');
      setMessage('حدث خطأ، يرجى المحاولة مرة أخرى');
    }
  };

  return (
    <section className="py-16 bg-primary-900 text-white">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <svg className="w-5 h-5 text-accent-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">نشرة موسى الإخبارية</span>
          </div>
          
          <h2 className="text-3xl font-bold mb-4">اشترك في نشرتنا الإخبارية</h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            كن أول من يعرف بأحدث المجموعات، العروض الحصرية، ونصائح الأناقة المغربية. 
            لا رسائل مزعجة، فقط محتوى مفيد وإلهام أسبوعي.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <label htmlFor="email" className="sr-only">بريدك الإلكتروني</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني"
                className="w-full px-5 py-4 pl-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all"
                disabled={status === 'loading'}
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="px-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-400 transition-all"
            >
              <option value="" className="text-secondary-700">المدينة</option>
              {CITIES.map((c) => (
                <option key={c} value={c} className="text-secondary-700">{c}</option>
              ))}
            </select>
            <button
              type="submit"
              className="btn-primary px-8 py-4 whitespace-nowrap"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" />
                  </svg>
                  جاري الاشتراك...
                </span>
              ) : (
                'اشترك الآن'
              )}
            </button>
          </form>
          
          <p className="mt-4 text-white/60 text-sm">
            بالاشتراك أنت توافق على 
            <a href="/privacy" className="underline hover:text-accent-300">سياسة الخصوصية</a>.
            يمكنك إلغاء الاشتراك في أي وقت.
          </p>
        </div>
      </div>
    </section>
  );
}