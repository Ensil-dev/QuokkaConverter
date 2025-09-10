"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export function useAuth() {
  const { data: session, status } = useSession();
  
  return {
    session,
    status,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    user: session?.user,
  };
}

export function isAdminUser(email?: string | null): boolean {
  if (!email) return false;
  
  // 관리자 이메일을 환경변수에서 가져오거나 기본값 사용
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
  
  return adminEmails.some(adminEmail => adminEmail.trim().toLowerCase() === email.toLowerCase());
} 