import { NextResponse } from 'next/server';
import { registerCustomer, setCustomerSession } from '@/lib/auth-customer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customer = await registerCustomer({
      name: body.name,
      phone: body.phone,
      email: body.email,
      password: body.password,
      city: body.city,
    });
    setCustomerSession(customer.id);
    return NextResponse.json({ ok: true, customer: { id: customer.id, name: customer.name, phone: customer.phone } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'طلب غير صالح';
    const status = msg.includes('مسجّل') ? 409 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}
