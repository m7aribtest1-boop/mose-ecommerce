import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { generateTotpSecret, verifyTotp, getTotpUri } from '@/lib/totp';

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const secret = generateTotpSecret();
  return NextResponse.json({ secret, uri: getTotpUri(secret, admin.email) });
}

export async function POST(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    if (body.disable) {
      await prisma.adminUser.update({
        where: { id: admin.id },
        data: { totpEnabled: false, totpSecret: null },
      });
      return NextResponse.json({ ok: true, enabled: false });
    }
    const { secret, code } = body;
    if (!secret || !code) {
      return NextResponse.json({ error: 'الرمز والسر مطلوبان' }, { status: 400 });
    }
    if (!verifyTotp(secret, code)) {
      return NextResponse.json({ error: 'رمز التحقق غير صحيح — تأكد من الوقت فجهازك' }, { status: 400 });
    }
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { totpEnabled: true, totpSecret: secret },
    });
    return NextResponse.json({ ok: true, enabled: true });
  } catch {
    return NextResponse.json({ error: 'طلب غير صالح' }, { status: 400 });
  }
}
