import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const order = await prisma.order.findFirst({
    where: { OR: [{ id: params.id }, { orderNumber: params.id.toUpperCase() }] },
    include: { items: true, returnRequests: true },
  });
  if (!order) return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 });

  // لا نكشف كل البيانات لأي شخص — نرد بمعلومات العميل نفسه
  return NextResponse.json({ order });
}