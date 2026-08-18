import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const EVENTS = [
  'PAGE_VIEW', 'PRODUCT_VIEW', 'ADD_TO_CART', 'REMOVE_FROM_CART',
  'CHECKOUT_START', 'ORDER_COMPLETE', 'WHATSAPP_CLICK', 'SEARCH',
] as const;

const BOT_UA = /bot|crawl|spider|slurp|headless|curl|wget|python-requests|facebookexternalhit|twitterbot|linkedinbot|pinterest/i;

export async function POST(req: NextRequest) {
  // Privacy: honour Do-Not-Track
  if (req.headers.get('dnt') === '1') return NextResponse.json({ skipped: true }, { status: 202 });
  const ua = req.headers.get('user-agent') ?? '';
  if (BOT_UA.test(ua)) return NextResponse.json({ skipped: true }, { status: 202 });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 });
  }
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'invalid' }, { status: 422 });
  if (typeof body.type !== 'string' || !EVENTS.includes(body.type)) {
    return NextResponse.json({ error: 'invalid type' }, { status: 422 });
  }
  const sessionId = String(body.sessionId || '').slice(0, 64);
  if (sessionId.length < 10) return NextResponse.json({ error: 'invalid session' }, { status: 422 });
  const path = String(body.path || req.nextUrl.pathname).slice(0, 500);

  const device = /Mobile|Android|iPhone|iPad/i.test(ua)
    ? 'mobile'
    : /Tablet/i.test(ua)
    ? 'tablet'
    : 'desktop';
  const country =
    req.headers.get('x-vercel-ip-country') || req.headers.get('cf-ipcountry') || null;

  try {
    await prisma.analyticsEvent.create({
      data: {
        type: body.type,
        sessionId,
        path,
        referrer: body.referrer ? String(body.referrer).slice(0, 500) : null,
        productId: body.productId ? String(body.productId).slice(0, 64) : null,
        categoryId: body.categoryId ? String(body.categoryId).slice(0, 64) : null,
        utmSource: body.utmSource ? String(body.utmSource).slice(0, 100) : null,
        utmMedium: body.utmMedium ? String(body.utmMedium).slice(0, 100) : null,
        utmCampaign: body.utmCampaign ? String(body.utmCampaign).slice(0, 100) : null,
        device,
        country,
      },
    });
  } catch {
    // never block the request on analytics failure
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
