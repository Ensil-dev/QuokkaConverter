"use client";

import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";

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

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("로그인 오류:", error);
      setIsLoading(false);
    }
  };

  // 이미 인증된 경우 로딩 화면
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-100 mb-2">로그인 확인 중...</h2>
          <p className="text-gray-400">메인 페이지로 이동합니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d1117] font-sans">
      {/* 로고 */}
      <FaGithub className="mx-auto mb-8 text-white" size={56} />
      {/* 카드 */}
      <div className="w-full max-w-sm bg-[#161b22] border border-[#30363d] rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-2xl font-semibold text-white mb-8">Sign in to GitHub</h1>
        {/* 입력폼(실제 입력은 없지만 시각적 재현) */}
        <div className="w-full space-y-4 mb-4">
          <input
            type="text"
            placeholder="Username or email address"
            disabled
            className="w-full rounded-md bg-[#0d1117] border border-[#30363d] text-gray-100 placeholder-gray-500 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
          />
          <div className="flex items-center justify-between">
            <input
              type="password"
              placeholder="Password"
              disabled
              className="w-full rounded-md bg-[#0d1117] border border-[#30363d] text-gray-100 placeholder-gray-500 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
            />
            <a href="#" className="ml-2 text-sm text-[#2f81f7] hover:underline">Forgot password?</a>
          </div>
        </div>
        {/* Sign in 버튼 (Google OAuth) */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full bg-[#238636] hover:bg-[#2ea043] text-white font-semibold rounded-md py-2 mt-2 mb-4 transition disabled:opacity-60 disabled:cursor-not-allowed text-base shadow"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
        {/* 패스키/회원가입 카드 */}
        <div className="w-full bg-[#0d1117] border border-[#30363d] rounded-md mt-2 p-4 text-center">
          <a href="#" className="block text-[#2f81f7] hover:underline font-medium mb-2">Sign in with a passkey</a>
          <span className="text-gray-400 text-sm">New to GitHub? </span>
          <a href="#" className="text-[#2f81f7] hover:underline text-sm">Create an account</a>
        </div>
      </div>
      {/* 푸터 */}
      <footer className="w-full max-w-sm mx-auto mt-8 text-center text-xs text-gray-500 space-x-2">
        <a href="#" className="hover:underline">Terms</a>
        <a href="#" className="hover:underline">Privacy</a>
        <a href="#" className="hover:underline">Docs</a>
        <a href="#" className="hover:underline">Contact GitHub Support</a>
        <a href="#" className="hover:underline">Manage cookies</a>
        <div className="mt-2">Do not share my personal information</div>
      </footer>
    </div>
  );
} 