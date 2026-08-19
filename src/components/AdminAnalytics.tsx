'use client';

import { useState, useEffect, useCallback } from 'react';

interface Daily { date: string; pageViews: number; uniqueSessions: number; addToCarts: number; orders: number; revenue: number; }
interface FunnelStep { step: string; value: number; }
interface TopProduct { productId: string; name: string; views: number; addToCarts: number; }
interface KeyVal { key: string; value: number; }
interface AnalyticsData {
  range: { from: string; to: string };
  totals: {
    pageViews: number; uniqueSessions: number; productViews: number; addToCarts: number;
    checkoutStarts: number; orders: number; whatsappClicks: number; revenue: number; conversionRate: number;
  };
  funnel: FunnelStep[];
  daily: Daily[];
  topProducts: TopProduct[];
  bySource: KeyVal[]; byReferrer: KeyVal[]; byCountry: KeyVal[]; byDevice: KeyVal[];
}

function toInputDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function fmt(n: number) {
  return n.toLocaleString('fr-MA');
}
function fmtMoney(n: number) {
  return `${n.toLocaleString('fr-MA', { maximumFractionDigits: 2 })} درهم`;
}

export default function AdminAnalytics() {
  const [from, setFrom] = useState(toInputDate(new Date(Date.now() - 6 * 86400000)));
  const [to, setTo] = useState(toInputDate(new Date()));
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`/api/admin/analytics?from=${from}&to=${to}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('فشل تحميل البيانات');
      setData(await res.json());
    } catch (e) {
      setError('تعذر تحميل التحليلات — حاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => { load(); }, [load]);

  function exportCsv() {
    if (!data) return;
    const header = 'date,pageViews,uniqueSessions,addToCarts,orders,revenue\n';
    const rows = data.daily
      .map((d) => `${d.date},${d.pageViews},${d.uniqueSessions},${d.addToCarts},${d.orders},${d.revenue}`)
      .join('\n');
    const blob = new Blob(['﻿' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mose-analytics-${data.range.from.slice(0, 10)}_${data.range.to.slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const kpis = data
    ? [
        { label: 'مشاهدات الصفحات', value: fmt(data.totals.pageViews), color: 'text-primary-900' },
        { label: 'زوار فريدون', value: fmt(data.totals.uniqueSessions), color: 'text-primary-600' },
        { label: 'مشاهدات منتج', value: fmt(data.totals.productViews), color: 'text-primary-900' },
        { label: 'إضافات للسلة', value: fmt(data.totals.addToCarts), color: 'text-accent-600' },
        { label: 'بدء الدفع', value: fmt(data.totals.checkoutStarts), color: 'text-primary-600' },
        { label: 'طلبات', value: fmt(data.totals.orders), color: 'text-green-600' },
        { label: 'نسبة التحويل', value: `${data.totals.conversionRate.toFixed(1)}%`, color: 'text-green-600' },
        { label: 'الإيرادات', value: fmtMoney(data.totals.revenue), color: 'text-green-600' },
      ]
    : [];

  const maxViews = data ? Math.max(1, ...data.daily.map((d) => d.pageViews)) : 1;

  return (
    <main className="min-h-screen bg-secondary-100">
      <div className="bg-white border-b border-secondary-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary-900">📊 تحليلات المتجر</h1>
          <a href="/admin" className="text-primary-600 hover:underline text-sm">← اللوحة</a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-end gap-4 mb-8 bg-white rounded-xl shadow-sm p-5">
          <div>
            <label className="block text-sm text-secondary-500 mb-1">من</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border border-secondary-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-secondary-500 mb-1">إلى</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border border-secondary-300 rounded-lg px-3 py-2" />
          </div>
          <button onClick={load} disabled={loading} className="btn-primary px-6 py-2.5 disabled:opacity-50">
            {loading ? 'جارٍ التحميل…' : 'تطبيق'}
          </button>
          <button onClick={exportCsv} disabled={!data} className="btn-outline px-6 py-2.5 disabled:opacity-50">⬇ تصدير CSV</button>
          <span className="text-xs text-secondary-400 mr-auto">البيانات بدون معلومات شخصية — فقط إحصائيات مجهولة.</span>
        </div>

        {error && <div className="bg-red-50 text-red-700 rounded-lg p-3 mb-6">{error}</div>}

        {data && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {kpis.map((k) => (
                <div key={k.label} className="bg-white rounded-xl shadow-sm p-5">
                  <div className="text-sm text-secondary-500 mb-1">{k.label}</div>
                  <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="font-bold text-primary-900 mb-4">مسار التحويل</h2>
              <div className="space-y-3">
                {data.funnel.map((step, i, arr) => {
                  const prev = i === 0 ? step.value : arr[i - 1].value;
                  const pct = prev > 0 ? Math.round((step.value / prev) * 100) : 0;
                  return (
                    <div key={step.step} className="flex items-center gap-3">
                      <div className="w-36 text-sm text-secondary-700">{step.step}</div>
                      <div className="flex-1 bg-secondary-100 rounded-full h-6 relative overflow-hidden">
                        <div className="bg-primary-500 h-full" style={{ width: `${Math.min(100, pct)}%` }} />
                      </div>
                      <div className="w-20 text-right text-sm font-bold text-primary-900">{fmt(step.value)}</div>
                      <div className="w-12 text-left text-xs text-secondary-500">{i === 0 ? '—' : `${pct}%`}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="font-bold text-primary-900 mb-4">المشاهدات اليومية</h2>
              <div className="flex items-end gap-1 h-40 mb-2 border-b border-secondary-200">
                {data.daily.map((d) => (
                  <div key={d.date} className="flex-1 flex flex-col items-center justify-end group relative" title={`${d.date}: ${fmt(d.pageViews)} مشاهدة`}>
                    <div className="bg-primary-400 w-full rounded-t" style={{ height: `${(d.pageViews / maxViews) * 100}%`, minHeight: '2px' }} />
                  </div>
                ))}
              </div>
              <div className="flex gap-1 text-[10px] text-secondary-400">
                {data.daily.map((d) => (
                  <div key={d.date} className="flex-1 text-center truncate">{d.date.slice(5)}</div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="font-bold text-primary-900 mb-3">المنتجات الأكثر مشاهدة</h2>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-secondary-500 text-right">
                      <th className="pb-2 font-medium">المنتج</th>
                      <th className="pb-2 font-medium">مشاهدات</th>
                      <th className="pb-2 font-medium">أضيف للسلة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topProducts.length === 0 && (
                      <tr><td colSpan={3} className="text-center text-secondary-400 py-4">لا توجد بيانات</td></tr>
                    )}
                    {data.topProducts.map((p) => (
                      <tr key={p.productId} className="border-t border-secondary-100">
                        <td className="py-2 text-primary-900 truncate max-w-[180px]">{p.name}</td>
                        <td className="py-2 text-center">{fmt(p.views)}</td>
                        <td className="py-2 text-center text-accent-600">{fmt(p.addToCarts)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="font-bold text-primary-900 mb-3">مصادر الزيارات (UTM)</h2>
                <SourceList items={data.bySource} />
                <h3 className="font-semibold text-primary-700 mt-4 mb-2 text-sm">حسب الدولة</h3>
                <SourceList items={data.byCountry} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="font-bold text-primary-900 mb-3">المحيلون (Referrers)</h2>
                <SourceList items={data.byReferrer} />
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="font-bold text-primary-900 mb-3">الأجهزة</h2>
                <SourceList items={data.byDevice} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-primary-900 mb-3">تفاصيل يومية</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-secondary-500 text-right">
                      <th className="pb-2 font-medium">التاريخ</th>
                      <th className="pb-2 font-medium">مشاهدات</th>
                      <th className="pb-2 font-medium">زوار</th>
                      <th className="pb-2 font-medium">سلة</th>
                      <th className="pb-2 font-medium">طلبات</th>
                      <th className="pb-2 font-medium">إيرادات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.daily.map((d) => (
                      <tr key={d.date} className="border-t border-secondary-100">
                        <td className="py-2">{d.date}</td>
                        <td className="py-2 text-center">{fmt(d.pageViews)}</td>
                        <td className="py-2 text-center">{fmt(d.uniqueSessions)}</td>
                        <td className="py-2 text-center text-accent-600">{fmt(d.addToCarts)}</td>
                        <td className="py-2 text-center text-green-600">{fmt(d.orders)}</td>
                        <td className="py-2 text-center">{fmtMoney(d.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function SourceList({ items }: { items: KeyVal[] }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  if (items.length === 0) return <p className="text-secondary-400 text-sm">لا توجد بيانات</p>;
  return (
    <div className="space-y-2">
      {items.slice(0, 8).map((i) => (
        <div key={i.key} className="flex items-center gap-2">
          <div className="w-40 truncate text-sm text-secondary-700" title={i.key}>{i.key}</div>
          <div className="flex-1 bg-secondary-100 rounded-full h-4 overflow-hidden">
            <div className="bg-primary-400 h-full" style={{ width: `${(i.value / max) * 100}%` }} />
          </div>
          <div className="w-12 text-left text-xs text-secondary-500">{fmt(i.value)}</div>
        </div>
      ))}
    </div>
  );
}
