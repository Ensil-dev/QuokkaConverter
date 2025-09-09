'use client';
import { useRouter } from '@/i18n/navigation';
import { useEffect } from 'react';

export default function ConvertPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/convert/media');
  }, [router]);

  return null;
}
