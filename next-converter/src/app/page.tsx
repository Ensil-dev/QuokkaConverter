'use client';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import LoginCard from '@/components/LoginCard';
import { loginWithGoogle } from '@/lib/utils';

export default function Home() {
  const { session, status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace('/convert');
    }
  }, [session, router]);

  if (status === 'loading') {
    return <Loading />;
  }

  return <LoginCard onLogin={loginWithGoogle} />;
}
