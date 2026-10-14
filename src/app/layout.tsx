import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AvtoQism.uz — Avtomobil ehtiyot qismlarini katalog bo‘yicha qidirish va sotib olish',
  description:
    'Avtomobil ehtiyot qismlarini katalog, OEM artikul va VIN kod bo‘yicha qidirish va sotib olish internet do‘koni. Cobalt, Gentra, Tracker, Onix, Nexia va barcha avtolar uchun original qismlar.',
  keywords: 'avto qismlar, ehtiyot qismlar, avtomobil do\'koni, vin qidiruv, cobalt qismlari, gentra ehtiyot qismlari, oem kod, motor moyi, tormoz kolodkasi',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 text-slate-900`}>
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
