import Link from 'next/link';
import Image from 'next/image';

export function BrandStory({ story }: { story?: string | null }) {
  const stats = [
    { value: '+50', label: 'صانعة ومعلّمة' },
    { value: '100%', label: 'صناعة يدوية' },
    { value: '24/7', label: 'دعم واتساب' },
    { value: '48س', label: 'توصيل سريع' },
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-primary-50">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/products/qaftan-bride.jpg"
                alt="قفطان مغربي مطرّز باليد"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 bg-white rounded-2xl shadow-xl px-6 py-5 border border-primary-100">
              <p className="font-arabic text-2xl font-bold text-primary-700">حَرِيرٌ وَتَطْرِيزٌ أصِيل</p>
              <p className="text-sm text-secondary-500 mt-1">بأيدي معلمات فاس ومراكش</p>
            </div>
          </div>

          <div>
            <span className="inline-block text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full mb-4">
              قِصَّتُنَا
            </span>
            <h2 className="font-arabic text-4xl lg:text-5xl font-bold text-primary-900 leading-tight mb-6">
              تَرَاثٌ مَغْرِبِيٌّ يَعْرِفُ طَرِيقَهُ إِلَى المُسْتَقْبَل
            </h2>
            <p className="text-secondary-600 text-lg leading-relaxed mb-6">
              {story || `فِي مُتجَرِ موسى، كُلُّ قِطعةٍ تَحكِي حِرفةً مَغرِبِيّةً أصِيلة. نَختارُ أجوَدَ الأقمشةِ
              ونُسنِدُ التَّطريزَ إِلى أَمهَرِ المُعَلِّمِينَ، لِنُقدِّمَ لَكُم جَلَّابَةً وقَفطاناً
              يَجمَعُ بَينَ الأَصَالَةِ والعَصرِيّة.`}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {stats.map((s) => (
                <div key={s.label} className="text-center bg-white rounded-2xl py-4 shadow-sm border border-secondary-100">
                  <div className="font-arabic text-2xl font-bold text-primary-600">{s.value}</div>
                  <div className="text-xs text-secondary-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <Link href="/about" className="btn-outline px-7 py-3">
              تعرّف علينا أكثر
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
