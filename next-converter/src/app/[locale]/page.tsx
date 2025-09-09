'use client';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from '@/i18n/navigation';
import Loading from '@/components/Loading';
import LoginCard from '@/components/LoginCard';
import { loginWithGoogle } from '@/lib/utils';
import Script from 'next/script';

export default function Home() {
  const { session, status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace('/convert');
    }
  }, [session, router]);

  if (status === 'loading') {
    return <Loading />;
  }

  const structuredData = [
    // WebApplication 스키마
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "QuokkaConverter",
      "description": "무료 온라인 파일 변환기로 비디오, 오디오, 이미지를 다양한 형식으로 변환하세요",
      "url": "https://quokkaconverter.vercel.app",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "Any",
      "logo": "https://quokkaconverter.vercel.app/apple-touch-icon.png",
      "image": "https://quokkaconverter.vercel.app/og-image.png",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "비디오 파일 변환 (MP4, WebM, AVI 등)",
        "오디오 파일 변환 (MP3, WAV, AAC 등)", 
        "이미지 파일 변환 (JPG, PNG, WebP 등)",
        "GIF 생성 및 편집",
        "PDF 파일 관리 (병합, 분할, 변환)"
      ],
      "sameAs": [
        "https://quokkaconverter.vercel.app"
      ],
      "potentialAction": [
        {
          "@type": "UseAction",
          "target": "https://quokkaconverter.vercel.app/ko/convert/media",
          "name": "파일 확장자 변환"
        },
        {
          "@type": "UseAction", 
          "target": "https://quokkaconverter.vercel.app/ko/convert/gif",
          "name": "GIF 생성"
        },
        {
          "@type": "UseAction",
          "target": "https://quokkaconverter.vercel.app/ko/convert/pdf", 
          "name": "PDF 관리"
        }
      ]
    },
    // Organization 스키마 (로고용)
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "QuokkaConverter",
      "url": "https://quokkaconverter.vercel.app",
      "logo": {
        "@type": "ImageObject",
        "url": "https://quokkaconverter.vercel.app/apple-touch-icon.png",
        "width": "512",
        "height": "512"
      },
      "sameAs": [
        "https://quokkaconverter.vercel.app"
      ]
    }
  ];

  return (
    <>
      {structuredData.map((data, index) => (
        <Script
          key={index}
          id={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data),
          }}
        />
      ))}
      <LoginCard onLogin={loginWithGoogle} />
    </>
  );
}
