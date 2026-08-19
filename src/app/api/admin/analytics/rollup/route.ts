import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

const REVENUE_EXCLUDE = ['cancelled', 'refused', 'returned', 'refunded'];

export async function POST() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const first = await prisma.analyticsEvent.findFirst({ orderBy: { createdAt: 'asc' }, select: { createdAt: true } });
  if (!first) return NextResponse.json({ ok: true, days: 0 });

  const start = new Date(first.createdAt);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let days = 0;
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    const dayStart = new Date(d);
    const dayEnd = new Date(d);
    dayEnd.setHours(23, 59, 59, 999);

    const evts = await prisma.analyticsEvent.findMany({
      where: { createdAt: { gte: dayStart, lte: dayEnd } },
      select: { type: true, sessionId: true },
    });
    const counts: Record<string, number> = {};
    const sessions = new Set<string>();
    for (const e of evts) {
      counts[e.type] = (counts[e.type] || 0) + 1;
      if (e.type === 'PAGE_VIEW') sessions.add(e.sessionId);
    }
    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: dayStart, lte: dayEnd } },
      select: { total: true, status: true },
    });
    const revenue = orders.reduce((s, o) => s + (REVENUE_EXCLUDE.includes(o.status) ? 0 : o.total), 0);

    const payload = {
      pageViews: counts['PAGE_VIEW'] || 0,
      uniqueSessions: sessions.size,
      productViews: counts['PRODUCT_VIEW'] || 0,
      addToCarts: counts['ADD_TO_CART'] || 0,
      checkoutStarts: counts['CHECKOUT_START'] || 0,
      orders: orders.length,
      revenue,
      whatsappClicks: counts['WHATSAPP_CLICK'] || 0,
    };
    await prisma.aggregatedStat.upsert({
      where: { date: dayStart },
      create: { date: dayStart, ...payload },
      update: payload,
    });
    days++;
  }

  return NextResponse.json({ ok: true, days });
}
