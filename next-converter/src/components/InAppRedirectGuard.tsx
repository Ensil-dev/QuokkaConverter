// src/components/InAppRedirectGuard.tsx
'use client';

import useInAppBrowserRedirect from "@/lib/hooks/useInAppBrowserRedirect";


/**
 * 인앱 브라우저 감지 후 외부 브라우저로 리디렉션하는 Guard 컴포넌트
 * 
 * 최상단 layout.tsx나 각 페이지에 포함시켜 클라이언트 환경에서만 작동합니다.
 */
export default function InAppRedirectGuard() {
    useInAppBrowserRedirect();
    return null; // UI 출력 없음
}
