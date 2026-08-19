'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string | null;
  referenceId?: string | null;
  read: boolean;
  createdAt: string;
}

const TYPE_ICON: Record<string, string> = {
  new_order: '📦',
  low_stock: '⚠️',
  system: '🔧',
};

export default function AdminNotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/notifications', { cache: 'no-store' });
    if (res.ok) {
      const j = await res.json();
      setItems(j.notifications);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function markRead(id: string) {
    await fetch('/api/admin/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  async function markAll() {
    await fetch('/api/admin/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAll: true }),
    });
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <main className="min-h-screen bg-secondary-100">
      <div className="bg-white border-b border-secondary-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary-900">🔔 الإشعارات</h1>
          <Link href="/admin" className="text-primary-600 hover:underline text-sm">← اللوحة</Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-secondary-500">{items.filter((n) => !n.read).length} غير مقروء</span>
          <button onClick={markAll} className="btn-outline px-4 py-2 text-sm">تعليم الكل كمقروء</button>
        </div>

        {loading ? (
          <p className="text-secondary-500">جارٍ التحميل…</p>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-secondary-400">لا توجد إشعارات</div>
        ) : (
          <div className="space-y-3">
            {items.map((n) => (
              <div
                key={n.id}
                className={`bg-white rounded-xl shadow-sm p-4 flex items-start gap-3 ${n.read ? 'opacity-60' : ''}`}
              >
                <div className="text-2xl">{TYPE_ICON[n.type] || '🔔'}</div>
                <div className="flex-1">
                  <div className="font-bold text-primary-900">{n.title}</div>
                  <div className="text-sm text-secondary-600">{n.message}</div>
                  <div className="text-xs text-secondary-400 mt-1">
                    {new Date(n.createdAt).toLocaleString('fr-MA')}
                  </div>
                </div>
                {n.link && (
                  <Link href={n.link} className="text-primary-600 hover:underline text-sm whitespace-nowrap">فتح ←</Link>
                )}
                {!n.read && (
                  <button onClick={() => markRead(n.id)} className="text-green-600 hover:underline text-sm whitespace-nowrap">تم ✓</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
