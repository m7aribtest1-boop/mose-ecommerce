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

  const [orders, todayOrdersCount, revenueAgg, todayRevenueAgg, productsCount, customersCount, pendingCount, lowStockVariants] =
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
        </div>
      </div>
    </main>
  );
}