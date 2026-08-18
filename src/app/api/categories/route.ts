import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: { select: { products: true } },
      products: { take: 1, select: { image: true } },
    },
  });
  const data = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: c.image || (c.products[0]?.image ?? null),
    productCount: c._count.products,
  }));
  return NextResponse.json({ categories: data });
}
