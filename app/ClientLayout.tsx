'use client';

import { usePathname } from 'next/navigation';
import Navbar from '../components/layout/Navbar/Navbar';
import Footer from '../components/layout/Footer/Footer';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { Toaster } from 'react-hot-toast';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPayPage = pathname === '/pay';

  return (
    <ThemeProvider>
      <AuthProvider>
        <Navbar />
        {children}
        <Toaster position="top-right" />
        {!isPayPage && <Footer />}
      </AuthProvider>
    </ThemeProvider>
  );
}
