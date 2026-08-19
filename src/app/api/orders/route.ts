import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/orders';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cookieHeader = request.headers.get('cookie') ?? '';
    const sidMatch = cookieHeader.match(/(?:^|;\s*)_mose_sid=([^;]+)/);
    const sessionId = sidMatch ? decodeURIComponent(sidMatch[1]) : undefined;
    const { order, highRisk } = await createOrder({ ...body, sessionId });
    return NextResponse.json(
      {
        order,
        highRisk,
        message: highRisk
          ? 'طلبك مسجل. سنتصل بك للتأكيد قبل الشحن.'
          : 'طلبك مسجل بنجاح. سنؤكد لك عن طريق الهاتف أو واتساب.',
      },
      { status: 201 }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'طلب غير صالح';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}