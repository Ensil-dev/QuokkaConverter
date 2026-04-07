import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import LoginCardClient from './LoginCardClient';
import Script from 'next/script';

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect('/convert');
  }

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "QuokkaConverter",
      "alternateName": "퀘카컨버터",
      "description": "무료 온라인 파일 변환기로 비디오, 오디오, 이미지를 다양한 형식으로 변환하세요",
      "url": "https://quokkaconverter.vercel.app",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "Any",
      "browserRequirements": "Requires JavaScript. Modern browsers supported.",
      "logo": "https://quokkaconverter.vercel.app/apple-touch-icon.png",
      "image": "https://quokkaconverter.vercel.app/og-image.png",
      "featureList": [
        "비디오 파일 변환 (MP4, WebM, AVI 등)",
        "오디오 파일 변환 (MP3, WAV, AAC 등)",
        "이미지 파일 변환 (JPG, PNG, WebP 등)",
        "GIF 생성 및 편집",
        "PDF 파일 관리 (병합, 분할, 변환)"
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
      <LoginCardClient />
    </>
  );
}
