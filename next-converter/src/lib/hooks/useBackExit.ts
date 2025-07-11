'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { tabs } from '@/components/BottomNav';

/**
 * 모바일 브라우저에서 뒤로가기 두 번으로 앱을 종료하도록 돕는 훅
 *
 * 최초 뒤로가기가 발생하면 토스트를 띄우고 히스토리를 유지합니다.
 * 토스트가 노출된 상태에서 다시 뒤로가기가 발생하면 히스토리를 모두
 * 뒤로 이동시켜 앱을 종료합니다.
 */
export default function useBackExit(allowCount: number = tabs.length + 1) {
  const toastIdRef = useRef<string | number | null>(null);
  const popCountRef = useRef(0);

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) return;

    const showToast = () => {
      if (toastIdRef.current && toast.isActive(toastIdRef.current)) return;
      toastIdRef.current = toast.info('앱을 종료하려면 뒤로가기를 한 번 더 누르세요.');
    };

    const handlePopState = () => {
      popCountRef.current += 1;
      if (toastIdRef.current && toast.isActive(toastIdRef.current)) {
        history.go(-history.length);
        return;
      }
      const shouldToast = history.length <= 1 || popCountRef.current >= allowCount;
      if (shouldToast) {
        showToast();
        history.pushState(null, '', location.href);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [allowCount]);
}
