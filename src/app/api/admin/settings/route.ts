import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { getStoreSettings } from '@/lib/store-settings';
import { logAdmin, getClientIp } from '@/lib/audit';
import { storeConfig } from '@/lib/store';

const FIELDS = [
  'storeName', 'whatsappNumber', 'currency', 'shippingText',
  'heroHeadline', 'heroSubheadline', 'brandStory', 'aboutText', 'sizeGuideText',
];

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  const s = await getStoreSettings();
  return NextResponse.json({ settings: s });
}

export async function PUT(request: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  try {
    const body = await request.json();
    const data: Record<string, unknown> = {};
    for (const f of FIELDS) {
      if (body[f] !== undefined) data[f] = body[f];
    }
    if (body.socialJson !== undefined) {
      try {
        data.socialJson = body.socialJson ? JSON.parse(body.socialJson) : null;
      } catch {
        return NextResponse.json({ error: 'JSON غير صالح لروابط الشبكات' }, { status: 400 });
      }
    }
    const updated = await prisma.storeSettings.upsert({
      where: { id: 'singleton' },
      update: data,
      create: {
        id: 'singleton',
        whatsappNumber: (data.whatsappNumber as string) || storeConfig.whatsapp.number,
        storeName: (data.storeName as string) || storeConfig.name,
        ...data,
      },
    });
    await logAdmin('SETTINGS_UPDATE', {
      userId: admin.id,
      ip: getClientIp(request),
      userAgent: request.headers.get('user-agent') || null,
    });
    return NextResponse.json({ settings: updated });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'خطأ' }, { status: 400 });
  }
}
