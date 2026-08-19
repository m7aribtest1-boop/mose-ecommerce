import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const notifications = await prisma.adminNotification.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  const unread = notifications.filter((n) => !n.read).length;
  return NextResponse.json({ notifications, unread });
}

export async function POST(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let body: any = {};
  try { body = await req.json(); } catch {}
  if (body.markAll) {
    await prisma.adminNotification.updateMany({ where: { read: false }, data: { read: true } });
  } else if (body.id) {
    await prisma.adminNotification.update({ where: { id: String(body.id) }, data: { read: true } });
  }
  return NextResponse.json({ ok: true });
}
