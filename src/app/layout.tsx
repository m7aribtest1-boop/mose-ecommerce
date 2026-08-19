import type { Metadata, Viewport } from 'next';
import { Inter, Amiri } from 'next/font/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import ConsentBanner from '@/components/ConsentBanner';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-amiri',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mose.ma'),
  title: {
    default: 'موسى | جلابة وقفطان مغربي أصيل',
    template: '%s | موسى',
  },
  description: 'متجر إلكتروني مغربي لبيع الجلابة والقفطان والتكشيطة بأسلوب عصري وجودة عالية. توصيل لجميع المدن، دفع عند الاستلام، تفصيل حسب الطلب.',
  keywords: ['جلابة مغربية', 'قفطان مغربي', 'تكشيطة', 'ملابس تقليدية', 'تسوق أونلاين المغرب', 'ملابس عرس'],
  authors: [{ name: 'موسى' }],
  creator: 'موسى',
  publisher: 'موسى',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'ar_MA',
    url: 'https://mose.ma',
    siteName: 'موسى',
    title: 'موسى | جلابة وقفطان مغربي أصيل',
    description: 'متجر إلكتروني مغربي لبيع الجلابة والقفطان والتكشيطة بأسلوب عصري وجودة عالية.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'موسى - جلابة وقفطان مغربي' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'موسى | جلابة وقفطان مغربي أصيل',
    description: 'متجر إلكتروني مغربي لبيع الجلابة والقفطان والتكشيطة بأسلوب عصري وجودة عالية.',
    images: ['/og-image.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#1c1b19',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} ${amiri.variable} antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} ${amiri.className} arabic-text bg-ivory min-h-screen`}>
        <div id="__next" className="flex flex-col min-h-screen">
          <AnnouncementBar />
          <Header />
          {children}
          <Footer />
          <FloatingWhatsApp />
          <AnalyticsTracker />
          <ConsentBanner />
        </div>
      </body>
    </html>
  );
}
