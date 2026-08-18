import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const FILE = path.join(process.cwd(), 'data', 'subscribers.json');

export async function POST(request: Request) {
  try {
    const ct = request.headers.get('content-type') || '';
    let email: string | undefined;
    if (ct.includes('application/json')) {
      ({ email } = await request.json());
    } else {
      const form = await request.formData();
      email = (form.get('email') as string) || undefined;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'بريد غير صالح' }, { status: 400 });
    }
    try {
      await fs.mkdir(path.dirname(FILE), { recursive: true });
      let list: string[] = [];
      try {
        list = JSON.parse(await fs.readFile(FILE, 'utf8'));
      } catch {
        list = [];
      }
      if (!list.includes(email)) list.push(email);
      await fs.writeFile(FILE, JSON.stringify(list, null, 2));
    } catch {
      // storage best-effort — still acknowledge the subscriber
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'تعذر الاشتراك' }, { status: 400 });
  }
}
