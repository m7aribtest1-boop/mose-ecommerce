import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const customers = await prisma.customer.findMany({
    include: {
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return NextResponse.json({
    customers: customers.map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      email: c.email,
      city: c.city,
      riskScore: c.riskScore,
      totalOrders: c.totalOrders || c._count.orders,
      deliveredOrders: c.deliveredOrders,
      refusedOrders: c.refusedOrders,
      createdAt: c.createdAt,
    })),
  });
}