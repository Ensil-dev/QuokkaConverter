'use client';
import Image from 'next/image';
import { useEffect } from 'react';

interface PreviewImageProps {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export default function PreviewImage({ url, alt = '미리보기', width = 250, height = 250 }: PreviewImageProps) {
  useEffect(() => {
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [url]);

  return (
    <Image src={url} alt={alt} width={width} height={height} className="result-preview" />
  );
}
