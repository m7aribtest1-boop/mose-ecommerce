import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [orders, todayOrders, revenue, todayRevenue, products, customers, pendingCount, lowStock] =
    await Promise.all([
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 500,
        include: { items: true },
      }),
      prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { in: ['delivered', 'shipped', 'out_for_delivery', 'preparing', 'confirmed'] } },
      }),
      prisma.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: todayStart } } }),
      prisma.product.count(),
      prisma.customer.count(),
      prisma.order.count({ where: { status: { in: ['pending', 'confirmation_required'] } } }),
      prisma.productVariant.aggregate({ _count: { _all: true }, where: { stock: { lte: 2 } } }),
    ]);

  const byStatus = (rows: { status: string }[]) =>
    rows.reduce<Record<string, number>>((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});

  const revenueValue = revenue._sum.total ?? 0;
  const todayRevenueValue = todayRevenue._sum.total ?? 0;
  const delivered = orders.filter((o) => o.status === 'delivered').length;
  const refused = orders.filter((o) => o.status === 'refused' || o.status === 'refunded').length;

  return NextResponse.json({
    stats: {
      orders: orders.length,
      todayOrders,
      revenue: revenueValue,
      todayRevenue: todayRevenueValue,
      products,
      customers,
      pendingCount,
      lowStockCount: lowStock._count._all,
      aov: orders.length ? Math.round(revenueValue / Math.max(orders.length, 1)) : 0,
      codSuccessRate: orders.length ? Math.round((delivered / orders.length) * 100) : 0,
      refusalRate: orders.length ? Math.round((refused / orders.length) * 100) : 0,
      byStatus: byStatus(orders),
    },
    recentOrders: orders.slice(0, 10).map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      city: o.city,
      total: o.total,
      status: o.status,
      createdAt: o.createdAt,
      paymentMethod: o.paymentMethod,
    })),
  });
}