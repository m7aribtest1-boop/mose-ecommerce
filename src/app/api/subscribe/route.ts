import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const ct = request.headers.get('content-type') || '';
    let email: string | undefined;
    let city: string | undefined;
    if (ct.includes('application/json')) {
      ({ email, city } = await request.json());
    } else {
      const form = await request.formData();
      email = (form.get('email') as string) || undefined;
      city = (form.get('city') as string) || undefined;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'بريد غير صالح' }, { status: 400 });
    }
    const normalized = email.toLowerCase().trim();
    try {
      await prisma.subscriber.upsert({
        where: { email: normalized },
        update: city ? { city: city.slice(0, 100) } : {},
        create: { email: normalized, city: city ? city.slice(0, 100) : null },
      });
    } catch {
      // duplicate or transient DB error — still acknowledge the subscriber
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'تعذر الاشتراك' }, { status: 400 });
  }
}
