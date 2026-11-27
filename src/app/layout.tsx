'use client';
import '@/styles/globals.css'
import { Roboto } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BaseLayout from "@/components/layout/BaseLayout";
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/contexts/auth-context';
import MuiThemeProvider from '@/providers/MuiThemeProvider';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const isAuthPage = pathname.includes('/auth');
  const isHomePage = pathname === '/';
  const isErrorPage = pathname === '/404' || pathname === '/unauthorised';
  const isBusinessPage = pathname.startsWith('/business');
  const isPublicPage = isAuthPage || isHomePage || isErrorPage || isBusinessPage;
  

  return (
    <html lang="pt-BR">
      <body className={roboto.className}>
        <MuiThemeProvider>
          <AuthProvider>
            {!isPublicPage && <BaseLayout>{children}</BaseLayout>}
            {isPublicPage && <>{children}</>}
            <ToastContainer />
          </AuthProvider>
        </MuiThemeProvider>
      </body>
    </html>
  );
}
