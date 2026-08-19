import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

const EVENT_TYPES = [
  'ADMIN_LOGIN_SUCCESS', 'ADMIN_LOGIN_FAILED', 'ADMIN_LOGIN_BLOCKED',
  'ORDER_STATUS_CHANGE', 'ORDER_REFUND', 'PRODUCT_CREATE', 'SETTINGS_UPDATE',
];

const LABELS: Record<string, string> = {
  ADMIN_LOGIN_SUCCESS: 'دخول ناجح',
  ADMIN_LOGIN_FAILED: 'دخول فاشل',
  ADMIN_LOGIN_BLOCKED: 'دخول محجوب (كثرة المحاولات)',
  ORDER_STATUS_CHANGE: 'تغيير حالة طلب',
  ORDER_REFUND: 'استرجاع/استرداد',
  PRODUCT_CREATE: 'إنشاء منتج',
  SETTINGS_UPDATE: 'تعديل الإعدادات',
};

export async function GET(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const eventType = searchParams.get('eventType');
  const where: Record<string, unknown> = {};
  if (eventType && eventType !== 'all') where.eventType = eventType;

  const logs = await prisma.adminAuditLog.findMany({
    where,
    orderBy: { timestamp: 'desc' },
    take: 200,
  });

  const userIds = Array.from(new Set(logs.map((l) => l.userId).filter(Boolean))) as string[];
  const users = userIds.length
    ? await prisma.adminUser.findMany({ where: { id: { in: userIds } }, select: { id: true, email: true } })
    : [];
  const userMap = new Map(users.map((u) => [u.id, u.email]));

  const data = logs.map((l) => ({
    ...l,
    email: l.userId ? userMap.get(l.userId) || l.userId : null,
    label: LABELS[l.eventType] || l.eventType,
  }));

  return NextResponse.json({ logs: data, eventTypes: EVENT_TYPES, labels: LABELS });
}
