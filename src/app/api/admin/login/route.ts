import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAdminCredentials, setAdminSession } from '@/lib/auth';
import { logAdmin, getClientIp } from '@/lib/audit';

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const ua = request.headers.get('user-agent') || null;
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'البريد وكلمة المرور مطلوبان' }, { status: 400 });
    }

    // brute-force protection: max 5 failed attempts per IP / 10 min
    const since = new Date(Date.now() - 10 * 60 * 1000);
    const fails = await prisma.adminAuditLog.count({
      where: { eventType: 'ADMIN_LOGIN_FAILED', ip, timestamp: { gte: since } },
    });
    if (fails >= 5) {
      await logAdmin('ADMIN_LOGIN_BLOCKED', { ip, userAgent: ua, metadata: { email } });
      return NextResponse.json({ error: 'محاولات كثيرة — حاول لاحقاً' }, { status: 429 });
    }

    const user = await verifyAdminCredentials(email, password);
    if (!user) {
      await logAdmin('ADMIN_LOGIN_FAILED', { ip, userAgent: ua, metadata: { email } });
      return NextResponse.json({ error: 'بيانات غير صحيحة' }, { status: 401 });
    }

    setAdminSession(user.id);
    await logAdmin('ADMIN_LOGIN_SUCCESS', { userId: user.id, ip, userAgent: ua });
    return NextResponse.json({ ok: true, user: { email: user.email, name: user.name } });
  } catch {
    return NextResponse.json({ error: 'طلب غير صالح' }, { status: 400 });
  }
}
