'use client';

import { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';

function isInAppBrowser() {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
  return (
    ua.includes('kakaotalk') ||
    ua.includes('naver') ||
    ua.includes('fbav') ||
    ua.includes('instagram')
  );
}

function redirectToExternalBrowser() {
  alert('카카오톡 등 인앱 브라우저에서는 Google 로그인이 지원되지 않습니다. 크롬 또는 사파리 브라우저로 열어주세요.');
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
  if (ua.includes('iphone') || ua.includes('ipad')) {
    window.location.href = 'x-web-search://www.quokkaconvert.com';
  } else {
    window.location.href = 'intent://www.quokkaconvert.com#Intent;scheme=https;package=com.android.chrome;end';
  }
}

const handleGoogleLogin = () => {
  if (typeof window !== 'undefined' && isInAppBrowser()) {
    redirectToExternalBrowser();
  } else {
    signIn('google');
  }
};

export default function Login() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/convert');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-sm text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="flex min-h-screen min-w-[340px] max-w-[400px] flex-col items-center justify-center bg-gray-100 font-sans">
        <div onClick={handleGoogleLogin} className="flex cursor-pointer items-center gap-3" style={{ marginBottom: '10px' }}>
          <Image src="/apple-touch-icon.png" alt="QuokkaConvert" width={64} height={64} className="mr-[8px] select-none" />
          <span className="select-none text-2xl font-bold text-gray-900">QuokkaConvert</span>
        </div>
        <div className="flex w-full min-w-[340px] max-w-[400px] flex-col items-center gap-4 rounded-2xl bg-white shadow-lg" style={{ padding: '10px', marginTop: 0, maxWidth: '400px', minWidth: '320px' }}>
          <button type="button" onClick={handleGoogleLogin} className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white p-4 py-3 text-lg font-semibold text-gray-800 shadow transition hover:shadow-md">
            <FcGoogle size={48} />
            <span className="select-none text-2xl">Google로 로그인</span>
          </button>
        </div>
      </div>
    </div>
  );
}
