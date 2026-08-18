import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/orders';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order, highRisk } = await createOrder(body);
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