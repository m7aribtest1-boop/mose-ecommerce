import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { updateOrderStatus, refundOrder } from '@/lib/orders';
import { logAdmin, getClientIp } from '@/lib/audit';

export async function GET(request: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const q = searchParams.get('q');

  const where: Record<string, unknown> = {};
  if (status && status !== 'all') where.status = status;
  if (q) {
    where.OR = [
      { orderNumber: { contains: q } },
      { customerName: { contains: q } },
      { phone: { contains: q } },
    ];
  }

  const orders = await prisma.order.findMany({
    where,
    include: { items: true, customer: true },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return NextResponse.json({ orders });
}

export async function PATCH(request: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  const ip = getClientIp(request);
  const ua = request.headers.get('user-agent') || null;

  try {
    const { id, status, action } = await request.json();
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });

    if (action === 'refund') {
      await refundOrder(id);
      await logAdmin('ORDER_REFUND', { userId: admin.id, ip, userAgent: ua, metadata: { orderId: id } });
      return NextResponse.json({ ok: true });
    }

    if (!status) return NextResponse.json({ error: 'الحالة مطلوبة' }, { status: 400 });
    const allowed = [
      'pending', 'confirmation_required', 'confirmed', 'preparing', 'shipped',
      'out_for_delivery', 'delivered', 'cancelled', 'refused', 'returned', 'refunded',
    ];
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: 'حالة غير صالحة' }, { status: 400 });
    }

    const before = await prisma.order.findUnique({ where: { id }, select: { status: true } });
    const updated = await updateOrderStatus(id, status);
    await logAdmin('ORDER_STATUS_CHANGE', {
      userId: admin.id, ip, userAgent: ua,
      metadata: { orderId: id, from: before?.status, to: status },
    });
    return NextResponse.json({ ok: true, order: updated });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'خطأ' }, { status: 400 });
  }
}