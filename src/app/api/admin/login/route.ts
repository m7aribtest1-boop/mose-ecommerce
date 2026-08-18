import { NextResponse } from 'next/server';
import { verifyAdminCredentials, setAdminSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'البريد وكلمة المرور مطلوبان' }, { status: 400 });
    }
    const user = await verifyAdminCredentials(email, password);
    if (!user) {
      return NextResponse.json({ error: 'بيانات غير صحيحة' }, { status: 401 });
    }
    setAdminSession(user.id);
    return NextResponse.json({ ok: true, user: { email: user.email, name: user.name } });
  } catch {
    return NextResponse.json({ error: 'طلب غير صالح' }, { status: 400 });
  }
}