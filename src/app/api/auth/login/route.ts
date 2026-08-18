import { NextResponse } from 'next/server';
import { verifyCustomerCredentials, setCustomerSession } from '@/lib/auth-customer';

export async function POST(request: Request) {
  try {
    const { phone, password } = await request.json();
    if (!phone || !password) {
      return NextResponse.json({ error: 'رقم الهاتف وكلمة المرور مطلوبان' }, { status: 400 });
    }
    const customer = await verifyCustomerCredentials(phone, password);
    if (!customer) {
      return NextResponse.json({ error: 'بيانات غير صحيحة أو الحساب غير مُفعل' }, { status: 401 });
    }
    setCustomerSession(customer.id);
    return NextResponse.json({ ok: true, customer: { id: customer.id, name: customer.name, phone: customer.phone } });
  } catch {
    return NextResponse.json({ error: 'طلب غير صالح' }, { status: 400 });
  }
}
