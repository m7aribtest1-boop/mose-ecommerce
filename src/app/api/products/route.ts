import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const querySchema = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(100),
});

export async function GET(request: Request) {
  try {
    const params = querySchema.parse(Object.fromEntries(new URL(request.url).searchParams));
    const where: Record<string, unknown> = {};

    if (params.category) {
      const cat = await prisma.category.findUnique({ where: { slug: params.category } });
      if (!cat) return NextResponse.json({ products: [], total: 0 });
      where.categoryId = cat.id;
    }
    if (params.q) {
      where.OR = [
        { name: { contains: params.q } },
        { description: { contains: params.q } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        take: params.limit,
        orderBy: [{ isBestSeller: 'desc' }, { reviewsCount: 'desc' }],
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ products, total });
  } catch {
    return NextResponse.json({ error: 'طلب غير صالح' }, { status: 400 });
  }
}