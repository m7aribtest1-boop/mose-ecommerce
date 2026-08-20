import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acquire MOSE — Production-Ready Moroccan E-Commerce Platform',
  description:
    'Production-ready Arabic RTL e-commerce platform for the Moroccan market. Next.js 14 + Prisma/PostgreSQL, COD + WhatsApp, full admin dashboard, 30+ tests, deployed on Vercel.',
};

const stack = [
  'Next.js 14 · App Router',
  'TypeScript · Tailwind CSS 3',
  'Prisma 6 · PostgreSQL (Neon)',
  'Arabic RTL layout',
  'COD checkout + WhatsApp commerce',
  'JWT httpOnly cookies + optional 2FA',
  'Product variants & per-size stock',
  'Orders · returns · coupons',
  'Admin dashboard + analytics',
  'Newsletter + SEO',
  'Deployed on Vercel',
  '30+ passing Jest tests',
];

const features: { icon: string; ar: string; en: string }[] = [
  { icon: '🇲🇦', ar: 'معرّب لسوق المغرب', en: 'Moroccan-localized: MAD, COD, WhatsApp' },
  { icon: '🛍️', ar: 'متجر كامل جاهز', en: 'Complete storefront + customer accounts' },
  { icon: '⚙️', ar: 'لوحة أدمن شاملة', en: 'Full admin: orders, products, inventory, analytics' },
  { icon: '🔐', ar: 'أمان حقيقي', en: 'JWT cookies, 2FA (TOTP), rate-limited login' },
  { icon: '🧪', ar: 'مُختبر', en: '30+ unit tests + production build' },
  { icon: '🚀', ar: 'منشور على Vercel', en: 'Live demo: COD to checkout working' },
];

export default function AcquisitionPage() {
  const wa = '212600000000';
  const waLink = `https://wa.me/${wa}?text=${encodeURIComponent('Hi, I\'m interested in acquiring the MOSE e-commerce platform.')}`;

  return (
    <main className="bg-ivory text-secondary-900">
      <section className="bg-primary-900 text-ivory">
        <div className="container-custom py-20 md:py-28 text-center">
          <span className="eyebrow text-accent-400">Acquisition</span>
          <h1 className="mt-4 text-4xl md:text-5xl leading-tight">
            Production-Ready Moroccan E-Commerce Platform
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-secondary-300">
            A fully-built Arabic RTL e-commerce platform for the Moroccan traditional-fashion market —
            storefront, COD checkout, WhatsApp commerce, admin dashboard, inventory & analytics.
          </p>
          <p className="mt-4 text-sm text-secondary-400">
            منصة تجارة إلكترونية جاهزة بالكامل مخصصة للسوق المغربي — متجر + الدفع عند الاستلام + واتساب +
            لوحة تحكم كاملة.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/" className="btn-primary">View Live Demo</a>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-outline border-accent-400 text-accent-300 hover:bg-accent-400 hover:text-primary-900">
              Request Acquisition Details
            </a>
          </div>
        </div>
      </section>

      <section className="container-custom py-16">
        <h2 className="text-3xl font-bold text-primary-900 text-center">What you&apos;re buying</h2>
        <p className="mt-4 text-center text-secondary-600 max-w-2xl mx-auto">
          The engineering time, architecture, UX, admin system and launch-ready infrastructure a buyer
          would otherwise spend months and thousands of dollars building. A technology asset — not a
          revenue-generating business.
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.en} className="card p-6">
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-3 font-bold text-primary-900">{f.ar}</h3>
              <p className="mt-1 text-sm text-secondary-600">{f.en}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-secondary-100">
        <div className="container-custom py-16">
          <h2 className="text-2xl font-bold text-primary-900 text-center">Tech stack</h2>
          <ul className="mt-8 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {stack.map((s) => (
              <li key={s} className="flex items-center gap-2 text-secondary-700">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-custom py-16">
        <h2 className="text-2xl font-bold text-primary-900 text-center">Explore it live</h2>
        <p className="mt-4 text-center text-secondary-600 max-w-2xl mx-auto">
          See the storefront, product pages, categories and checkout in action. Screenshots of the admin
          dashboard are available in the listing.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <a href="/" className="btn-outline">Storefront</a>
          <a href="/products" className="btn-outline">All products</a>
          <a href="/categories" className="btn-outline">Categories</a>
          <a href="/size-guide" className="btn-outline">Size guide</a>
        </div>
      </section>

      <section className="bg-primary-900 text-ivory">
        <div className="container-custom py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">Ready to skip months of development?</h2>
          <p className="mt-4 text-secondary-300 max-w-xl mx-auto">
            Clean, documented, transferable code. GitHub + Vercel + database transfer with a step-by-step
            handover checklist and post-transfer support.
          </p>
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8">
            Request Acquisition Details
          </a>
        </div>
      </section>
    </main>
  );
}