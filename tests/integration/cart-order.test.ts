import { buildOrder, calcOrderItems, calcShipping, calcSubtotal, isValidPhone } from '@/lib/utils';
import { products } from '@/lib/data';
import type { CartItem } from '@/types';

const cartItems: CartItem[] = [
  { product: products[0], quantity: 2 },
  { product: products[1], quantity: 1, size: 'L', color: 'أسود' },
];

describe('سلة -> طلب (تكامل)', () => {
  it('يحسب المجموعات بشكل متسق', () => {
    const subtotal = calcSubtotal(cartItems);
    const shipping = calcShipping(subtotal);
    const total = subtotal + shipping;

    expect(subtotal).toBe(299 * 2 + 1800);
    expect(shipping).toBe(0);
    expect(total).toBe(subtotal);
  });

  it('يبني عناصر الطلب من السلة', () => {
    const orderItems = calcOrderItems(cartItems);
    expect(orderItems).toHaveLength(2);
    expect(orderItems[0]).toMatchObject({ productId: '1', quantity: 2 });
    expect(orderItems[1].size).toBe('L');
  });

  it('يبني طلباً كاملاً بكل الحقول', () => {
    const orderItems = calcOrderItems(cartItems);
    const subtotal = calcSubtotal(cartItems);
    const order = buildOrder({
      customerName: 'سلمى العلمي',
      phone: '0661122334',
      email: 'salma@example.com',
      city: 'الدار البيضاء',
      address: 'حي المعاريف، شارع الزرقطوني',
      paymentMethod: 'الدفع عند الاستلام',
      items: orderItems,
      subtotal,
      shipping: calcShipping(subtotal),
      total: subtotal + calcShipping(subtotal),
    });

    expect(order.id).toMatch(/^MOS-/);
    expect(order.status).toBe('pending');
    expect(order.total).toBe(2398);
    expect(isValidPhone(order.phone)).toBe(true);
  });
});
