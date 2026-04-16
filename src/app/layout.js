import './globals.css';
import LayoutWrapper from '@/components/LayoutWrapper';

export const metadata = {
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
