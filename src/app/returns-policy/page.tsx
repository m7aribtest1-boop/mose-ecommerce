import type { Metadata } from 'next';
import { storeConfig } from '@/lib/store';

export const metadata: Metadata = {
  title: 'سياسة الإرجاع والاستبدال | متجر موسى',
};

export default function ReturnsPolicyPage() {
  return (
    <main className="flex-1">
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-12">
        <div className="container-custom text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">الإرجاع والاستبدال</h1>
        </div>
      </section>
      <section className="py-12 bg-secondary-50">
        <div className="container-custom max-w-3xl">
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-bold text-primary-900 mb-4">شروط الإرجاع (خلال {storeConfig.returns.windowDays} أيام)</h2>
            <p className="text-sm text-secondary-600 mb-4">
              وفقاً للقانون المغربي (31-08) الخاص بالبيع عن بعد، يحق لك إرجاع أو استبدال المنتج خلال{' '}
              {storeConfig.returns.windowDays} أيام من الاستلام، بشرط:
            </p>
            <ul className="space-y-2 text-sm text-secondary-700 list-disc pr-5">
              {storeConfig.returns.conditions.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </div>

          <div className="card p-6 mb-6">
            <h2 className="text-xl font-bold text-primary-900 mb-4">كيف ترجعين المنتج؟</h2>
            <ol className="space-y-2 text-sm text-secondary-700 list-decimal pr-5">
              <li>اتصلي بنا عبر واتساب أو الهاتف خلال {storeConfig.returns.windowDays} أيام من الاستلام.</li>
              <li>نعطيك العنوان لإرجاع المنتج أو ننسق استلامه.</li>
              <li>بعد الفحص والموافقة، نرسل لك البديل (أو المبلغ في حالة دفع إلكتروني).</li>
            </ol>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold text-primary-900 mb-4">حالات خاصة</h2>
            <ul className="space-y-3 text-sm text-secondary-700">
              <li><b>عيب في الصنع:</b> نتكلف بالشحن، ونستبدل أو نسترجع كاملاً.</li>
              <li><b>تغيير الرأي (مقاس/لون):</b> تشحنيه إلينا ويتم الاستبدال، وتكاليف الشحن على العميلة.</li>
              <li><b>الطلبات الخاصة (مقاس خارجي/تطريز مخصص):</b> غير قابلة للإرجاع — نوضح هذا قبل تأكيد الطلب.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}