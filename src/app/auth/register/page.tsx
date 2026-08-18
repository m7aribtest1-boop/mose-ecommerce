'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '', email: '', city: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'فشل التسجيل');
        return;
      }
      router.push('/account');
      router.refresh();
    } catch {
      setError('تعذر الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 bg-secondary-50 py-16">
      <div className="container-custom max-w-md">
        <div className="card p-8">
          <h1 className="text-2xl font-bold text-primary-900 mb-2 text-center">إنشاء حساب</h1>
          <p className="text-secondary-600 text-center mb-6 text-sm">انضم إلى متجر موسى وتابع طلباتك</p>

          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-2 text-sm mb-4">{error}</div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">الاسم الكامل</label>
              <input required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="مثال: فاطمة الزهراء" className="w-full border border-secondary-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">رقم الهاتف</label>
              <input required type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="06XXXXXXXX" className="w-full border border-secondary-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">البريد الإلكتروني (اختياري)</label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="name@example.com" className="w-full border border-secondary-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">المدينة (اختياري)</label>
              <input value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="الدار البيضاء" className="w-full border border-secondary-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">كلمة المرور</label>
              <input required type="password" value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="6 أحرف على الأقل" className="w-full border border-secondary-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">
              {loading ? 'جارٍ الإنشاء...' : 'إنشاء الحساب'}
            </button>
          </form>

          <p className="text-center text-sm text-secondary-600 mt-6">
            لديك حساب؟{' '}
            <Link href="/auth/login" className="text-primary-600 font-medium hover:underline">
              سجّل الدخول
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
