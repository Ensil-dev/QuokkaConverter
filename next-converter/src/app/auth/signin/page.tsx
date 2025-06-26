"use client";

import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

function isInAppBrowser() {
  const ua =
    typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
  return (
    ua.includes('kakaotalk') ||
    ua.includes('naver') ||
    ua.includes('fbav') ||
    ua.includes('instagram')
  );
}

function redirectToExternalBrowser() {
  alert(
    '카카오톡 등 인앱 브라우저에서는 Google 로그인이 지원되지 않습니다. 크롬 또는 사파리 브라우저로 열어주세요.'
  );
  const ua =
    typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
  if (ua.includes('iphone') || ua.includes('ipad')) {
    window.location.href = 'x-web-search://www.quokkaconvert.com';
  } else {
    window.location.href =
      'intent://www.quokkaconvert.com#Intent;scheme=https;package=com.android.chrome;end';
  }
}

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 이미 로그인된 경우 메인 페이지로 리다이렉트
    getSession().then((session) => {
      if (session) {
        setIsAuthenticated(true);
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    });
  }, [router]);

  const handleGoogleLogin = () => {
    if (typeof window !== 'undefined' && isInAppBrowser()) {
      redirectToExternalBrowser();
    } else {
      setIsLoading(true);
      signIn('google', { callbackUrl: '/' });
    }
  };

  // 이미 인증된 경우 로딩 화면
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <FaSpinner className="animate-spin w-8 h-8 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">로그인 확인 중...</h2>
          <p className="text-gray-600">메인 페이지로 이동합니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 font-sans">
      {/* QuokkaConvert 로고 */}
      <div
        onClick={handleGoogleLogin}
        className="flex items-center gap-3 cursor-pointer"
        style={{ marginBottom: '10px'}}
      >
        <img
          src="/quokka-favicon.svg"
          alt="QuokkaConvert"
          style={{ width: 64, height: 64 }}
        />
        <span className="text-2xl font-bold text-gray-900">
          QuokkaConvert
        </span>
      </div>
      {/* 카드 */}
      <div
        className="w-full max-w-sm bg-white rounded-2xl shadow-lg flex flex-col items-center gap-8"
        style={{ padding: '30px', marginTop: 0 }}
      >
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="cursor-pointer w-full flex items-center justify-center gap-3 border border-gray-300 bg-white text-gray-800 font-semibold rounded-lg py-3 text-lg shadow hover:shadow-md transition p-4 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <FcGoogle size={48} />
          <span className="text-2xl">
            {isLoading ? "로그인 중..." : "Google로 로그인"}
          </span>
        </button>
      </div>
    </div>
  );
} 