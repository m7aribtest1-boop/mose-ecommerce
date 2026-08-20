import Link from 'next/link';
import { PaymentMethods } from '@/components/PaymentMethods';

export function Footer() {
  const footerLinks: Record<string, { label: string; href: string }[]> = {
المتجر: [
      { label: 'الرئيسية', href: '/' },
      { label: 'جميع المنتجات', href: '/products' },
      { label: 'الفئات', href: '/categories' },
      { label: 'العروض', href: '/products' },
    ],
    الفئات: [
      { label: 'الجلابة', href: '/categories/jellaba' },
      { label: 'القفطان', href: '/categories/qaftan' },
      { label: 'التكشيطة', href: '/categories/takchita' },
      { label: 'الإكسسوارات', href: '/categories/accessories' },
    ],
    المساعدة: [
      { label: 'الشحن والتوصيل', href: '/shipping-policy' },
      { label: 'الإرجاع والتبديل', href: '/returns-policy' },
      { label: 'دليل المقاسات', href: '/size-guide' },
      { label: 'الدفع عند الاستلام', href: '/shipping-policy' },
      { label: 'اتصل بنا', href: '/contact' },
    ],
    الشركة: [
      { label: 'من نحن', href: '/about' },
      { label: 'الخصوصية', href: '/privacy' },
      { label: 'الشروط', href: '/terms' },
      { label: 'اقتناء المتجر', href: '/acquisition' },
      { label: 'لوحة التحكم', href: '/admin' },
    ],
  };

  return (
    <footer className="bg-primary-900 text-secondary-300 mt-auto">
      <div className="container-custom py-14">
        <div className="text-center mb-12">
          <span className="font-arabic text-5xl md:text-6xl text-ivory tracking-[0.15em]">MOSE</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xl">م</span>
              <span className="text-2xl font-bold text-white">موسى<span className="text-primary-500">.</span></span>
            </div>
            <p className="text-sm leading-relaxed text-secondary-400 mb-4">
              متجر إلكتروني مغربي متخصص في الجلابة والقفطان والتكشيطة التقليدية، مصنوعة بحرفية عالية من أفضل المواد الطبيعية.
            </p>
            <div className="flex gap-3">
              {['Instagram', 'Facebook', 'TikTok', 'WhatsApp'].map((s) => (
                <a key={s} href="#" className="w-9 h-9 bg-primary-800 rounded-lg flex items-center justify-center text-xs hover:bg-primary-600 hover:text-white transition-colors" aria-label={s}>
                  {s.charAt(0)}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-white mb-4">{title}</h3>
              <ul className="space-y-2 text-sm">
                {links.map((link) => (
                  <li key={`${title}-${link.label}`}>
                    <Link href={link.href} className="text-secondary-400 hover:text-primary-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <PaymentMethods className="mt-10" />

        <div className="border-t border-primary-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondary-500">
          <p>© {new Date().getFullYear()} متجر موسى. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4">
            <span>الدفع عند الاستلام</span>
            <span>دعم 24/7</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
