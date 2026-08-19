import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import SubscribersExport from '@/components/SubscribersExport';

export const metadata = { title: 'المشتركون | لوحة الإدارة' };
export const dynamic = 'force-dynamic';

export default async function AdminSubscribersPage({
  searchParams,
}: {
  searchParams?: { city?: string };
}) {
  const admin = await getAdminSession();
  if (!admin) redirect('/admin/login');

  const city = (searchParams?.city || '').trim();
  const [subscribers, cityRows] = await Promise.all([
    prisma.subscriber.findMany({
      where: city ? { city } : {},
      orderBy: { createdAt: 'desc' },
      take: 2000,
    }),
    prisma.subscriber.findMany({
      distinct: ['city'],
      where: { city: { not: null } },
      select: { city: true },
      orderBy: { city: 'asc' },
    }),
  ]);
  const cities = cityRows.map((c) => c.city as string);

  const rows = subscribers.map((s) => ({
    email: s.email,
    city: s.city,
    createdAt: s.createdAt.toISOString(),
  }));

  return (
    <main className="min-h-screen bg-secondary-100">
      <div className="bg-white border-b border-secondary-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary-900">📧 المشتركون في النشرة</h1>
          <a href="/admin" className="text-primary-600 hover:underline text-sm">← اللوحة</a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
          <h2 className="font-bold text-primary-900">الإجمالي: {subscribers.length}</h2>
          <div className="flex items-center gap-2">
            <form method="get" className="flex items-center gap-2">
              <select name="city" defaultValue={city} className="border border-secondary-300 rounded-lg px-3 py-2 text-sm">
                <option value="">كل المدن</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button type="submit" className="btn-primary px-4 py-2 text-sm">تصفية</button>
              {city && (
                <a href="/admin/subscribers" className="text-primary-600 hover:underline text-sm">مسح</a>
              )}
            </form>
            <SubscribersExport rows={rows} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-secondary-50 text-secondary-500">
                <tr>
                  <th className="p-3 font-medium">البريد الإلكتروني</th>
                  <th className="p-3 font-medium">المدينة</th>
                  <th className="p-3 font-medium">تاريخ الاشتراك</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr><td colSpan={3} className="text-center text-secondary-400 py-8">لا يوجد مشتركون بعد</td></tr>
                )}
                {rows.map((r, i) => (
                  <tr key={i} className="border-t border-secondary-100">
                    <td className="p-3 text-primary-900">{r.email}</td>
                    <td className="p-3 text-secondary-700">{r.city || '—'}</td>
                    <td className="p-3 text-secondary-600 whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleString('fr-MA', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-xs text-secondary-400 mt-3">
          البريد الإلكتروني يُجمع فقط عبر موافقة صريحة (النموذج). المدينة اختيارية وتُستخدم لأغراض التسويق فقط.
        </p>
      </div>
    </main>
  );
}
