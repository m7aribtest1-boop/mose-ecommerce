'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'فشل الدخول');
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
          <h1 className="text-2xl font-bold text-primary-900 mb-2 text-center">تسجيل الدخول</h1>
          <p className="text-secondary-600 text-center mb-6 text-sm">أهلاً بعودتك إلى متجر موسى</p>

          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-2 text-sm mb-4">{error}</div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">رقم الهاتف</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="06XXXXXXXX"
                className="w-full border border-secondary-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">كلمة المرور</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-secondary-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">
              {loading ? 'جارٍ الدخول...' : 'دخول'}
            </button>
          </form>

          <p className="text-center text-sm text-secondary-600 mt-6">
            ليس لديك حساب؟{' '}
            <Link href="/auth/register" className="text-primary-600 font-medium hover:underline">
              أنشئ حساباً
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
