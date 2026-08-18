import { calcDiscountPercent, calcShipping, calcSubtotal, calcSavings, calcTotal, formatPrice, generateOrderId, buildOrder, isValidPhone, isValidEmail } from '@/lib/utils';
import type { CartItem } from '@/types';

const item = (price: number, originalPrice?: number, quantity = 1): CartItem => ({
  product: {
    id: `p-${price}`,
    name: 'منتج تجريبي',
    price,
    originalPrice,
    image: '/x.jpg',
    category: 'جلابة',
    rating: 4.5,
    reviews: 10,
  },
  quantity,
});

describe('formatPrice', () => {
  it('يضيف "درهم" مع التنسيق', () => {
    expect(formatPrice(299)).toBe('299 درهم');
    expect(formatPrice(1200)).toContain('درهم');
  });
});

describe('calcDiscountPercent', () => {
  it('يحسب نسبة الخصم', () => {
    expect(calcDiscountPercent(299, 399)).toBe(25);
    expect(calcDiscountPercent(100, 100)).toBe(0);
    expect(calcDiscountPercent(100)).toBe(0);
    expect(calcDiscountPercent(200, 100)).toBe(0);
  });
});

describe('calcSubtotal', () => {
  it('يجمع أسعار العناصر مضروبة في الكمية', () => {
    const items = [item(100, 150), item(50, undefined, 3)];
    expect(calcSubtotal(items)).toBe(250);
  });

  it('يعيد 0 لسلة فارغة', () => {
    expect(calcSubtotal([])).toBe(0);
  });
});

describe('calcSavings', () => {
  it('يجمع التوفير من الأسعار الأصلية', () => {
    const items = [item(100, 150), item(50, undefined, 3)];
    expect(calcSavings(items)).toBe(50);
  });
});

describe('calcShipping', () => {
  it('شحن مجاني فوق 500 درهم', () => {
    expect(calcShipping(500)).toBe(0);
    expect(calcShipping(999)).toBe(0);
  });

  it('45 درهم تحت 500', () => {
    expect(calcShipping(499)).toBe(45);
    expect(calcShipping(0)).toBe(0);
  });
});

describe('calcTotal', () => {
  it('مجموع + شحن', () => {
    expect(calcTotal([item(100)])).toBe(145);
    expect(calcTotal([item(600)])).toBe(600);
  });
});

describe('generateOrderId / buildOrder', () => {
  it('يولّد رقم طلب فريد', () => {
    const a = generateOrderId();
    const b = generateOrderId();
    expect(a).not.toBe(b);
    expect(a).toMatch(/^MOS-/);
  });

  it('يبني طلباً بحالة pending', () => {
    const order = buildOrder({
      customerName: 'محمد',
      phone: '0612345678',
      city: 'فاس',
      paymentMethod: 'الدفع عند الاستلام',
      items: [],
      subtotal: 0,
      shipping: 0,
      total: 0,
    });
    expect(order.status).toBe('pending');
    expect(order.id).toMatch(/^MOS-/);
    expect(order.createdAt).toBeTruthy();
  });
});

describe('isValidPhone', () => {
  it('يقبل أرقاماً مغربية صالحة', () => {
    expect(isValidPhone('0612345678')).toBe(true);
    expect(isValidPhone('+212612345678')).toBe(true);
    expect(isValidPhone('05 12 34 56 78')).toBe(true);
  });

  it('يرفض أرقاماً غير صالحة', () => {
    expect(isValidPhone('123')).toBe(false);
    expect(isValidPhone('061234567')).toBe(false);
    expect(isValidPhone('abc')).toBe(false);
  });
});

describe('isValidEmail', () => {
  it('يقبل بريداً صالحاً ويرفض غير الصالح', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('bad-email')).toBe(false);
    expect(isValidEmail(undefined)).toBe(true);
  });
});
