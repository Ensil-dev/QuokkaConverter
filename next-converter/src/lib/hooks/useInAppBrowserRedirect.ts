'use client';

import { useEffect } from 'react';

/**
 * 인앱 브라우저 리다이렉트를 처리하는 React Hook
 * 
 * 이 훅은 앱이 특정 인앱 브라우저(KakaoTalk, LINE) 내에서 실행될 때를 감지하고
 * 더 나은 사용자 경험을 위해 외부 브라우저로 리다이렉트합니다.
 * 
 * 인앱 브라우저는 종종 제한된 기능을 가지고 있어 다음과 같은 문제를 일으킬 수 있습니다:
 * - 파일 업로드 제한
 * - 복잡한 JavaScript 기능 제한
 * - 결제 처리 문제
 * - 성능 및 호환성 문제
 * 
 * @returns {void}
 */
export default function useInAppBrowserRedirect(): void {
    useEffect(() => {
        const currentUserAgent = navigator.userAgent.toLowerCase();
        const currentUrl = window.location.href;

        redirectToExternalBrowserIfNeeded(currentUserAgent, currentUrl);
    }, []); // 빈 의존성 배열 - 마운트 시에만 한 번 실행
}

/**
 * 사용자 에이전트를 확인하여 필요한 경우 외부 브라우저로 리다이렉트
 * 
 * @param {string} userAgent - 사용자 에이전트 문자열
 * @param {string} currentUrl - 현재 페이지 URL
 */
function redirectToExternalBrowserIfNeeded(userAgent: string, currentUrl: string): void {
    if (isKakaoTalkBrowser(userAgent)) {
        redirectToKakaoTalkExternalBrowser(currentUrl);
    } else if (isLineBrowser(userAgent)) {
        redirectToLineExternalBrowser(currentUrl);
    }
    // 다른 브라우저에서는 아무것도 하지 않음 (정상적인 브라우저 동작 허용)
}

/**
 * KakaoTalk 브라우저인지 확인
 * 
 * @param {string} userAgent - 사용자 에이전트 문자열
 * @returns {boolean} KakaoTalk 브라우저 여부
 */
function isKakaoTalkBrowser(userAgent: string): boolean {
    return userAgent.includes('kakaotalk');
}

/**
 * LINE 브라우저인지 확인
 * 
 * @param {string} userAgent - 사용자 에이전트 문자열
 * @returns {boolean} LINE 브라우저 여부
 */
function isLineBrowser(userAgent: string): boolean {
    return userAgent.includes('line');
}

/**
 * KakaoTalk 외부 브라우저로 리다이렉트
 * 
 * @param {string} currentUrl - 현재 페이지 URL
 */
function redirectToKakaoTalkExternalBrowser(currentUrl: string): void {
    const kakaoTalkExternalUrl = `kakaotalk://web/openExternal?url=${encodeURIComponent(currentUrl)}`;
    window.location.href = kakaoTalkExternalUrl;
}

/**
 * LINE 외부 브라우저로 리다이렉트
 * 
 * @param {string} currentUrl - 현재 페이지 URL
 */
function redirectToLineExternalBrowser(currentUrl: string): void {
    const lineExternalUrl = currentUrl.includes('?')
        ? `${currentUrl}&openExternalBrowser=1`  // URL에 이미 파라미터가 있음
        : `${currentUrl}?openExternalBrowser=1`; // URL에 파라미터가 없음

    window.location.href = lineExternalUrl;
}
