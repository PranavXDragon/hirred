'use client';

import { usePathname } from 'next/navigation';
import Navbar from '../components/layout/Navbar/Navbar';
import Footer from '../components/layout/Footer/Footer';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPayPage = pathname === '/pay';

  return (
    <ThemeProvider>
      <AuthProvider>
        <Navbar />
        {children}
        {!isPayPage && <Footer />}
      </AuthProvider>
    </ThemeProvider>
  );
}
