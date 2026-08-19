import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const metadata = { title: 'لوحة الإدارة | متجر موسى' };

const STATUS_LABELS: Record<string, string> = {
  pending: 'قيد الانتظار',
  confirmation_required: 'بانتظار التأكيد',
  confirmed: 'مؤكد',
  preparing: 'قيد التحضير',
  shipped: 'تم الشحن',
  out_for_delivery: 'قيد التوصيل',
  delivered: 'تم التسليم',
  cancelled: 'ملغي',
  refused: 'مرفوض',
  returned: 'مسترجع',
  refunded: 'مسترد',
};

export default async function AdminPage() {
  const admin = await getAdminSession();
  if (!admin) redirect('/admin/login');

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [orders, todayOrdersCount, revenueAgg, todayRevenueAgg, productsCount, customersCount, pendingCount, lowStockVariants, pageViewsToday, uniqueSessionsToday, addToCartsToday, checkoutStartsToday, whatsappClicksToday] =
    await Promise.all([
      prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 500 }),
      prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { in: ['delivered', 'shipped', 'out_for_delivery', 'preparing', 'confirmed'] } },
      }),
      prisma.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: todayStart } } }),
      prisma.product.count(),
      prisma.customer.count(),
      prisma.order.count({ where: { status: { in: ['pending', 'confirmation_required'] } } }),
      prisma.productVariant.count({ where: { stock: { lte: 2 } } }),
      prisma.analyticsEvent.count({ where: { type: 'PAGE_VIEW', createdAt: { gte: todayStart } } }),
      prisma.analyticsEvent.findMany({
        where: { type: 'PAGE_VIEW', createdAt: { gte: todayStart } },
        select: { sessionId: true },
        distinct: ['sessionId'],
      }),
      prisma.analyticsEvent.count({ where: { type: 'ADD_TO_CART', createdAt: { gte: todayStart } } }),
      prisma.analyticsEvent.count({ where: { type: 'CHECKOUT_START', createdAt: { gte: todayStart } } }),
      prisma.analyticsEvent.count({ where: { type: 'WHATSAPP_CLICK', createdAt: { gte: todayStart } } }),
    ]);

  const byStatus = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    { label: 'إجمالي الإيرادات', value: `${(revenueAgg._sum.total ?? 0).toLocaleString('fr-MA')} درهم`, color: 'text-green-600' },
    { label: 'طلبات اليوم', value: todayOrdersCount, color: 'text-primary-600' },
    { label: 'إيرادات اليوم', value: `${(todayRevenueAgg._sum.total ?? 0).toLocaleString('fr-MA')} درهم`, color: 'text-primary-600' },
    { label: 'بانتظار التأكيد', value: pendingCount, color: 'text-accent-600' },
    { label: 'إجمالي الطلبات', value: orders.length, color: 'text-primary-900' },
    { label: 'المنتجات', value: productsCount, color: 'text-primary-900' },
    { label: 'العملاء', value: customersCount, color: 'text-primary-900' },
    { label: 'مخزون منخفض (≤2)', value: lowStockVariants, color: 'text-red-600' },
  ];

  return (
    <main className="min-h-screen bg-secondary-100">
      <div className="bg-white border-b border-secondary-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary-900">لوحة إدارة موسى</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-secondary-500">{admin.email}</span>
            <Link href="/" className="text-primary-600 hover:underline">المتجر ←</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl shadow-sm p-5">
              <div className="text-sm text-secondary-500 mb-1">{s.label}</div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {Object.entries(byStatus).map(([status, count]) => (
            <div key={status} className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center">
              <span className="text-secondary-700">{STATUS_LABELS[status] || status}</span>
              <span className="font-bold text-primary-900">{count}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="font-bold text-primary-900 mb-4">📊 مسار التحويل اليوم (Funnel)</h2>
          <div className="space-y-3">
            {[
              { label: 'زوار فريدون', value: uniqueSessionsToday.length, icon: '👤' },
              { label: 'مشاهدات الصفحات', value: pageViewsToday, icon: '👁️' },
              { label: 'إضافات للسلة', value: addToCartsToday, icon: '🛒' },
              { label: 'بدء الدفع', value: checkoutStartsToday, icon: '💳' },
              { label: 'طلبات مكتملة', value: todayOrdersCount, icon: '✅' },
              { label: 'نقرات واتساب', value: whatsappClicksToday, icon: '💬' },
            ].map((step, i, arr) => {
              const prev = i === 0 ? step.value : arr[i - 1].value;
              const pct = prev > 0 ? Math.round((step.value / prev) * 100) : 0;
              return (
                <div key={step.label} className="flex items-center gap-3">
                  <div className="w-40 text-sm text-secondary-700">{step.icon} {step.label}</div>
                  <div className="flex-1 bg-secondary-100 rounded-full h-6 relative overflow-hidden">
                    <div className="bg-primary-500 h-full" style={{ width: `${Math.min(100, pct)}%` }} />
                  </div>
                  <div className="w-20 text-right text-sm font-bold text-primary-900">{step.value}</div>
                  <div className="w-12 text-left text-xs text-secondary-500">{i === 0 ? '—' : `${pct}%`}</div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-secondary-500 mt-4">
            نسبة تحويل الزائر إلى طلب: {uniqueSessionsToday.length > 0 ? `${Math.round((todayOrdersCount / uniqueSessionsToday.length) * 100)}%` : '—'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/admin/orders" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="text-3xl mb-2">📦</div>
            <div className="font-bold text-primary-900">إدارة الطلبات</div>
            <div className="text-sm text-secondary-500 mt-1">تأكيد، شحن، تسليم، رفض، استرجاع</div>
          </Link>
          <Link href="/admin/products" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="text-3xl mb-2">🧵</div>
            <div className="font-bold text-primary-900">المنتجات والمخزون</div>
            <div className="text-sm text-secondary-500 mt-1">إضافة وتعديل منتجات ومقاسات</div>
          </Link>
          <Link href="/admin/customers" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="text-3xl mb-2">👥</div>
            <div className="font-bold text-primary-900">العملاء</div>
            <div className="text-sm text-secondary-500 mt-1">سجل الطلبات وتقييم المخاطر</div>
          </Link>
          <Link href="/admin/analytics" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="text-3xl mb-2">📊</div>
            <div className="font-bold text-primary-900">تحليلات المتجر</div>
            <div className="text-sm text-secondary-500 mt-1">زوار، مسار تحويل، مصادر، أفضل المنتجات</div>
          </Link>
          <Link href="/admin/settings" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="text-3xl mb-2">⚙️</div>
            <div className="font-bold text-primary-900">إعدادات المتجر</div>
            <div className="text-sm text-secondary-500 mt-1">واتساب، النصوص، العملة، الشبكات</div>
          </Link>
        </div>
      </div>
    </main>
  );
}