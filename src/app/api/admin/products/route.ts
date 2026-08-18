import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const products = await prisma.product.findMany({
    include: { variants: true, category: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    const body = await request.json();
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        price: Number(body.price),
        compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : null,
        description: body.description || null,
        material: body.material || null,
        care: body.care || null,
        image: body.image || '/products/placeholder.jpg',
        categoryId: body.categoryId || null,
        badge: body.badge || null,
        inStock: body.inStock !== false,
        isFeatured: !!body.isFeatured,
        isBestSeller: !!body.isBestSeller,
        isNew: !!body.isNew,
        rating: 0,
        reviewsCount: 0,
      },
    });

    if (Array.isArray(body.sizes)) {
      for (const size of body.sizes) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            sku: `${product.slug.toUpperCase()}-${size}`,
            size,
            stock: Number(body.stock) || 0,
          },
        });
      }
    }

    return NextResponse.json({ product }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'خطأ' }, { status: 400 });
  }
}