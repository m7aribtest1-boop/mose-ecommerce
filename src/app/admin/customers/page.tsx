'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Customer {
  id: string; name: string; phone: string; email?: string; city?: string;
  riskScore: number; totalOrders: number; deliveredOrders: number; refusedOrders: number; createdAt: string;
}

export default function AdminCustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/customers');
      if (res.status === 401) { router.push('/admin/login'); return; }
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch {} finally { setLoading(false); }
  }, [router]);

  useEffect(() => { load(); }, [load]);

  return (
    <main className="min-h-screen bg-secondary-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/admin" className="text-sm text-primary-600 hover:underline">← اللوحة</Link>
          <h1 className="text-2xl font-bold text-primary-900 mt-1">العملاء</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary-50 text-secondary-600">
              <tr>
                <th className="text-right px-4 py-3">العميل</th>
                <th className="text-right px-4 py-3">المدينة</th>
                <th className="text-right px-4 py-3">الطلبات</th>
                <th className="text-right px-4 py-3">تم التسليم</th>
                <th className="text-right px-4 py-3">مرفوض</th>
                <th className="text-right px-4 py-3">مستوى الخطر</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-t border-secondary-100">
                  <td className="px-4 py-3">
                    <div className="font-medium text-primary-900">{c.name}</div>
                    <div className="text-xs text-secondary-500">{c.phone} {c.email && `· ${c.email}`}</div>
                  </td>
                  <td className="px-4 py-3 text-secondary-600">{c.city || '—'}</td>
                  <td className="px-4 py-3">{c.totalOrders}</td>
                  <td className="px-4 py-3 text-green-600">{c.deliveredOrders}</td>
                  <td className="px-4 py-3 text-red-600">{c.refusedOrders}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${c.riskScore >= 50 ? 'bg-red-100 text-red-700' : c.riskScore >= 20 ? 'bg-accent-100 text-accent-700' : 'bg-green-100 text-green-700'}`}>
                      {c.riskScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && customers.length === 0 && (
            <div className="p-10 text-center text-secondary-500">لا يوجد عملاء بعد</div>
          )}
        </div>
      </div>
    </main>
  );
}