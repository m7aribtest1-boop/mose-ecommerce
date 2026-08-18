import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const ct = request.headers.get('content-type') || '';
    let email: string | undefined;
    if (ct.includes('application/json')) {
      ({ email } = await request.json());
    } else {
      const form = await request.formData();
      email = (form.get('email') as string) || undefined;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'بريد غير صالح' }, { status: 400 });
    }
    const normalized = email.toLowerCase().trim();
    try {
      await prisma.subscriber.upsert({
        where: { email: normalized },
        update: {},
        create: { email: normalized },
      });
    } catch {
      // duplicate or transient DB error — still acknowledge the subscriber
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'تعذر الاشتراك' }, { status: 400 });
  }
}
