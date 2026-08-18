'use client';

import { useState } from 'react';

export default function ReviewForm({ productId }: { productId: string }) {
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setMsg('');
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, rating, title, body }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('done');
        setMsg(data.message);
        setAuthor('');
        setTitle('');
        setBody('');
      } else {
        setStatus('error');
        setMsg(data.error || 'تعذر الإرسال');
      }
    } catch {
      setStatus('error');
      setMsg('خطأ في الاتصال — أعد المحاولة');
    }
  }

  if (status === 'done') {
    return (
      <div className="bg-accent-50 border border-accent-300 text-accent-800 rounded-lg p-4 text-sm">
        ✓ {msg}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card p-6 mt-6">
      <h3 className="text-lg font-bold text-primary-900 mb-4">شاركي رأيك</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">الاسم</label>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="input-field"
            placeholder="اسمك"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">التقييم</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="input-field"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} نجوم
              </option>
            ))}
          </select>
        </div>
      </div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input-field mb-4"
        placeholder="عنوان الرأي (اختياري)"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        className="input-field mb-4"
        placeholder="اكتبي تجربتك مع المنتج..."
        required
      />
      {status === 'error' && <div className="text-primary-600 text-sm mb-3">{msg}</div>}
      <button type="submit" disabled={status === 'sending'} className="btn-primary px-8 py-3 disabled:opacity-50">
        {status === 'sending' ? 'جارٍ الإرسال...' : 'إرسال التقييم'}
      </button>
    </form>
  );
}
