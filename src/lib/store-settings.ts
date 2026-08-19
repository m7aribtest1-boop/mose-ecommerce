import { prisma } from '@/lib/db';
import { storeConfig } from './store';

const DEFAULTS = {
  id: 'singleton',
  storeName: storeConfig.name,
  whatsappNumber: storeConfig.whatsapp.number,
  currency: storeConfig.currency,
  shippingText: null as string | null,
  heroHeadline: null as string | null,
  heroSubheadline: null as string | null,
  brandStory: null as string | null,
  aboutText: null as string | null,
  sizeGuideText: null as string | null,
};

export async function getStoreSettings() {
  const row = await prisma.storeSettings.findUnique({ where: { id: 'singleton' } });
  if (row) return row;
  try {
    return await prisma.storeSettings.create({ data: { ...DEFAULTS } });
  } catch {
    return { ...DEFAULTS, createdAt: new Date(), updatedAt: new Date() };
  }
}
