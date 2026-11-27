'use client';
import { useAuth } from '@/contexts/auth-context';
import { LoginOutlined, Logout, Menu } from '@mui/icons-material';
import Link from 'next/link';
import { useMediaQuery } from '@mui/material';
interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { logout, isAuthenticated, sessionChecking } = useAuth();
  
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const handleLogout = () => {
    void logout();
  };

  const renderAuthAction = () => {
    if (sessionChecking) {
      return (
        <span className="inline-block h-6 w-6 animate-pulse rounded bg-gray-200" aria-hidden />
      );
    }

    if (isAuthenticated) {
      return (
        <button
          onClick={handleLogout}
          className='flex items-center hover:bg-gray-100 text-sm rounded transition-colors p-2'
          aria-label='Logout'
          data-testid="header-logout-button"
        >
          <Logout className='text-custom-black me-1' />
          Sair
        </button>
      );
    }

    return (
      <Link href="/auth/login">
        <button
          className='p-2 hover:bg-gray-100 rounded transition-colors'
          aria-label='Login'
          data-testid="header-login-button"
        >
          <LoginOutlined className='text-custom-black' />
          Entrar
        </button>
      </Link>
    );
  };

  return (
    <header className={`h-20 flex justify-between items-center sticky top-0 bg-white shadow-sm px-3 py-5 z-50 ${isDesktop ? 'px-10' : ''}`}>

      {!isDesktop && (
        <button
          onClick={onMenuClick}
          className='p-2 hover:bg-gray-100 rounded transition-colors'
          aria-label='Abrir menu'
          data-testid="header-menu-button"
        >
          <Menu className='text-custom-black' />
        </button>
      )}

      <Link href="/dashboard" className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo.png" alt="Logo" className='h-8 object-contain' />
      </Link>

      <div className="flex min-h-10 min-w-10 items-center justify-end">
        {renderAuthAction()}
      </div>
    </header>
  );
};

export default Header;
