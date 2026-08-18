import { cookies } from 'next/headers';
import { prisma } from './db';
import bcrypt from 'bcryptjs';

const SESSION_COOKIE = 'mose_customer_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 يوم تذكرني

export function setCustomerSession(customerId: string) {
  cookies().set(SESSION_COOKIE, customerId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export function clearCustomerSession() {
  cookies().delete(SESSION_COOKIE);
}

export async function getCustomerSession() {
  const id = cookies().get(SESSION_COOKIE)?.value;
  if (!id) return null;
  try {
    const customer = await prisma.customer.findUnique({ where: { id } });
    return customer;
  } catch {
    return null;
  }
}

const PHONE_RE = /^(\+212|0)([ \-]?\d){9}$/;

export function normalizePhone(phone: string) {
  return phone.replace(/\s|-/g, '');
}

export async function registerCustomer(data: {
  name: string;
  phone: string;
  email?: string;
  password: string;
  city?: string;
}) {
  const phone = normalizePhone(data.phone);
  if (!PHONE_RE.test(phone)) throw new Error('رقم الهاتف غير صالح');
  if (!data.name || data.name.trim().length < 3) throw new Error('الاسم الكامل مطلوب (3 أحرف على الأقل)');
  if (!data.password || data.password.length < 6) throw new Error('كلمة المرور 6 أحرف على الأقل');

  const passwordHash = await bcrypt.hash(data.password, 10);

  const existing = await prisma.customer.findUnique({ where: { phone } });
  if (existing) {
    if (existing.passwordHash) throw new Error('هذا الرقم مسجّل مسبقاً، سجّل الدخول');
    const updated = await prisma.customer.update({
      where: { phone },
      data: { name: data.name.trim(), email: data.email || null, city: data.city || existing.city, passwordHash },
    });
    return updated;
  }

  return prisma.customer.create({
    data: {
      name: data.name.trim(),
      phone,
      email: data.email || null,
      city: data.city || null,
      passwordHash,
    },
  });
}

export async function verifyCustomerCredentials(phone: string, password: string) {
  const customer = await prisma.customer.findUnique({ where: { phone: normalizePhone(phone) } });
  if (!customer || !customer.passwordHash) return null;
  const ok = await bcrypt.compare(password, customer.passwordHash);
  return ok ? customer : null;
}
