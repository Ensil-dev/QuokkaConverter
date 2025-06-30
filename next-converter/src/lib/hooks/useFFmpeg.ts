'use client';
import { useState, useEffect } from 'react';
import { initFFmpeg } from '@/lib/ffmpegWasm';

export default function useFFmpeg() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initFFmpeg()
      .then(() => setIsReady(true))
      .catch((err) => {
        console.error('FFmpeg 초기화 실패:', err);
        setError('FFmpeg 로드에 실패했습니다.');
      });
  }, []);

  return { isReady, error };
}
