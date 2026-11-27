'use client';
import LoginForm from '@/components/auth/Business/LoginForm';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const LoginPage = () => {
  const { isAuthenticated, sessionChecking } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (sessionChecking) return;
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, sessionChecking, router]);

  return (
    <div className=" min-h-screen bg-linear-to-br from-primary-100 via-primary-300 to-secondary-200 flex justify-center items-center py-8 px-4 relative overflow-hidden">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
