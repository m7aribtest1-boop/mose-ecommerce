import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(2),
  phone: z.string().trim().optional().or(z.literal('')),
  email: z.string().trim().email().optional().or(z.literal('')),
  message: z.string().trim().min(5),
});

export async function POST(request: Request) {
  try {
    const body = contactSchema.parse(await request.json());
    const msg = await prisma.contactMessage.create({ data: body });
    return NextResponse.json({ ok: true, id: msg.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'رسالة غير صالحة' }, { status: 400 });
  }
}