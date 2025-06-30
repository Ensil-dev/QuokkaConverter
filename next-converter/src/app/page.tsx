'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import LoginCard from '@/components/LoginCard';
import { loginWithGoogle } from '@/lib/utils';

export default function Home() {
  const { data: session, status } = useSession();
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
