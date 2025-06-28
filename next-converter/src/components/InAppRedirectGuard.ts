'use client';

import { useEffect } from 'react';
import { isInAppBrowser, redirectToExternalBrowser } from '../lib/browser';

export default function InAppRedirectGuard() {
    useEffect(() => {
        if (isInAppBrowser()) {
            redirectToExternalBrowser();
        }
    }, []);

    return null;
}
