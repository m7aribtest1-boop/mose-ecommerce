'use client';

import { useState, useEffect } from 'react';

const FIELDS = [
  { key: 'storeName', label: 'اسم المتجر', type: 'text' },
  { key: 'whatsappNumber', label: 'رقم واتساب (مثال: 212600000000)', type: 'text' },
  { key: 'currency', label: 'العملة', type: 'text' },
  { key: 'shippingText', label: 'نص الشحن', type: 'textarea' },
  { key: 'heroHeadline', label: 'عنوان الصفحة الرئيسية', type: 'text' },
  { key: 'heroSubheadline', label: 'العنوان الفرعي', type: 'text' },
  { key: 'brandStory', label: 'قصة العلامة', type: 'textarea' },
  { key: 'aboutText', label: 'من نحن', type: 'textarea' },
  { key: 'sizeGuideText', label: 'دليل المقاسات', type: 'textarea' },
];

export default function AdminSettings() {
  const [s, setS] = useState<Record<string, string>>({});
  const [social, setSocial] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const [totpEnabled, setTotpEnabled] = useState(false);
  const [totpSetup, setTotpSetup] = useState<{ secret: string; uri: string } | null>(null);
  const [totpCode, setTotpCode] = useState('');
  const [totpMsg, setTotpMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings', { cache: 'no-store' })
      .then((r) => r.json())
          .then((d) => {
            if (d.settings) {
              setTotpEnabled(Boolean(d.totpEnabled));
              setS({
            storeName: d.settings.storeName || '',
            whatsappNumber: d.settings.whatsappNumber || '',
            currency: d.settings.currency || '',
            shippingText: d.settings.shippingText || '',
            heroHeadline: d.settings.heroHeadline || '',
            heroSubheadline: d.settings.heroSubheadline || '',
            brandStory: d.settings.brandStory || '',
            aboutText: d.settings.aboutText || '',
            sizeGuideText: d.settings.sizeGuideText || '',
          });
          setSocial(d.settings.socialJson ? JSON.stringify(d.settings.socialJson, null, 2) : '');
        }
      })
      .catch(() => setMsg('تعذر التحميل'))
      .finally(() => setLoading(false));
  }, []);

  function set(key: string, val: string) {
    setS((prev) => ({ ...prev, [key]: val }));
  }

  async function startTotp() {
    setTotpMsg('');
    const res = await fetch('/api/admin/2fa');
    const d = await res.json();
    if (res.ok) setTotpSetup(d);
    else setTotpMsg(d.error || 'فشل');
  }
  async function confirmTotp() {
    if (!totpSetup) return;
    setTotpMsg('');
    const res = await fetch('/api/admin/2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: totpSetup.secret, code: totpCode }),
    });
    const d = await res.json();
    if (!res.ok) { setTotpMsg(d.error || 'فشل'); return; }
    setTotpEnabled(true);
    setTotpSetup(null);
    setTotpCode('');
    setTotpMsg('✓ تم تفعيل المصادقة الثنائية');
  }
  async function disableTotp() {
    setTotpMsg('');
    const res = await fetch('/api/admin/2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disable: true }),
    });
    const d = await res.json();
    if (!res.ok) { setTotpMsg(d.error || 'فشل'); return; }
    setTotpEnabled(false);
    setTotpMsg('تم تعطيل المصادقة الثنائية');
  }

  async function save() {
    setSaving(true);
    setMsg('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...s, socialJson: social }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'خطأ');
      setMsg('✓ تم الحفظ');
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'فشل الحفظ');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-6 text-secondary-500">جارٍ التحميل…</div>;

  return (
    <main className="min-h-screen bg-secondary-100">
      <div className="bg-white border-b border-secondary-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary-900">⚙️ إعدادات المتجر</h1>
          <a href="/admin" className="text-primary-600 hover:underline text-sm">← اللوحة</a>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label className="block text-sm text-secondary-700 mb-1">{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea
                  value={s[f.key] || ''}
                  onChange={(e) => set(f.key, e.target.value)}
                  rows={3}
                  className="w-full border border-secondary-300 rounded-lg px-3 py-2"
                />
              ) : (
                <input
                  value={s[f.key] || ''}
                  onChange={(e) => set(f.key, e.target.value)}
                  className="w-full border border-secondary-300 rounded-lg px-3 py-2"
                />
              )}
            </div>
          ))}
          <div>
            <label className="block text-sm text-secondary-700 mb-1">روابط الشبكات (JSON)</label>
            <textarea
              value={social}
              onChange={(e) => setSocial(e.target.value)}
              rows={4}
              className="w-full border border-secondary-300 rounded-lg px-3 py-2 font-mono text-xs"
              placeholder='{"instagram":"https://instagram.com/...","facebook":"https://facebook.com/..."}'
            />
          </div>
          <button onClick={save} disabled={saving} className="btn-primary px-8 py-3 disabled:opacity-50">
            {saving ? 'جارٍ الحفظ…' : 'حفظ التغييرات'}
          </button>
          {msg && <div className="text-sm text-primary-600">{msg}</div>}
          <p className="text-xs text-secondary-400">رقم واتساب يظهر فوراً فالزر العائم وباقي أزرار المتجر.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-primary-900">🔐 المصادقة الثنائية (2FA)</h2>
          {totpEnabled ? (
            <>
              <p className="text-sm text-green-600">✓ المصادقة الثنائية مفعّلة على حسابك.</p>
              <button onClick={disableTotp} className="btn-outline px-5 py-2 text-sm">تعطيل 2FA</button>
            </>
          ) : totpSetup ? (
            <>
              <p className="text-sm text-secondary-600">امسح الكود بـ Google Authenticator أو أدخل السر يدوياً، ثم أكّد بالرمز:</p>
              <div className="bg-secondary-50 rounded-lg p-3 text-xs font-mono break-all">{totpSetup.uri}</div>
              <div>
                <label className="block text-sm text-secondary-700 mb-1">السر (Secret)</label>
                <div className="bg-secondary-50 rounded-lg p-2 font-mono text-sm break-all">{totpSetup.secret}</div>
              </div>
              <input
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                placeholder="123456"
                inputMode="numeric"
                className="w-full border border-secondary-300 rounded-lg px-3 py-2 text-center tracking-widest"
              />
              <div className="flex gap-2">
                <button onClick={confirmTotp} className="btn-primary px-5 py-2 text-sm">تأكيد وتفعيل</button>
                <button onClick={() => setTotpSetup(null)} className="btn-outline px-5 py-2 text-sm">إلغاء</button>
              </div>
            </>
          ) : (
            <button onClick={startTotp} className="btn-primary px-5 py-2 text-sm">تفعيل 2FA</button>
          )}
          {totpMsg && <div className="text-sm text-primary-600">{totpMsg}</div>}
        </div>
      </div>
    </main>
  );
}
