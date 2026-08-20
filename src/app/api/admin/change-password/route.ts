import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { logAdmin, getClientIp } from '@/lib/audit';

export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;
    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return NextResponse.json({ error: 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل' }, { status: 400 });
    }
    const ok = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!ok) return NextResponse.json({ error: 'كلمة المرور الحالية غير صحيحة' }, { status: 401 });

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.adminUser.update({ where: { id: admin.id }, data: { passwordHash } });
    await logAdmin('ADMIN_PASSWORD_CHANGED', {
      userId: admin.id,
      ip: getClientIp(request),
      userAgent: request.headers.get('user-agent') || null,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'طلب غير صالح' }, { status: 400 });
  }
}