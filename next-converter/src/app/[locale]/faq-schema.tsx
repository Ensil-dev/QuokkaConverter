'use client';
import Script from 'next/script';

export default function FAQSchema() {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "QuokkaConverter로 어떤 파일을 변환할 수 있나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "QuokkaConverter는 비디오(MP4, WebM, AVI), 오디오(MP3, WAV, AAC), 이미지(JPG, PNG, WebP) 파일을 다양한 형식으로 변환할 수 있습니다. 또한 GIF 생성과 PDF 관리 기능도 제공합니다."
        }
      },
      {
        "@type": "Question", 
        "name": "모바일에서도 파일 변환이 가능한가요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "네, QuokkaConverter는 모바일 브라우저에서도 완벽하게 작동합니다. 스마트폰이나 태블릿에서 언제든지 파일을 변환할 수 있습니다."
        }
      },
      {
        "@type": "Question",
        "name": "파일 변환이 무료인가요?",
        "acceptedAnswer": {
          "@type": "Answer", 
          "text": "네, QuokkaConverter의 모든 파일 변환 기능은 완전히 무료입니다. 회원가입 후 바로 이용할 수 있습니다."
        }
      },
      {
        "@type": "Question",
        "name": "업로드된 파일은 안전한가요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "모든 파일 변환은 브라우저에서 직접 처리되며, 서버로 업로드되지 않습니다. 개인정보와 파일의 안전이 완벽하게 보호됩니다."
        }
      },
      {
        "@type": "Question",
        "name": "최대 파일 크기 제한이 있나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "관리자가 설정한 파일 크기 제한 내에서 변환이 가능합니다. 일반적으로 100MB 이하의 파일을 권장합니다."
        }
      }
    ]
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqData),
      }}
    />
  );
}