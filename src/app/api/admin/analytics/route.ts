import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

const REVENUE_EXCLUDE = ['cancelled', 'refused', 'returned', 'refunded'];

export async function GET(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const fromParam = searchParams.get('from');
  const toParam = searchParams.get('to');

  const to = toParam ? new Date(toParam) : new Date();
  to.setHours(23, 59, 59, 999);
  const from = fromParam ? new Date(fromParam) : new Date(to.getTime() - 7 * 86400000);
  from.setHours(0, 0, 0, 0);

  const events = await prisma.analyticsEvent.findMany({
    where: { createdAt: { gte: from, lte: to } },
    select: {
      type: true, sessionId: true, productId: true,
      utmSource: true, referrer: true, country: true, city: true, device: true, createdAt: true,
    },
  });

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: from, lte: to } },
    select: { total: true, status: true, createdAt: true },
  });

  // ── totals ──────────────────────────────────────────────
  const counts: Record<string, number> = {};
  const sessions = new Set<string>();
  for (const e of events) {
    counts[e.type] = (counts[e.type] || 0) + 1;
    if (e.type === 'PAGE_VIEW') sessions.add(e.sessionId);
  }
  const uniqueSessions = sessions.size;
  const ordersCount = orders.length;
  const revenue = orders.reduce((s, o) => s + (REVENUE_EXCLUDE.includes(o.status) ? 0 : o.total), 0);
  const conversionRate = uniqueSessions > 0 ? (ordersCount / uniqueSessions) * 100 : 0;

  // ── daily series ───────────────────────────────────────
  const dayMap = new Map<string, { date: string; pageViews: number; uniqueSessions: number; addToCarts: number; orders: number; revenue: number }>();
  const daySessions = new Map<string, Set<string>>();
  for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().slice(0, 10);
    dayMap.set(key, { date: key, pageViews: 0, uniqueSessions: 0, addToCarts: 0, orders: 0, revenue: 0 });
  }
  for (const e of events) {
    const key = e.createdAt.toISOString().slice(0, 10);
    const day = dayMap.get(key);
    if (!day) continue;
    if (e.type === 'PAGE_VIEW') {
      day.pageViews++;
      let s = daySessions.get(key);
      if (!s) { s = new Set(); daySessions.set(key, s); }
      s.add(e.sessionId);
    }
    if (e.type === 'ADD_TO_CART') day.addToCarts++;
  }
  for (const o of orders) {
    const key = o.createdAt.toISOString().slice(0, 10);
    const day = dayMap.get(key);
    if (day) { day.orders++; if (!REVENUE_EXCLUDE.includes(o.status)) day.revenue += o.total; }
  }
  for (const [key, set] of Array.from(daySessions)) { const day = dayMap.get(key); if (day) day.uniqueSessions = set.size; }
  const daily = Array.from(dayMap.values());

  // ── top products ────────────────────────────────────────
  const viewCount = new Map<string, number>();
  const cartCount = new Map<string, number>();
  for (const e of events) {
    if (!e.productId) continue;
    if (e.type === 'PRODUCT_VIEW') viewCount.set(e.productId, (viewCount.get(e.productId) || 0) + 1);
    if (e.type === 'ADD_TO_CART') cartCount.set(e.productId, (cartCount.get(e.productId) || 0) + 1);
  }
  const productIds = Array.from(new Set([...Array.from(viewCount.keys()), ...Array.from(cartCount.keys())]));
  const products = productIds.length
    ? await prisma.product.findMany({ where: { id: { in: productIds } }, select: { id: true, name: true } })
    : [];
  const nameMap = new Map(products.map((p) => [p.id, p.name]));
  const topProducts = productIds
    .map((id) => ({ productId: id, name: nameMap.get(id) || id, views: viewCount.get(id) || 0, addToCarts: cartCount.get(id) || 0 }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // ── sources ─────────────────────────────────────────────
  const srcMap = new Map<string, number>();
  const refMap = new Map<string, number>();
  const countryMap = new Map<string, number>();
  const cityMap = new Map<string, number>();
  const deviceMap = new Map<string, number>();
  for (const e of events) {
    if (e.type !== 'PAGE_VIEW') continue;
    const src = e.utmSource || 'مباشر / Direct';
    srcMap.set(src, (srcMap.get(src) || 0) + 1);
    if (e.referrer) {
      try { const host = new URL(e.referrer).hostname; refMap.set(host, (refMap.get(host) || 0) + 1); } catch {}
    }
    const c = e.country || 'غير معروف';
    countryMap.set(c, (countryMap.get(c) || 0) + 1);
    const ci = e.city || 'غير معروف';
    cityMap.set(ci, (cityMap.get(ci) || 0) + 1);
    const dv = e.device || 'unknown';
    deviceMap.set(dv, (deviceMap.get(dv) || 0) + 1);
  }
  const toArr = (m: Map<string, number>) =>
    Array.from(m.entries()).map(([k, v]) => ({ key: k, value: v })).sort((a, b) => b.value - a.value);

  const funnel = [
    { step: 'زوار فريدون', value: uniqueSessions },
    { step: 'مشاهدات منتج', value: counts['PRODUCT_VIEW'] || 0 },
    { step: 'إضافات للسلة', value: counts['ADD_TO_CART'] || 0 },
    { step: 'بدء الدفع', value: counts['CHECKOUT_START'] || 0 },
    { step: 'طلبات مكتملة', value: ordersCount },
    { step: 'نقرات واتساب', value: counts['WHATSAPP_CLICK'] || 0 },
  ];

  const totals = {
    pageViews: counts['PAGE_VIEW'] || 0,
    uniqueSessions,
    productViews: counts['PRODUCT_VIEW'] || 0,
    addToCarts: counts['ADD_TO_CART'] || 0,
    checkoutStarts: counts['CHECKOUT_START'] || 0,
    orders: ordersCount,
    whatsappClicks: counts['WHATSAPP_CLICK'] || 0,
    revenue,
    conversionRate,
  };

  return NextResponse.json({
    range: { from: from.toISOString(), to: to.toISOString() },
    totals,
    funnel,
    daily,
    topProducts,
    bySource: toArr(srcMap),
    byReferrer: toArr(refMap),
    byCountry: toArr(countryMap),
    byCity: toArr(cityMap),
    byDevice: toArr(deviceMap),
  });
}
