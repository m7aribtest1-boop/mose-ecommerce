import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCustomerSession } from '@/lib/auth-customer';
import { prisma } from '@/lib/db';
import { formatPrice } from '@/lib/utils';
import { LogoutButton } from '@/components/LogoutButton';

export const dynamic = 'force-dynamic';

const statusLabels: Record<string, { label: string; cls: string }> = {
  pending: { label: 'بانتظار التأكيد', cls: 'bg-amber-100 text-amber-700' },
  confirmation_required: { label: 'يتطلب تأكيداً', cls: 'bg-orange-100 text-orange-700' },
  confirmed: { label: 'مؤكد', cls: 'bg-blue-100 text-blue-700' },
  preparing: { label: 'قيد التحضير', cls: 'bg-indigo-100 text-indigo-700' },
  shipped: { label: 'تم الشحن', cls: 'bg-purple-100 text-purple-700' },
  out_for_delivery: { label: 'قيد التوصيل', cls: 'bg-cyan-100 text-cyan-700' },
  delivered: { label: 'تم التسليم', cls: 'bg-green-100 text-green-700' },
  cancelled: { label: 'ملغي', cls: 'bg-gray-100 text-gray-600' },
  refused: { label: 'مرفوض', cls: 'bg-red-100 text-red-700' },
  returned: { label: 'مُرجع', cls: 'bg-red-100 text-red-700' },
  refunded: { label: 'مسترد', cls: 'bg-gray-100 text-gray-600' },
};

export default async function AccountPage() {
  const customer = await getCustomerSession();
  if (!customer) redirect('/auth/login?redirect=/account');

  const orders = await prisma.order.findMany({
    where: { customerId: customer.id },
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  });

  const totalSpent = orders
    .filter((o) => o.status !== 'cancelled' && o.status !== 'refused')
    .reduce((s, o) => s + o.total, 0);

  return (
    <main className="flex-1 bg-secondary-50 py-12">
      <div className="container-custom max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-900">أهلاً {customer.name}</h1>
            <p className="text-secondary-600 text-sm mt-1">
              {customer.phone}
              {customer.email ? ` · ${customer.email}` : ''}
              {customer.city ? ` · ${customer.city}` : ''}
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          <div className="card p-5">
            <div className="text-2xl font-bold text-primary-900">{orders.length}</div>
            <div className="text-sm text-secondary-600">طلباً</div>
          </div>
          <div className="card p-5">
            <div className="text-2xl font-bold text-primary-900">{formatPrice(totalSpent)}</div>
            <div className="text-sm text-secondary-600">إجمالي مشترياتك</div>
          </div>
          <div className="card p-5 col-span-2 sm:col-span-1">
            <Link href="/wishlist" className="text-primary-600 font-medium hover:underline text-sm">
              ❤ قائمة المفضلة
            </Link>
            <div className="text-sm text-secondary-600 mt-1">منتجاتك المحفوظة</div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-primary-900 mb-4">طلباتي</h2>
        {orders.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-secondary-600 mb-4">لم تقم بأي طلب بعد.</p>
            <Link href="/products" className="btn-primary px-6 py-2.5 text-sm">
              تصفّح المنتجات
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => {
              const st = statusLabels[o.status] || { label: o.status, cls: 'bg-gray-100 text-gray-600' };
              return (
                <div key={o.id} className="card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="font-bold text-primary-900">{o.orderNumber}</div>
                      <div className="text-xs text-secondary-500">
                        {new Date(o.createdAt).toLocaleDateString('ar-MA')} · {o.paymentMethod}
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${st.cls}`}>{st.label}</span>
                  </div>
                  <div className="space-y-1.5 mb-3">
                    {o.items.map((it) => (
                      <div key={it.id} className="flex justify-between text-sm text-secondary-700">
                        <span>
                          {it.name}
                          {it.size ? ` (${it.size})` : ''} × {it.quantity}
                        </span>
                        <span>{formatPrice(it.price * it.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between border-t border-secondary-100 pt-3 text-sm font-semibold text-primary-900">
                    <span>المجموع</span>
                    <span>{formatPrice(o.total)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
