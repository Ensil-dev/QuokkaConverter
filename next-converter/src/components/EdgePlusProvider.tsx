'use client';

import { useEffect } from 'react';
import { init } from '@edgeplus/sdk';

export default function EdgePlusProvider() {
  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_EDGEPLUS_SITE_KEY;
    if (!siteKey) return;
    init({ siteKey });
  }, []);

  return null;
}
