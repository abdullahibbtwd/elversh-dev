import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/Admin/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Professional dashboard.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
  }
}
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <div className={`${inter.className} bg-gradient-to-br from-indigo-50 to-teal-50 dark:bg-gradient-to-br dark:from-black dark:to-black min-h-screen`}>
      <div className="flex w-full h-screen p-4 gap-4">
        <div className="">
          <Sidebar />
        </div>
        <div className="flex-1 overflow-auto bg-gradient-to-br from-indigo-50 to-teal-50 dark:bg-[#121212] rounded-xl shadow-xl">
          {children}
        </div>
      </div>
    </div>
  );
}