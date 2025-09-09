'use client';
import Image from 'next/image';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface PreviewImageProps {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export default function PreviewImage({ url, alt, width = 250, height = 250 }: PreviewImageProps) {
  const t = useTranslations('Common');
  
  useEffect(() => {
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [url]);

  return (
    <Image 
      src={url} 
      alt={alt || t('preview')} 
      width={width} 
      height={height} 
      className="result-preview" 
    />
  );
}
