import { renderHook, act, waitFor } from '@testing-library/react';
import { useCart } from '@/hooks/useCart';
import { products } from '@/lib/data';

describe('useCart', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('يبدأ بسلة فارغة', () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.items).toEqual([]);
    expect(result.current.count).toBe(0);
  });

  it('يضيف منتجاً ويزيد الكمية عند التكرار', async () => {
    const { result } = renderHook(() => useCart());
    await waitFor(() => expect(result.current.items).toEqual([]));

    act(() => {
      result.current.addItem(products[0]);
    });
    act(() => {
      result.current.addItem(products[0], 2);
    });

    expect(result.current.count).toBe(3);
    expect(result.current.subtotal).toBe(299 * 3);
  });

  it('يحدّث الكمية ويزيل عند الصفر', async () => {
    const { result } = renderHook(() => useCart());
    await waitFor(() => expect(result.current.items).toEqual([]));

    act(() => {
      result.current.addItem(products[0]);
    });
    act(() => {
      result.current.updateQuantity(products[0].id, 2);
    });
    expect(result.current.count).toBe(2);

    act(() => {
      result.current.updateQuantity(products[0].id, 0);
    });
    expect(result.current.items).toHaveLength(0);
  });

  it('يحفظ في localStorage ويعيد القراءة', async () => {
    const { result, unmount } = renderHook(() => useCart());
    await waitFor(() => expect(result.current.items).toEqual([]));

    act(() => {
      result.current.addItem(products[2]);
    });
    unmount();

    const stored = JSON.parse(window.localStorage.getItem('mose-cart') || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].product.id).toBe(products[2].id);
  });

  it('يخلي السلة', async () => {
    const { result } = renderHook(() => useCart());
    await waitFor(() => expect(result.current.items).toEqual([]));

    act(() => {
      result.current.addItem(products[0]);
      result.current.addItem(products[1]);
    });
    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.count).toBe(0);
    expect(result.current.total).toBe(0);
  });
});
