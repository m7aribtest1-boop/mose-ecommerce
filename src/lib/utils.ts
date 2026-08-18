import type { CartItem, Order, OrderItem } from '@/types';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from './data';

export function formatPrice(price: number): string {
  return `${price.toLocaleString('fr-MA')} درهم`;
}

export function formatPriceLtr(price: number): string {
  return `${price.toLocaleString('fr-MA')} MAD`;
}

export function calcDiscountPercent(price: number, originalPrice?: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function calcSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

export function calcSavings(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const original = item.product.originalPrice ?? item.product.price;
    return sum + Math.max(0, original - item.product.price) * item.quantity;
  }, 0);
}

export function calcShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
}

export function calcTotal(items: CartItem[]): number {
  const subtotal = calcSubtotal(items);
  return subtotal + calcShipping(subtotal);
}

export function calcOrderItems(items: CartItem[]): OrderItem[] {
  return items.map((item) => ({
    productId: item.product.id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
  }));
}

export function generateOrderId(): string {
  return `MOS-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')}`;
}

export function buildOrder(input: Omit<Order, 'id' | 'status' | 'createdAt'>): Order {
  return {
    ...input,
    id: generateOrderId(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}

export function isValidPhone(phone: string): boolean {
  return /^(\+212|0)([ \-]?\d){9}$/.test(phone.trim());
}

export function isValidEmail(email?: string): boolean {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function toBase64Image(image: string): string {
  return image;
}
