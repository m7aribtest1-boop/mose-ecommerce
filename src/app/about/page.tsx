import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'من نحن',
  description: 'تعرف على قصة متجر موسى للجلابة والقفطان المغربي الأصيل',
};

const values = [
  { icon: '✂', title: 'حرفية مغربية أصيلة', text: 'كل قطعة مصنوعة يدوياً بحرفية عالية من قبل أمهر الحرفيين في فاس ومراكش.' },
  { icon: '◈', title: 'جودة المواد', text: 'نختار أجود الأقمشة: الكتان، الصوف الخالص، الحرير الفاخر والثوب المطرز يدوياً.' },
  { icon: '☆', title: 'خدمة الزبون أولاً', text: 'فريقنا تحت تصرفكم للإجابة على أسئلتكم وتقديم النصائح حول المقاسات والتنسيق.' },
];

export default function AboutPage() {
  return (
    <main className="flex-1">
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-16 lg:py-24">
        <div className="container-custom text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">قصة موسى</h1>
          <p className="text-white/90 max-w-2xl mx-auto text-lg">من الورشة الصغيرة إلى متجر إلكتروني يعكس أصالة التراث المغربي</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg mx-auto text-secondary-700 leading-relaxed space-y-6">
            <p className="text-xl font-semibold text-primary-900">
              بدأت قصة موسى سنة 1998 في أحد أزقة فاس العتيقة، حيث ورثنا عن الأجداد شغف الخياطة التقليدية وحب التفاصيل.
            </p>
            <p>
              في البداية كانت ورشة صغيرة لتفصيل الجلابة والقمصان التقليدية، نسلم كل قطعة بعد أيام من العمل المتواصل على يد الحرفيين. ومع مرور الوقت، وفي كل مناسبة وعرس، كانت قطعنا تحكي قصصاً من الفرح والفخر لمن يرتديها.
            </p>
            <p>
              اليوم، وبعد أكثر من 25 سنة، نجمع بين أصالة الموروث المغربي وحداثة التجارة الإلكترونية. نعرض تشكيلتنا كاملة أونلاين مع توصيل لجميع المدن المغربية، مع بقائنا أوفياء لمبدأنا: <strong className="text-primary-700">كل قطعة تستحق أن تصنع بيد حرفي حقيقي</strong>.
            </p>
            <p>
              من فاس إلى العالم، موسى يعنى الاستمرارية في الجودة، الابتكار في التصميم، والحفاظ على الهوية المغربية في كل غرزة.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center text-primary-900 mb-12">قيمنا</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="card p-6 text-center">
                <div className="text-4xl mb-4 text-primary-600">{v.icon}</div>
                <h3 className="font-bold text-primary-900 mb-2">{v.title}</h3>
                <p className="text-secondary-600 text-sm">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary-900 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">انضم إلى عائلة موسى</h2>
          <p className="text-white/85 max-w-xl mx-auto mb-8">اشترك في نشرتنا البريدية لتصلك آخر التشكيلات والعروض الحصرية</p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input type="email" placeholder="بريدك الإلكتروني" className="input-field !bg-white/95 flex-1" />
            <button className="btn-primary !bg-white !text-primary-700 !border-white hover:!bg-primary-50">اشترك</button>
          </div>
        </div>
      </section>
    </main>
  );
}
