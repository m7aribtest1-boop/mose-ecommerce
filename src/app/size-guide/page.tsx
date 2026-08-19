import type { Metadata } from 'next';
import { getStoreSettings } from '@/lib/store-settings';

export const metadata: Metadata = {
  title: 'دليل المقاسات | متجر موسى',
  description: 'كيف تختار مقاسك المناسب في الجلابة والقفطان والتكشيطة المغربية — دليل شامل بالمقاسات',
};

export const dynamic = 'force-dynamic';

const tables = [
  {
    title: 'الجلابة',
    desc: 'مقاس واسع ومريح — اختر بناءً على مقاس جسمك',
    rows: [
      ['مقاس الجسم', 'S', 'M', 'L', 'XL', 'XXL'],
      ['الصدر (سم)', '88-96', '96-104', '104-112', '112-120', '120-128'],
      ['الطول (سم)', '150-160', '160-170', '170-180', '180-190', '190+'],
      ['الوزن التقريبي (كغ)', '48-60', '60-72', '72-84', '84-96', '96+'],
    ],
  },
  {
    title: 'القفطان بنصدر محدد',
    desc: 'مقاس مضبوط حول الصدر — إذا بين مقاسين اختر الأكبر',
    rows: [
      ['مقاس الجسم', 'S', 'M', 'L', 'XL', 'XXL'],
      ['الصدر (سم)', '84-90', '90-98', '98-106', '106-114', '114-122'],
      ['الخصر (سم)', '66-72', '72-80', '80-88', '88-96', '96-104'],
      ['الطول (سم)', '150-158', '158-166', '166-174', '174-182', '182+'],
    ],
  },
  {
    title: 'التكشيطة',
    desc: 'مقاس قريب من الجسم — مباشرة بدون مرونة — ينصح باستشارة عبر واتساب',
    rows: [
      ['مقاس الجسم', 'S', 'M', 'L', 'XL', 'XXL'],
      ['الصدر (سم)', '84-88', '88-96', '96-104', '104-112', '112-120'],
      ['المحيط تحت الصدر (سم)', '70-76', '76-84', '84-92', '92-100', '100-108'],
      ['الطول (سم)', '150+', '155+', '160+', '165+', '170+'],
    ],
  },
];

export default async function SizeGuidePage() {
  const settings = await getStoreSettings();
  return (
    <main className="flex-1">
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-12">
        <div className="container-custom text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">دليل المقاسات</h1>
          <p className="text-white/80 mt-2">كيفاش تختاري المقاس الصحيح — مختصراً بالضبط</p>
        </div>
      </section>

      <section className="py-12 bg-secondary-50">
        <div className="container-custom max-w-4xl">
          <div className="card p-6 mb-8 bg-primary-50 border-primary-200">
            <h2 className="text-xl font-bold text-primary-900 mb-3">📏 كيف تقيسين جسمك؟</h2>
            <ol className="space-y-2 text-secondary-700 text-sm list-decimal pr-5">
              <li><b>الصدر:</b> قيسي حول أوسع نقطة في صدرك مع شد خفيف للمتر.</li>
              <li><b>الخصر:</b> قيسي حول أضيق نقطة (فوق السرة).</li>
              <li><b>المحيط تحت الصدر:</b> للتكشيطة — قيسي مباشرة تحت الصدر.</li>
              <li><b>الطول:</b> قيسي طولك من الرأس لكعب القدم.</li>
            </ol>
            <p className="text-sm text-secondary-600 mt-3">
              💡 نصيحة: الملابس المغربية التقليدية بشكل عام <b>واسعة ومريحة</b> — الجلابة بالخصوص.
              إذا كنت بين مقاسين أو متحيرة، ديري مقاسك الأكبر.

            </p>
          </div>

          {settings.sizeGuideText && (
            <div className="card p-6 mb-8 bg-white border-primary-200">
              <h2 className="text-xl font-bold text-primary-900 mb-3">📝 ملاحظات المقاسات</h2>
              <p className="text-secondary-700 text-sm whitespace-pre-line">{settings.sizeGuideText}</p>
            </div>
          )}

          {tables.map((t) => (
            <div key={t.title} className="card p-6 mb-8 overflow-x-auto">
              <h2 className="text-xl font-bold text-primary-900 mb-1">{t.title}</h2>
              <p className="text-sm text-secondary-500 mb-4">{t.desc}</p>
              <table className="w-full text-sm text-right">
                <thead>
                  <tr className="bg-primary-600 text-white">
                    {t.rows[0].map((h, i) => <th key={i} className="px-4 py-2 font-medium">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {t.rows.slice(1).map((row, ri) => (
                    <tr key={ri} className={ri % 2 ? 'bg-secondary-50' : ''}>
                      {row.map((cell, ci) => (
                        <td key={ci} className={`px-4 py-2 ${ci === 0 ? 'font-medium text-primary-900' : 'text-secondary-600'}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          <div className="card p-6 bg-accent-50 border-accent-200">
            <h2 className="text-xl font-bold text-primary-900 mb-2">متحيرة في المقاس؟</h2>
            <p className="text-secondary-700 text-sm mb-4">
              صيفطي لينا طولك ووزنك التقريبي على واتساب، ومستشارتنا تجاوبك بالمقاس المناسب خلال ساعات.
            </p>
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=سلام، بغيت مساعدة فاختيار المقاس. طولي هو: ... ووزني هو: ...`}
              target="_blank" rel="noreferrer"
              className="bg-accent-600 hover:bg-accent-700 text-white font-semibold px-6 py-3 rounded-xl inline-block transition"
            >
              اسألي عبر واتساب 👈
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}