'use client';

import { useState, useEffect } from 'react';

interface AuditLog {
  id: string;
  eventType: string;
  label: string;
  email: string | null;
  ip: string | null;
  userAgent: string | null;
  metadata: unknown;
  timestamp: string;
}

export default function AdminAudit() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/audit?eventType=${filter}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        setLogs(d.logs || []);
        setEventTypes(d.eventTypes || []);
        setLabels(d.labels || {});
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <main className="min-h-screen bg-secondary-100">
      <div className="bg-white border-b border-secondary-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary-900">🛡️ سجل الأحداث الأمني</h1>
          <a href="/admin" className="text-primary-600 hover:underline text-sm">← اللوحة</a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-5">
          <label className="text-sm text-secondary-600">تصفية:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-secondary-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">الكل</option>
            {eventTypes.map((t) => (
              <option key={t} value={t}>{labels[t] || t}</option>
            ))}
          </select>
          {loading && <span className="text-sm text-secondary-400">جارٍ التحميل…</span>}
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-secondary-50 text-secondary-500">
                <tr>
                  <th className="p-3 font-medium">الوقت</th>
                  <th className="p-3 font-medium">الحدث</th>
                  <th className="p-3 font-medium">المستخدم</th>
                  <th className="p-3 font-medium">IP</th>
                  <th className="p-3 font-medium">التفاصيل</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 && (
                  <tr><td colSpan={5} className="text-center text-secondary-400 py-8">لا توجد أحداث</td></tr>
                )}
                {logs.map((l) => (
                  <tr key={l.id} className="border-t border-secondary-100 align-top">
                    <td className="p-3 whitespace-nowrap text-secondary-600">
                      {new Date(l.timestamp).toLocaleString('fr-MA', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="p-3">
                      <span className="inline-block bg-primary-50 text-primary-700 text-xs font-bold px-2 py-1 rounded-full">
                        {l.label}
                      </span>
                    </td>
                    <td className="p-3 text-secondary-700">{l.email || '—'}</td>
                    <td className="p-3 text-secondary-700 font-mono text-xs">{l.ip || '—'}</td>
                    <td className="p-3 text-secondary-600 max-w-xs">
                      {l.metadata ? (
                        <code className="block text-xs bg-secondary-50 rounded p-2 whitespace-pre-wrap break-all">
                          {JSON.stringify(l.metadata)}
                        </code>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-xs text-secondary-400 mt-3">
          يسجّل الدخول، تغييرات الطلبات، والإعدادات — لأغراض الأمن والمراجعة. لا يُسجَّل أي بيانات عملاء.
        </p>
      </div>
    </main>
  );
}
