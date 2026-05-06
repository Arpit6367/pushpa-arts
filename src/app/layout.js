import './globals.css';
import { Cinzel, Montserrat } from 'next/font/google';
import LayoutWrapper from '@/components/LayoutWrapper';
import { getAllCategoriesWithPaths } from '@/lib/categories';
import { getSiteSettings } from '@/lib/settings';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-cinzel',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://pushpaexports.com'),
  title: 'Pushpa Exports | Luxury Silver, Bone Inlay & Marble Furniture Exporters',
  description: 'Exquisite handcrafted luxury furniture from Udaipur. Manufacturers and exporters of Silver Furniture, Bone Inlay, Mother of Pearl, and Marble masterpieces for distinguished interiors.',
  keywords: 'silver furniture, bone inlay furniture, mother of pearl inlay, luxury furniture exporters, marble furniture, handcrafted furniture Udaipur, pushpa exports',
  openGraph: {
    title: 'Pushpa Exports | Handcrafted Luxury Furniture',
    description: 'Manufacturers and exporters of premium handcrafted furniture including Silver, Bone Inlay, and Marble masterpieces from Udaipur.',
    url: 'https://pushpaexports.com',
    siteName: 'Pushpa Exports',
    images: [
      {
        url: '/images/hero-refined-1.png',
        width: 1200,
        height: 630,
        alt: 'Pushpa Exports Luxury Furniture Header',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pushpa Exports | Handcrafted Luxury Furniture',
    description: 'Exquisite handcrafted furniture from Udaipur. Specializing in Silver, Bone Inlay, and Marble masterpieces.',
    images: ['/images/hero-refined-1.png'],
  },
  alternates: {
    canonical: 'https://pushpaexports.com',
  },
  icons: {
    icon: [
      { url: '/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon_io/apple-touch-icon.png' },
    ],
    other: [
      { rel: 'manifest', url: '/favicon_io/site.webmanifest' },
    ],
  },
};

export default async function RootLayout({ children }) {
  const categories = await getAllCategoriesWithPaths();
  const settings = await getSiteSettings();

  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning className={`${cinzel.variable} ${montserrat.variable}`}>
      <body suppressHydrationWarning className="antialiased">
        <LayoutWrapper initialCategories={categories} settings={settings}>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
