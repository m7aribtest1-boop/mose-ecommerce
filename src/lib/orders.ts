import { prisma } from './db';
import { storeConfig } from './store';
import { orderSchema, type OrderInput } from './validation';
import { computeRiskScore, isHighRisk } from './risk';
import type { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';

export function getShippingFee(subtotal: number): number {
  if (subtotal <= 0) return 0;
  if (subtotal >= storeConfig.shipping.freeShippingThreshold) return 0;
  return storeConfig.shipping.standardFee;
}

export async function findCoupon(code?: string, subtotal?: number) {
  if (!code) return null;
  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase().trim() } });
  if (!coupon || !coupon.active) return null;
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return null;
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return null;
  if (subtotal !== undefined && coupon.minSubtotal && subtotal < coupon.minSubtotal) return null;
  return coupon;
}

export function applyCoupon(coupon: NonNullable<Awaited<ReturnType<typeof findCoupon>>>, subtotal: number): number {
  let discount = 0;
  if (coupon.type === 'PERCENT') {
    discount = (subtotal * coupon.value) / 100;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  } else {
    discount = coupon.value;
  }
  return Math.min(Math.max(0, discount), subtotal);
}

export function generateOrderNumber(): string {
  const d = new Date();
  const y = String(d.getFullYear()).slice(2);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `MOS-${y}${m}-${rand}`;
}

export async function createOrder(input: OrderInput) {
  const parsed = orderSchema.parse(input);

  const products = await prisma.product.findMany({
    where: { id: { in: parsed.items.map((i) => i.productId) } },
    include: { variants: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));
  const orderItems: {
    productId?: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    sku?: string;
  }[] = [];

  for (const item of parsed.items) {
    const product = productMap.get(item.productId);
    if (!product) throw new Error(`المنتج غير موجود: ${item.productId}`);

    let variant = null;
    if (item.size) {
      variant = product.variants.find(
        (v) => v.size === item.size && (item.color ? v.color === item.color : true)
      );
      if (!variant) throw new Error(`المقاس ${item.size} غير متوفر لمنتج ${product.name}`);
      if (variant.stock < item.quantity) {
        throw new Error(`الكمية المطلوبة من ${product.name} (${item.size}) غير متوفرة — متبقي ${variant.stock}`);
      }
    } else if (!product.inStock) {
      throw new Error(`المنتج ${product.name} غير متوفر حالياً`);
    }

    orderItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      sku: variant?.sku,
    });
  }

  const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const coupon = await findCoupon(parsed.couponCode, subtotal);
  const discount = coupon ? applyCoupon(coupon, subtotal) : 0;
  const shippingFee = getShippingFee(subtotal - discount);
  const total = subtotal - discount + shippingFee;

  const riskScore = await computeRiskScore(parsed.phone, parsed.city, total);
  const highRisk = isHighRisk(riskScore);

  const order = await prisma.$transaction(async (tx) => {
    // حجز المخزون
    for (const item of parsed.items) {
      if (!item.size) continue;
      const product = productMap.get(item.productId);
      if (!product) continue;
      const variant = product.variants.find(
        (v) => v.size === item.size && (item.color ? v.color === item.color : true)
      );
      if (variant) {
        const updated = await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.stock < 0) {
          throw new Error(`المخزون غير كافٍ لـ ${product.name} (${item.size})`);
        }
      }
    }

    let customer = await tx.customer.findUnique({ where: { phone: parsed.phone } });
    if (!customer) {
      customer = await tx.customer.create({
        data: {
          name: parsed.customerName,
          phone: parsed.phone,
          email: parsed.email || null,
          city: parsed.city,
        },
      });
    } else {
      customer = await tx.customer.update({
        where: { id: customer.id },
        data: { name: parsed.customerName, city: parsed.city },
      });
    }

    const paymentMethod = parsed.paymentMethod as PaymentMethod;
    const paymentStatus: PaymentStatus = paymentMethod === 'COD' ? 'pending' : 'pending';

    return tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: customer.id,
        customerName: parsed.customerName,
        phone: parsed.phone,
        email: parsed.email || null,
        city: parsed.city,
        address: parsed.address || null,
        notes: parsed.notes || null,
        paymentMethod,
        paymentStatus,
        subtotal,
        shippingFee,
        discount,
        couponCode: coupon?.code || null,
        total,
        riskScore,
        status: highRisk ? 'confirmation_required' : 'pending',
        items: { create: orderItems },
      },
      include: { items: true },
    });
  });

  if (coupon) {
    await prisma.coupon.update({
      where: { id: coupon.id },
      data: { usedCount: { increment: 1 } },
    });
  }

  return { order, highRisk };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error('الطلب غير موجود');

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      codConfirmation: status === 'confirmed' ? true : order.codConfirmation,
    },
  });

  if (status === 'delivered' && order.customerId) {
    await prisma.customer.update({
      where: { id: order.customerId },
      data: { deliveredOrders: { increment: 1 } },
    });
  }
  if (status === 'refused' && order.customerId) {
    await prisma.customer.update({
      where: { id: order.customerId },
      data: { refusedOrders: { increment: 1 } },
    });
  }

  return updated;
}

export async function refundOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) throw new Error('الطلب غير موجود');

  await prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      if (!item.size) continue;
      const variant = await tx.productVariant.findFirst({
        where: { sku: item.sku ?? undefined, productId: item.productId ?? undefined },
      });
      if (variant) {
        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock: { increment: item.quantity } },
        });
      }
    }
    await tx.order.update({ where: { id: orderId }, data: { status: 'refunded', paymentStatus: 'refunded' } });
  });
}

export { isHighRisk };