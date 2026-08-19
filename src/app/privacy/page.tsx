import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية | متجر موسى',
};

export default function PrivacyPage() {
  return (
    <main className="flex-1">
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-12">
        <div className="container-custom text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">سياسة الخصوصية</h1>
        </div>
      </section>
      <section className="py-12 bg-secondary-50">
        <div className="container-custom max-w-3xl">
          <div className="card p-6 space-y-4 text-sm text-secondary-700">
            <h2 className="text-xl font-bold text-primary-900">1. البيانات التي نجمعها</h2>
            <p>عند إتمام طلب نلتقط: الاسم الكامل، رقم الهاتف، البريد الإلكتروني (اختياري)، المدينة والعنوان (اختياري). نعتمد الدفع عند الاستلام حالياً، لذا لا نجمع أي بيانات بطاقة بنكية.</p>

            <h2 className="text-xl font-bold text-primary-900">2. المعالجة القانونية (قانون 09-08)</h2>
            <p>نعالج بياناتك وفق القانون المغربي 09-08 المتعلق بحماية المعطيات الشخصية، وتم الإشعار المسبق لدى اللجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي (CNDP).</p>

            <h2 className="text-xl font-bold text-primary-900">3. الغرض من جمع البيانات</h2>
            <ul className="list-disc pr-5 space-y-1">
              <li>معالجة وتأكيد الطلبات والتواصل معك بخصوصها</li>
              <li>التوصيل عبر شركاء الشحن (نشارك الاسم والهاتف والعنوان فقط مع الناقل)</li>
              <li>تحسين خدماتنا وإرسال عروض تسويقية (فقط بموافقتك)</li>
            </ul>

            <h2 className="text-xl font-bold text-primary-900">4. حقوقك</h2>
            <p>يحق لك طلب الوصول إلى بياناتك، تصحيحها، أو حذفها في أي وقت عبر الاتصال بنا. لسحب موافقتك على استقبال العروض، راسلنا مباشرة.</p>

            <h2 className="text-xl font-bold text-primary-900">5. ملفات تعريف الارتباط</h2>
            <p>نستعمل ملفات تعريف الارتباط الأساسية (السلة، الجلسة) وأدوات التحليل (Google Analytics 4) لتحسين التجربة. يمكنك تعطيلها من إعدادات متصفحك.</p>

            <h2 className="text-xl font-bold text-primary-900">6. الحماية</h2>
            <p>موقعنا محمي بواسطة HTTPS، وتحد الوصول إلى بياناتك للموظفين المصرح لهم فقط.</p>

            <h2 className="text-xl font-bold text-primary-900">7. الاتصال بنا</h2>
            <p>لممارسة حقوقك أو أي سؤال: واتساب: +212 6 00 00 00 00 — البريد: contact@mose.ma</p>
          </div>
        </div>
      </section>
    </main>
  );
}