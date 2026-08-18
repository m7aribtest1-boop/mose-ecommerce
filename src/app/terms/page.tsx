import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'شروط الاستخدام | متجر موسى',
};

export default function TermsPage() {
  return (
    <main className="flex-1">
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-12">
        <div className="container-custom text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">شروط الاستخدام</h1>
        </div>
      </section>
      <section className="py-12 bg-secondary-50">
        <div className="container-custom max-w-3xl">
          <div className="card p-6 space-y-4 text-sm text-secondary-700">
            <h2 className="text-xl font-bold text-primary-900">1. مقدمة</h2>
            <p>باستخدامك موقع متجر موسى (mose.ma) أنت توافق على الشروط التالية. المتجر متخصص في الملابس المغربية التقليدية: الجلابة، القفطان، التكشيطة والإكسسوارات.</p>

            <h2 className="text-xl font-bold text-primary-900">2. الطلبات والأسعار</h2>
            <p>جميع الأسعار معروضة بالدرهم المغربي (MAD) شاملة الضريبة حسب النظام المعمول به. نحتفظ بحق تعديل الأسعار، مع بقاء السعر المعروض ساري المفعول عند تأكيد الطلب.</p>

            <h2 className="text-xl font-bold text-primary-900">3. الدفع</h2>
            <p>نقبل الدفع عند الاستلام (COD)، البطاقات البنكية عبر CMI، الدفع في وكالات Cash Plus، والتحويل البنكي. الدفع عند الاستلام يشمل تأكيداً هاتفياً قبل الشحن.</p>

            <h2 className="text-xl font-bold text-primary-900">4. الإرجاع والاستبدال</h2>
            <p>الإرجاع خلال 7 أيام من الاستلام وفق الشروط المذكورة في <a href="/returns-policy" className="text-primary-600 underline">سياسة الإرجاع</a> ووفق أحكام القانون 31-08.</p>

            <h2 className="text-xl font-bold text-primary-900">5. الملكية الفكرية</h2>
            <p>جميع المحتويات (صور، نصوص، تصميم) ملك لمتجر موسى ولا يجوز نسخها دون إذن.</p>

            <h2 className="text-xl font-bold text-primary-900">6. القانون الواجب التطبيق</h2>
            <p>تخضع هذه الشروط للقانون المغربي، وأي نزاع يحل أمام المحاكم المختصة بالمغرب.</p>

            <h2 className="text-xl font-bold text-primary-900">7. الاتصال بنا</h2>
            <p>لأي استفسار: واتساب / هاتف: +212 6 00 00 00 00 — أو عبر صفحة <a href="/contact" className="text-primary-600 underline">اتصل بنا</a>.</p>
          </div>
        </div>
      </section>
    </main>
  );
}