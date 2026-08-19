import type { Metadata } from 'next';
import { storeConfig } from '@/lib/store';
import { getStoreSettings } from '@/lib/store-settings';

export const metadata: Metadata = {
  title: 'سياسة الشحن والتوصيل | متجر موسى',
};

export const dynamic = 'force-dynamic';

export default async function ShippingPolicyPage() {
  const settings = await getStoreSettings();
  return (
    <main className="flex-1">
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-12">
        <div className="container-custom text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">سياسة الشحن والتوصيل</h1>
        </div>
      </section>
      <section className="py-12 bg-secondary-50">
        <div className="container-custom max-w-3xl">
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-bold text-primary-900 mb-4">أسعار التوصيل داخل المغرب</h2>
            <div className="space-y-3">
              <div className="flex justify-between bg-secondary-50 p-3 rounded-lg text-sm">
                <span>التوصيل القياسي</span>
                <b className="text-primary-600">{storeConfig.shipping.standardFee} درهم</b>
              </div>
              <div className="flex justify-between bg-accent-50 p-3 rounded-lg text-sm">
                <span>شحن مجاني</span>
                <b className="text-accent-600">من {storeConfig.shipping.freeShippingThreshold} درهم</b>
              </div>
              <div className="flex justify-between bg-secondary-50 p-3 rounded-lg text-sm">
                <span>مدة التوصيل — الدار البيضاء</span>
                <b>{storeConfig.delivery.casablanca}</b>
              </div>
              <div className="flex justify-between bg-secondary-50 p-3 rounded-lg text-sm">
                <span>مدة التوصيل — باقي المدن</span>
                <b>{storeConfig.delivery.majorCities}</b>
              </div>
            </div>
          </div>

          {settings.shippingText && (
            <div className="card p-6 mb-6">
              <h2 className="text-xl font-bold text-primary-900 mb-4">📦 ملاحظات الشحن</h2>
              <p className="text-secondary-700 text-sm whitespace-pre-line">{settings.shippingText}</p>
            </div>
          )}

          <div className="card p-6">
            <h2 className="text-xl font-bold text-primary-900 mb-4">نقط مهمة</h2>
            <ul className="space-y-2 text-sm text-secondary-700 list-disc pr-5">
              <li>نوصل لجميع المدن المغربية عبر شركاء التوصيل (توصيل/أمانة/ناوين خاصين).</li>
              <li>بعد خروج الطلب للتوصيل، تتوصلين برسالة واتساب مع رقم التتبع.</li>
              <li>الدفع عند الاستلام متوفر — تسددين بعد استلام وفحص الطلب.</li>
              <li>في حال عدم الاتصال بك أو رفض الطلب من مرتين، نحتفظ بحق طلب تأكيد مسبق للطلبات القادمة.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}