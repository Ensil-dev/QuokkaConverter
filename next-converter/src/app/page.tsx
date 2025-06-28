'use client';
import { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa';
import LoginCard from '@/components/LoginCard';

function isInAppBrowser() {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
  return ua.includes('kakaotalk') || ua.includes('naver') || ua.includes('fbav') || ua.includes('instagram');
}

function redirectToExternalBrowser() {
  alert('카카오톡 등 인앱 브라우저에서는 Google 로그인이 지원되지 않습니다. 크롬 또는 사파리 브라우저로 열어주세요.');
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
  if (ua.includes('iphone') || ua.includes('ipad')) {
    window.location.href = 'x-web-search://www.QuokkaConverter.com';
  } else {
    window.location.href = 'intent://www.QuokkaConverter.com#Intent;scheme=https;package=com.android.chrome;end';
  }
}

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
