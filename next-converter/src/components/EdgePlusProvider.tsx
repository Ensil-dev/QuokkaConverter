'use client';

import { useEffect } from 'react';
import { init } from '@edgeplus/sdk';

export default function EdgePlusProvider() {
  useEffect(() => {
    init({
      siteKey: 'ep_site_quokka',
      endpoint: process.env.NODE_ENV === 'development'
        ? 'http://localhost:4000/api/collect'
        : undefined,
    });
  }, []);

  return null;
}
