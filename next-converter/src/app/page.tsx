'use client';
import { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa';
import LoginCard from '@/components/LoginCard';
import { isInAppBrowser, redirectToExternalBrowser } from '@/lib/browser';

const handleGoogleLogin = () => {
  if (typeof window !== 'undefined' && isInAppBrowser()) {
    redirectToExternalBrowser();
  } else {
    signIn('google', { callbackUrl: '/convert' });
  }
};

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace('/convert');
    }
  }, [session, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center ">
        <div className="text-center">
          <FaSpinner className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return <LoginCard onLogin={handleGoogleLogin} />;
}
