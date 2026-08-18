'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'خطأ في تسجيل الدخول');
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch {
      setError('خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-secondary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-primary-900 mb-1">لوحة إدارة متجر موسى</h1>
        <p className="text-secondary-500 text-sm mb-6">سجل الدخول للوصول إلى لوحة التحكم</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-secondary-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              placeholder="admin@mose.ma"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">كلمة المرور</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-secondary-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          {error && <div className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'جارٍ الدخول...' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  );
}