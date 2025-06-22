/**
 * Root Layout Component
 * Provides global providers and layout structure
 */

import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/Toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'The Hobbit Online Store',
  description: 'Your magical shopping destination',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
