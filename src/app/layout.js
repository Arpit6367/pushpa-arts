import './globals.css';
import LayoutWrapper from '@/components/LayoutWrapper';
import { getAllCategoriesWithPaths } from '@/lib/categories';
import { getSiteSettings } from '@/lib/settings';

export const metadata = {
  metadataBase: new URL('https://pushpaarts.com'),
  title: 'Pushpa Arts | Luxury Silver, Bone Inlay & Marble Furniture Exporters',
  description: 'Exquisite handcrafted luxury furniture from Udaipur. Manufacturers and exporters of Silver Furniture, Bone Inlay, Mother of Pearl, and Marble masterpieces for distinguished interiors.',
  keywords: 'silver furniture, bone inlay furniture, mother of pearl inlay, luxury furniture exporters, marble furniture, handcrafted furniture Udaipur, pushpa arts',
  openGraph: {
    title: 'Pushpa Arts | Handcrafted Luxury Furniture',
    description: 'Manufacturers and exporters of premium handcrafted furniture including Silver, Bone Inlay, and Marble masterpieces from Udaipur.',
    url: 'https://pushpaarts.com',
    siteName: 'Pushpa Arts',
    images: [
      {
        url: '/images/hero-refined-1.png',
        width: 1200,
        height: 630,
        alt: 'Pushpa Arts Luxury Furniture Header',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pushpa Arts | Handcrafted Luxury Furniture',
    description: 'Exquisite handcrafted furniture from Udaipur. Specializing in Silver, Bone Inlay, and Marble masterpieces.',
    images: ['/images/hero-refined-1.png'],
  },
  alternates: {
    canonical: 'https://pushpaarts.com',
  },
};

export default async function RootLayout({ children }) {
  const categories = await getAllCategoriesWithPaths();
  const settings = await getSiteSettings();

  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <LayoutWrapper initialCategories={categories} settings={settings}>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
