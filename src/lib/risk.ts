import { prisma } from './db';
import type { OrderStatus } from '@prisma/client';

const RISK_FLAGS = {
  disposablePhone: /^(06[67]0|060)[0-9]{7}$/,
};

export async function computeRiskScore(phone: string, city: string, total: number): Promise<number> {
  let score = 0;
  const similar = await prisma.customer.findMany({
    where: { phone },
    include: { orders: { orderBy: { createdAt: 'desc' }, take: 5 } },
  });

  for (const c of similar) {
    score += c.refusedOrders * 20;
    score += c.riskScore;
    for (const o of c.orders) {
      if (o.status === 'refused') score += 25;
      if (o.status === 'cancelled') score += 10;
    }
  }

  if (total >= 2000) score += 15;

  return Math.min(score, 100);
}

export function isHighRisk(score: number): boolean {
  return score >= 50;
}

export async function getOrderStatusFlow(): Promise<OrderStatus[]> {
  return [
    'pending',
    'confirmation_required',
    'confirmed',
    'preparing',
    'shipped',
    'out_for_delivery',
    'delivered',
    'cancelled',
    'refused',
    'returned',
    'refunded',
  ];
}

export function nextStatuses(current: OrderStatus): OrderStatus[] {
  const map: Record<OrderStatus, OrderStatus[]> = {
    pending: ['confirmation_required', 'cancelled', 'refused'],
    confirmation_required: ['confirmed', 'cancelled', 'refused'],
    confirmed: ['preparing', 'cancelled', 'refused'],
    preparing: ['shipped', 'cancelled'],
    shipped: ['out_for_delivery', 'returned', 'refused'],
    out_for_delivery: ['delivered', 'refused', 'returned'],
    delivered: ['returned', 'refunded'],
    cancelled: [],
    refused: [],
    returned: ['refunded'],
    refunded: [],
  };
  return map[current] || [];
}

export function isTerminal(status: OrderStatus): boolean {
  return ['cancelled', 'refused', 'returned', 'refunded'].includes(status);
}