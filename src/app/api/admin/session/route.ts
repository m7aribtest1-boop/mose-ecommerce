import { NextResponse } from 'next/server';
import { getAdminSession, clearAdminSession } from '@/lib/auth';

export async function GET() {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ authenticated: false });
  return NextResponse.json({ authenticated: true, user: { email: user.email, name: user.name } });
}

export async function POST() {
  clearAdminSession();
  return NextResponse.json({ ok: true });
}