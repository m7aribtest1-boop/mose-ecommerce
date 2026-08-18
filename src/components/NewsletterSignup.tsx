'use client';

import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setMsg('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus('ok');
      setMsg('تم اشتراكك ✓ ستصلك آخر التصاميم والعروض.');
      setEmail('');
    } catch {
      setStatus('error');
      setMsg('تعذر الاشتراك، حاول مجدداً.');
    }
  }

  return (
    <section className="py-24 bg-ivory">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-2 border-accent-300 bg-white p-10 md:p-16 text-center shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-accent-400" />
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-accent-400" />

          <h2 className="font-arabic text-3xl md:text-4xl text-primary-800 mb-4 relative z-10">
            انضمي إلى عائلة موسى
          </h2>
          <div className="w-16 h-0.5 bg-accent-500 mx-auto mb-6" />
          <p className="text-secondary-600 mb-10 relative z-10 max-w-lg mx-auto font-light leading-relaxed">
            اشتركي في نشرتنا البريدية لتصلك آخر التصاميم، العروض الحصرية، وقصص الأقمشة
            الجديدة مباشرة إلى بريدك الإلكتروني.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto relative z-10"
          >
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="بريدك الإلكتروني"
              className="flex-1 px-4 py-3 border border-secondary-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white text-right placeholder:text-secondary-400"
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="inline-flex items-center justify-center bg-primary-800 text-ivory px-8 py-3 font-arabic font-semibold rounded-md hover:bg-primary-900 transition-colors disabled:opacity-50"
            >
              {status === 'sending' ? 'جارٍ الاشتراك...' : 'اشترك'}
            </button>
          </form>
          {msg && (
            <p className={`mt-4 relative z-10 text-sm ${status === 'ok' ? 'text-accent-600' : 'text-primary-600'}`}>
              {msg}
            </p>
          )}
          <p className="text-xs text-secondary-400 mt-4 relative z-10">
            نحترم خصوصيتك — لن نشارك بريدك مع أي طرف ثالث.
          </p>
        </div>
      </div>
    </section>
  );
}
