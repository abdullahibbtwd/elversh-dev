// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/Admin/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Professional dashboard.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#E0E0E0] dark:bg-[#121212]`}>
        <div className="flex h-screen p-5">
          <Sidebar />
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}