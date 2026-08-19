import { prisma } from '@/lib/db';

export async function logAdmin(
  eventType: string,
  opts: { userId?: string | null; ip?: string | null; userAgent?: string | null; metadata?: unknown } = {}
) {
  try {
    await prisma.adminAuditLog.create({
      data: {
        eventType,
        userId: opts.userId ?? null,
        ip: opts.ip ?? null,
        userAgent: opts.userAgent ?? null,
        metadata: (opts.metadata as object) ?? undefined,
      },
    });
  } catch {
    // never block the request on audit failure
  }
}

export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}
