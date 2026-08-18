import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const product = await prisma.product.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }] },
    include: { category: true, variants: true },
  });
  if (!product) return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 });
  return NextResponse.json({ product });
}