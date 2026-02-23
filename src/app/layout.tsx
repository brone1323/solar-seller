import type { Metadata } from 'next';
import { Outfit, DM_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { SaleBanner } from '@/components/SaleBanner';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SalePopup } from '@/components/SalePopup';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });

export const metadata: Metadata = {
  title: 'Solar DIY | Premium Solar Equipment & Canadian Incentives',
  description: 'Your complete source for DIY solar equipment. Panels, inverters, batteries, and mounting systems. Equipment plus directions, drawings, and support.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${dmSans.variable}`}>
      <body className="font-body bg-solar-dark text-white antialiased min-h-screen flex flex-col">
        <CartProvider>
          <SaleBanner />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
        <SalePopup />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
