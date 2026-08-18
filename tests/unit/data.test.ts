import { products, categories, getProductById, getProductsByCategory, searchProducts, getRelatedProducts } from '@/lib/data';

describe('البيانات المشتركة', () => {
  it('يحتوي على 12 منتجاً و 4 فئات', () => {
    expect(products.length).toBe(12);
    expect(categories.length).toBe(4);
  });

  it('كل المنتجات لها معرّفات فريدة', () => {
    const ids = new Set(products.map((p) => p.id));
    expect(ids.size).toBe(products.length);
  });

  it('كل الفئات لها معرّفات فريدة', () => {
    const ids = new Set(categories.map((c) => c.id));
    expect(ids.size).toBe(categories.length);
  });

  it('الأسعار موجبة دائماً', () => {
    for (const p of products) {
      expect(p.price).toBeGreaterThan(0);
      if (p.originalPrice) expect(p.originalPrice).toBeGreaterThanOrEqual(p.price);
    }
  });
});

describe('getProductById', () => {
  it('يرجع منتجاً موجوداً', () => {
    const p = getProductById('1');
    expect(p?.name).toBe('الجلابة الفاسية');
  });

  it('يرجع undefined لمنتج غير موجود', () => {
    expect(getProductById('999')).toBeUndefined();
  });
});

describe('getProductsByCategory', () => {
  it('يرجع منتجات الجلابة', () => {
    const result = getProductsByCategory('jellaba');
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.category === 'جلابة')).toBe(true);
  });

  it('يرجع [] لفئة غير موجودة', () => {
    expect(getProductsByCategory('unknown')).toEqual([]);
  });
});

describe('searchProducts', () => {
  it('يبحث بالاسم', () => {
    const result = searchProducts('قفطان');
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].name).toContain('قفطان');
  });

  it('يعيد [] لبحث فارغ', () => {
    expect(searchProducts('')).toEqual([]);
    expect(searchProducts('   ')).toEqual([]);
  });
});

describe('getRelatedProducts', () => {
  it('يعيد 4 منتجات ولا يكرر المنتج الأصلي', () => {
    const result = getRelatedProducts('1');
    expect(result.length).toBe(4);
    expect(result.some((p) => p.id === '1')).toBe(false);
  });

  it('يعيد أول 4 منتجات لمنتج غير موجود', () => {
    const result = getRelatedProducts('xyz');
    expect(result.length).toBe(4);
  });
});
