'use client';

import { updateAppHeight } from '@/lib/utils';
import { useEffect } from 'react';

export function AppHeightSetter() {
    useEffect(() => {
        updateAppHeight();

        window.addEventListener('load', updateAppHeight);
        window.addEventListener('resize', updateAppHeight);
        window.visualViewport?.addEventListener('resize', updateAppHeight);

        return () => {
            window.removeEventListener('load', updateAppHeight);
            window.removeEventListener('resize', updateAppHeight);
            window.visualViewport?.removeEventListener('resize', updateAppHeight);
        };
    }, []);

    return null;
}
