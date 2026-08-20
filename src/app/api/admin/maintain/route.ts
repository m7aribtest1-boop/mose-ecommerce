import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  const secret = request.headers.get('x-maintain-secret');
  if (!secret || secret !== process.env.MOSE_MAINT_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const counts: Record<string, number> = {};
  const tables = [
    'returnRequest', 'orderItem', 'order', 'customer', 'contactMessage',
    'subscriber', 'review', 'analyticsEvent', 'aggregatedStat',
    'adminAuditLog', 'adminNotification',
  ] as const;
  for (const t of tables) {
    counts[t] = (await (prisma as unknown as Record<string, { deleteMany: () => Promise<{ count: number }> }>)[t].deleteMany()).count;
  }
  const newPassword = crypto.randomBytes(6).toString('base64url');
  const admin = await prisma.adminUser.findUnique({ where: { email: 'admin@mose.ma' } });
  if (admin) {
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { passwordHash: await bcrypt.hash(newPassword, 10), totpEnabled: false, totpSecret: null },
    });
  } else {
    await prisma.adminUser.create({
      data: { email: 'admin@mose.ma', name: 'مدير موسى', passwordHash: await bcrypt.hash(newPassword, 10) },
    });
  }
  return NextResponse.json({ ok: true, adminEmail: 'admin@mose.ma', adminPassword: newPassword, counts });
}