'use client';

import { useEffect, useRef } from 'react';
import { tabs } from '@/components/BottomNav';

/**
 * 모바일 브라우저에서 뒤로가기 두 번으로 앱을 종료하도록 돕는 훅
 *
 * 최초 뒤로가기가 발생하면 토스트를 띄우고 히스토리를 유지합니다.
 * 토스트가 노출된 상태에서 다시 뒤로가기가 발생하면 히스토리를 모두
 * 뒤로 이동시켜 앱을 종료합니다.
 */
export default function useBackExit(allowCount: number = tabs.length + 1) {
  const toastVisibleRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const popCountRef = useRef(0);

  useEffect(() => {
    const showToast = () => {
      if (toastVisibleRef.current) return;

      toastVisibleRef.current = true;
      const toast = document.createElement('div');
      toast.textContent = '앱을 종료하려면 뒤로가기를 한 번 더 누르세요.';
      toast.style.position = 'fixed';
      toast.style.bottom = '20px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.background = 'rgba(0,0,0,0.7)';
      toast.style.color = '#fff';
      toast.style.padding = '10px 20px';
      toast.style.borderRadius = '4px';
      toast.style.zIndex = '9999';
      document.body.appendChild(toast);

      timeoutRef.current = setTimeout(() => {
        toast.remove();
        toastVisibleRef.current = false;
        timeoutRef.current = null;
      }, 2000);
    };

    const handlePopState = () => {
      popCountRef.current += 1;
      if (toastVisibleRef.current) {
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
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [allowCount]);
}
