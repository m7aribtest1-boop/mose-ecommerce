import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const schema = z.object({
  author: z.string().min(2, 'الاسم قصير').max(60),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().max(80).optional(),
  body: z.string().min(5, 'اكتب رأيك').max(1000),
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 });

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || 'بيانات غير صحيحة' }, { status: 400 });
  }

  await prisma.review.create({
    data: {
      productId: product.id,
      author: parsed.data.author.trim(),
      rating: parsed.data.rating,
      title: parsed.data.title?.trim() || null,
      body: parsed.data.body.trim(),
      status: 'pending',
      source: 'site',
    },
  });

  return NextResponse.json({ ok: true, message: 'شكراً! تقييمك وصلنا وهو قيد المراجعة قبل النشر.' }, { status: 201 });
}
