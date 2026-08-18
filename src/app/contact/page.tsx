import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'اتصل بنا',
  description: 'تواصل معنا في متجر موسى - فريقنا تحت تصرفك',
};

const faqs = [
  { q: 'كم يستغرق التوصيل؟', a: 'التوصيل داخل الدار البيضاء والرباط من 24 إلى 48 ساعة، وباقي المدن من 2 إلى 4 أيام عمل.' },
  { q: 'هل يمكنني الدفع عند الاستلام؟', a: 'نعم، نقدم الدفع عند الاستلام لجميع المدن المغربية، بالإضافة للدفع الإلكتروني عبر CMI.' },
  { q: 'ماذا عن مقاسي؟ هل يمكنني تفصيل القطعة على مقاسي؟', a: 'نعم، نوفر خدمة التفصيل حسب المقاس مع إمكانية إرسال مقاساتك بعد الطلب، ونضيف قياسات تفصيلية دقيقة حسب كل قطعة.' },
  { q: 'هل يمكنني إرجاع المنتج؟', a: 'يمكنك إرجاع أو استبدال القطعة خلال 7 أيام من الاستلام بشرط عدم استعمالها وبحالة جديدة، مع الاحتفاظ بالفاتورة.' },
];

export default function ContactPage() {
  return (
    <main className="flex-1">
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-16 lg:py-24">
        <div className="container-custom text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">اتصل بنا</h1>
          <p className="text-white/90 max-w-2xl mx-auto text-lg">سؤال؟ استفسار؟ نحن هنا لمساعدتك</p>
        </div>
      </section>

      <section className="py-12 bg-secondary-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="card p-6 mb-6">
                <h2 className="text-xl font-bold text-primary-900 mb-6">أرسل رسالة</h2>
                <ContactForm />
              </div>

              <div className="card p-6">
                <h2 className="text-xl font-bold text-primary-900 mb-6">أسئلة شائعة</h2>
                <div className="space-y-4">
                  {faqs.map((faq, i) => (
                    <details key={i} className="group border border-secondary-200 rounded-lg p-4 open:border-primary-300">
                      <summary className="flex justify-between items-center cursor-pointer font-medium text-primary-900">
                        {faq.q}
                        <span className="text-primary-600 group-open:rotate-180 transition-transform">▾</span>
                      </summary>
                      <p className="mt-3 text-secondary-600 text-sm leading-relaxed">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="font-bold text-primary-900 mb-4">معلومات التواصل</h3>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="w-10 h-10 bg-primary-50 text-primary-700 rounded-lg flex items-center justify-center flex-shrink-0">☎</span>
                    <div>
                      <div className="font-medium text-primary-900">الهاتف / واتساب</div>
                      <div className="text-secondary-600" dir="ltr">+212 6 00 00 00 00</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-10 h-10 bg-primary-50 text-primary-700 rounded-lg flex items-center justify-center flex-shrink-0">✉</span>
                    <div>
                      <div className="font-medium text-primary-900">البريد الإلكتروني</div>
                      <div className="text-secondary-600" dir="ltr">contact@mose.ma</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-10 h-10 bg-primary-50 text-primary-700 rounded-lg flex items-center justify-center flex-shrink-0">⌂</span>
                    <div>
                      <div className="font-medium text-primary-900">عنواننا</div>
                      <div className="text-secondary-600">فاس، المغرب</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-10 h-10 bg-primary-50 text-primary-700 rounded-lg flex items-center justify-center flex-shrink-0">◷</span>
                    <div>
                      <div className="font-medium text-primary-900">ساعات العمل</div>
                      <div className="text-secondary-600">الاثنين - السبت: 9:00 - 20:00</div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="card p-6">
                <h3 className="font-bold text-primary-900 mb-4">تابعنا</h3>
                <div className="flex gap-3">
                  {['Instagram', 'Facebook', 'TikTok', 'WhatsApp'].map((s) => (
                    <button key={s} className="flex-1 py-2.5 text-sm border border-secondary-200 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition-colors">{s}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
