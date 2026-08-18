'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { storeConfig } from '@/lib/store';

interface LastOrder {
  orderNumber: string; total: number; customerName: string; city: string; paymentMethod: string;
}

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('mose-last-order');
    if (raw) {
      try { setOrder(JSON.parse(raw)); } catch {}
    }
  }, []);

  const waNumber = storeConfig.whatsapp.number;
  const waMessage = order
    ? `سلام ${order.customerName}، طلبي رقم ${order.orderNumber} فمتجر موسى.`
    : 'سلام، عندي سؤال حول طلبي فمتجر موسى.';

  return (
    <main className="flex-1 bg-secondary-50 py-20">
      <div className="container-custom max-w-2xl text-center">
        <div className="text-7xl mb-6">✅</div>
        <h1 className="text-3xl font-bold text-primary-900 mb-3">تم تسجيل طلبك بنجاح!</h1>
        {order ? (
          <>
            <p className="text-secondary-600 mb-2">رقم الطلب: <b className="text-primary-600">{order.orderNumber}</b></p>
            <p className="text-secondary-600 mb-6">
              المجموع: <b>{order.total.toLocaleString('fr-MA')} درهم</b> · {order.city} · {order.paymentMethod}
            </p>
          </>
        ) : (
          <p className="text-secondary-600 mb-6">شكراً لثقتك بمتجر موسى</p>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 text-right">
          <h2 className="font-bold text-primary-900 mb-3">الخطوات الجاية 👇</h2>
          <ol className="space-y-2 text-secondary-700 text-sm list-decimal pr-5">
            <li>سنؤكد طلبك عبر <b>الهاتف أو واتساب</b> خلال ساعات العمل (للدفع عند الاستلام).</li>
            <li>بعد التأكيد، نجهز الطلب ونشحنه خلال 24-48 ساعة.</li>
            <li>ستصلك رسالة واتساب عند خروج الطلب للتوصيل.</li>
            <li>استلم طلبك وادفع عند الاستلام — وإذا ما عجبك المقاس، إرجاع سهل خلال 7 أيام.</li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`}
            target="_blank" rel="noreferrer"
            className="bg-accent-600 hover:bg-accent-700 text-white font-semibold px-8 py-3 rounded-xl transition"
          >
            💬 تأكيد عبر واتساب
          </a>
          <Link href="/products" className="btn-primary px-8 py-3">متابعة التسوق</Link>
        </div>
      </div>
    </main>
  );
}