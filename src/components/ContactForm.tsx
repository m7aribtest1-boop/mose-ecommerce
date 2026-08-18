'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'استفسار عن منتج', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus('ok');
      setMsg('تم استلام رسالتك ✓ سنتواصل معك قريباً.');
      setForm({ name: '', email: '', subject: 'استفسار عن منتج', message: '' });
    } catch {
      setStatus('error');
      setMsg('تعذر إرسال الرسالة، حاول مجدداً أو تواصل معنا عبر واتساب.');
    }
  }

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">الاسم الكامل *</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="input-field"
          placeholder="اسمك"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">البريد الإلكتروني *</label>
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="input-field"
          placeholder="example@email.com"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-secondary-700 mb-1">الموضوع</label>
        <select
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="input-field"
        >
          <option>استفسار عن منتج</option>
          <option>حالة الطلب</option>
          <option>إرجاع / استبدال</option>
          <option>تفصيل حسب المقاس</option>
          <option>أخرى</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-secondary-700 mb-1">رسالتك *</label>
        <textarea
          required
          rows={6}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="input-field"
          placeholder="اكتب رسالتك هنا..."
        />
      </div>
      <div className="md:col-span-2">
        <button type="submit" disabled={status === 'sending'} className="btn-primary w-full md:w-auto px-10 py-3.5 disabled:opacity-50">
          {status === 'sending' ? 'جارٍ الإرسال...' : 'إرسال الرسالة'}
        </button>
        {msg && (
          <p className={`mt-3 text-sm ${status === 'ok' ? 'text-accent-600' : 'text-primary-600'}`}>{msg}</p>
        )}
      </div>
    </form>
  );
}
