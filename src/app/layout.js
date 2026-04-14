import './globals.css';
import LayoutWrapper from '@/components/LayoutWrapper';

export const metadata = {
  title: 'Pushpa Arts - Silver Furniture, Bone Inlay, MOP Inlay & Marble Furniture Exporters',
  description: 'Manufacturers, exporters and wholesalers of premium handcrafted furniture including Silver Furniture, Bone Inlay, Mother of Pearl Inlay, White Metal, and Marble Stone products from Udaipur, Rajasthan, India.',
  keywords: 'silver furniture, bone inlay furniture, mother of pearl inlay, white metal furniture, marble furniture, handcrafted furniture, luxury furniture, Indian furniture export',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
