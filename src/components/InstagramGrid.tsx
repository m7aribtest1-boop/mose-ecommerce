const TILES = [
  { handle: '@mose.ma', label: 'جلابة فاسية' },
  { handle: '@mose.ma', label: 'قفطان أعياد' },
  { handle: '@mose.ma', label: 'تكشيطة صيفية' },
  { handle: '@mose.ma', label: 'إطلالة عروس' },
  { handle: '@mose.ma', label: 'خياطة يدوية' },
  { handle: '@mose.ma', label: 'لمسات ذهبية' },
];

export default function InstagramGrid() {
  return (
    <section className="py-20 bg-ivory">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="font-arabic text-3xl md:text-4xl text-primary-800 mb-3">تابعونا على إنستغرام</h2>
          <div className="w-16 h-0.5 bg-accent-500 mx-auto" />
          <p className="text-secondary-600 mt-4 font-light">
            اكتشفوا أحدث إطلالاتنا وتصاميمنا اليومية على
            <a
              href="https://instagram.com/mose.ma"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-700 font-medium mx-1 hover:text-accent-600"
            >
              @mose.ma
            </a>
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {TILES.map((tile, i) => (
            <a
              key={i}
              href="https://instagram.com/mose.ma"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xl bg-primary-900/5 border border-accent-200"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-arabic text-sm text-primary-800/70 group-hover:opacity-0 transition-opacity">
                  {tile.label}
                </span>
              </div>
              <div className="absolute inset-0 bg-primary-900/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-accent-300 font-arabic text-sm">{tile.handle}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
