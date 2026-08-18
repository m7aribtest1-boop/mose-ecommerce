function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} من 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rating ? 'text-accent-500' : 'text-secondary-300'}>
          ★
        </span>
      ))}
    </div>
  );
}

interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  title: string | null;
  body: string;
}

export function ProductReviews({ reviews }: { reviews: ReviewItem[] }) {
  if (!reviews || reviews.length === 0) return null;

  const avg = Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length);

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="eyebrow block mb-2">آراء الزبائن</span>
            <h2 className="text-3xl font-bold text-primary-900">تقييمات حقيقية</h2>
          </div>
          <div className="flex items-center gap-3 text-left">
            <span className="text-3xl font-bold text-primary-900">{avg}.0</span>
            <div>
              <Stars rating={avg} />
              <span className="text-sm text-secondary-500 block">{reviews.length} تقييم</span>
            </div>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {reviews.map((r) => (
            <div key={r.id} className="border border-secondary-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-primary-900">{r.author}</span>
                <Stars rating={r.rating} />
              </div>
              {r.title && <h3 className="font-medium text-primary-900 mb-1">{r.title}</h3>}
              <p className="text-sm text-secondary-700 leading-relaxed">{r.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
