import { NextResponse } from 'next/server';
import { findCoupon, applyCoupon } from '@/lib/orders';

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get('code');
  if (!code) return NextResponse.json({ valid: false, error: 'الكود مطلوب' });

  const subtotalParam = new URL(request.url).searchParams.get('subtotal');
  const subtotal = subtotalParam ? Number(subtotalParam) : undefined;

  const coupon = await findCoupon(code, subtotal);
  if (!coupon) {
    return NextResponse.json({ valid: false, error: 'كود غير صالح أو منتهي' });
  }

  const discount = subtotal !== undefined ? applyCoupon(coupon, subtotal) : null;
  return NextResponse.json({ valid: true, coupon, discount });
}