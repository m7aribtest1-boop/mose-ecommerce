import { NextResponse } from 'next/server';
import { getCustomerSession } from '@/lib/auth-customer';

export async function GET() {
  const customer = await getCustomerSession();
  if (!customer) return NextResponse.json({ customer: null });
  return NextResponse.json({
    customer: {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      city: customer.city,
    },
  });
}
