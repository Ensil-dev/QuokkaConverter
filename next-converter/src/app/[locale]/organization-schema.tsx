'use client';
import Script from 'next/script';

// 별도의 Organization 구조화된 데이터 컴포넌트
export default function OrganizationSchema() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "QuokkaConverter",
    "alternateName": "Quokka Converter",
    "description": "무료 온라인 파일 변환기 서비스를 제공하는 조직",
    "url": "https://quokkaconverter.vercel.app",
    "logo": {
      "@type": "ImageObject",
      "url": "https://quokkaconverter.vercel.app/apple-touch-icon.png",
      "width": 512,
      "height": 512,
      "caption": "QuokkaConverter Logo"
    },
    "brand": {
      "@type": "Brand",
      "name": "QuokkaConverter",
      "logo": "https://quokkaconverter.vercel.app/apple-touch-icon.png"
    },
    "sameAs": [
      "https://quokkaconverter.vercel.app"
    ],
    "foundingDate": "2024",
    "knowsAbout": [
      "파일 변환",
      "비디오 변환",
      "오디오 변환", 
      "이미지 변환",
      "PDF 관리",
      "GIF 생성"
    ],
    "serviceType": [
      "File Conversion Service",
      "Media Processing",
      "Online Tools"
    ]
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationData),
      }}
    />
  );
}