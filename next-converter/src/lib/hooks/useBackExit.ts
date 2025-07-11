'use client';

import { useEffect, useRef } from 'react';

/**
 * 브라우저 뒤로가기 누적 횟수를 카운트하여 앱 종료를 돕는 훅
 *
 * 뒤로가기를 4회 누르면 토스트 메시지를 표시하고, 토스트가 사라지기 전에
 * 다시 뒤로가기가 발생하면 window.close()를 호출해 앱을 종료합니다.
 */
export default function useBackExit() {
  const countRef = useRef(0);
  const toastVisibleRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        countRef.current = 0;
        timeoutRef.current = null;
      }, 2000);
    };

    const handlePopState = () => {
      countRef.current += 1;

      if (countRef.current >= 4) {
        if (toastVisibleRef.current) {
          window.close();
        } else {
          showToast();
        }
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
  }, []);
}
