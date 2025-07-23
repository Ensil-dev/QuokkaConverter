'use client';

import { updateAppHeight } from '@/lib/utils';
import { useEffect } from 'react';

interface NavigatorWithStandalone extends Navigator {
    standalone?: boolean;
}

function isPWA(): boolean {
    const navigatorWithStandalone = window.navigator as NavigatorWithStandalone;

    return window.matchMedia?.('(display-mode: standalone)').matches ||
        navigatorWithStandalone.standalone === true;
}

function waitForViewportStabilization(callback: () => void, options?: { interval?: number; stableCount?: number }) {
    const interval = options?.interval ?? 100; // ms
    const stableThreshold = options?.stableCount ?? 5; // 몇 번 연속 동일해야 안정된 것으로 판단

    let lastHeight = window.visualViewport?.height ?? window.innerHeight;
    let stableCounter = 0;

    const checker = setInterval(() => {
        const currentHeight = window.visualViewport?.height ?? window.innerHeight;

        if (Math.abs(currentHeight - lastHeight) < 1) {
            stableCounter++;
        } else {
            stableCounter = 0;
        }

        lastHeight = currentHeight;

        if (stableCounter >= stableThreshold) {
            clearInterval(checker);
            callback();
        }
    }, interval);
}

export function AppHeightSetter() {
    useEffect(() => {
        // 1. 첫 실행 (즉시)
        updateAppHeight();

        // 2. PWA 환경에서는 안정화될 때까지 감시
        if (isPWA()) {
            waitForViewportStabilization(updateAppHeight, {
                interval: 100,
                stableCount: 5,
            });
        }

        // 3. 이벤트 등록
        window.addEventListener('resize', updateAppHeight);
        window.visualViewport?.addEventListener('resize', updateAppHeight);

        return () => {
            window.removeEventListener('resize', updateAppHeight);
            window.visualViewport?.removeEventListener('resize', updateAppHeight);
        };
    }, []);

    return null;
}
