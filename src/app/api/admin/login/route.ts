import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { verifyAdminCredentials, setAdminSession } from '@/lib/auth';
import { logAdmin, getClientIp } from '@/lib/audit';
import { verifyTotp } from '@/lib/totp';

const CHALLENGE_SECRET = process.env.MOSE_SESSION_SECRET || 'mose-dev-2fa-challenge-secret';

function signChallenge(userId: string): string {
  const exp = Date.now() + 5 * 60 * 1000; // 5 min
  const data = `${userId}.${exp}`;
  const sig = crypto.createHmac('sha256', CHALLENGE_SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

function verifyChallenge(token: string): string | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [userId, exp, sig] = parts;
  const expected = crypto.createHmac('sha256', CHALLENGE_SECRET).update(`${userId}.${exp}`).digest('base64url');
  if (sig !== expected) return null;
  if (Date.now() > Number(exp)) return null;
  return userId;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const ua = request.headers.get('user-agent') || null;
  try {
    const body = await request.json();
    const { email, password, challenge, code } = body;

    // ── Step 2: verify TOTP after password ────────────────
    if (challenge && code) {
      const userId = verifyChallenge(challenge);
      if (!userId) return NextResponse.json({ error: 'انتهت صلاحية التحقق — أعد الدخول' }, { status: 400 });
      const user = await prisma.adminUser.findUnique({ where: { id: userId } });
      if (!user || !user.totpEnabled || !user.totpSecret) {
        return NextResponse.json({ error: 'المصادقة الثنائية غير مفعلة' }, { status: 400 });
      }
      if (!verifyTotp(user.totpSecret, code)) {
        await logAdmin('ADMIN_LOGIN_2FA_FAILED', { userId: user.id, ip, userAgent: ua });
        return NextResponse.json({ error: 'رمز التحقق غير صحيح' }, { status: 401 });
      }
      setAdminSession(user.id);
      await logAdmin('ADMIN_LOGIN_SUCCESS', { userId: user.id, ip, userAgent: ua, metadata: { twoFactor: true } });
      return NextResponse.json({ ok: true, user: { email: user.email, name: user.name } });
    }

    // ── Step 1: verify password ───────────────────────────
    if (!email || !password) {
      return NextResponse.json({ error: 'البريد وكلمة المرور مطلوبان' }, { status: 400 });
    }

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

    if (user.totpEnabled && user.totpSecret) {
      return NextResponse.json({ twoFactorRequired: true, challenge: signChallenge(user.id) });
    }

    setAdminSession(user.id);
    await logAdmin('ADMIN_LOGIN_SUCCESS', { userId: user.id, ip, userAgent: ua });
    return NextResponse.json({ ok: true, user: { email: user.email, name: user.name } });
  } catch {
    return NextResponse.json({ error: 'طلب غير صالح' }, { status: 400 });
  }
}
