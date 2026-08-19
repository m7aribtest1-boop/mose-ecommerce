import { NextResponse } from 'next/server';
import { getStoreSettings } from '@/lib/store-settings';

export async function GET() {
  const s = await getStoreSettings();
  return NextResponse.json({ whatsappNumber: s.whatsappNumber, storeName: s.storeName });
}
