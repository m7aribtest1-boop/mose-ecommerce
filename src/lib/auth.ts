import { cookies } from 'next/headers';
import { prisma } from './db';
import bcrypt from 'bcryptjs';

const SESSION_COOKIE = 'mose_admin_session';
const SESSION_MAX_AGE = 60 * 60 * 12; // 12 ساعة

export function setAdminSession(userId: string) {
  cookies().set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export function clearAdminSession() {
  cookies().delete(SESSION_COOKIE);
}

export async function getAdminSession() {
  const userId = cookies().get(SESSION_COOKIE)?.value;
  if (!userId) return null;
  try {
    const user = await prisma.adminUser.findUnique({ where: { id: userId } });
    return user;
  } catch {
    return null;
  }
}

export async function verifyAdminCredentials(email: string, password: string) {
  const user = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}