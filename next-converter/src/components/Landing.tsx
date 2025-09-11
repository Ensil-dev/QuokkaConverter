'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FileText, Zap, Shield, Globe, ArrowRight, Check, Upload, Download, Cpu } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-all duration-300">
    <div className="flex items-center gap-3 mb-4">
      <div className="text-white">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-white">{title}</h3>
    </div>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </div>
);

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ title, price, features, isPopular = false }) => (
  <div className={`bg-gray-900 border rounded-lg p-6 relative flex flex-col h-full ${isPopular ? 'border-gradient-to-r from-blue-400 to-purple-500 border-2' : 'border-gray-800'
    }`}>
    {isPopular && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 text-xs font-semibold shadow-lg border-0">
          ⭐ 인기
        </Badge>
      </div>
    )}
    <div className="text-center mb-6">
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <div className="text-2xl font-bold text-white">{price}</div>
    </div>
    <ul className="space-y-3 mb-8 flex-grow">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
          <span className="text-gray-300 text-sm">{feature}</span>
        </li>
      ))}
    </ul>
    <Button
      className={`w-full font-medium mt-auto transition-all duration-300 ${isPopular
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
        }`}
      onClick={() => window.location.href = '/login'}
    >
      {isPopular ? '✨ 지금 시작하기' : '시작하기'}
    </Button>
  </div>
);

const Landing: React.FC = () => {
  const router = useRouter();

  const handleStartFree = () => {
    router.push('/login');
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "빠른 처리",
      description: "브라우저에서 바로 변환이 진행되어 별도의 업로드나 다운로드 대기시간이 없습니다."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "개인정보 보호",
      description: "파일이 외부 서버로 전송되지 않고 사용자의 브라우저 내에서만 처리됩니다."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "설치 불필요",
      description: "별도 프로그램 설치 없이 웹 브라우저만 있으면 언제든 사용할 수 있습니다."
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "다양한 형식 지원",
      description: "비디오, 오디오, 이미지를 다양한 형식으로 변환하고 GIF 생성, PDF 관리 기능을 제공합니다."
    }
  ];

  const pricingPlans = [
    {
      title: "무료 플랜",
      price: "무료",
      features: [
        "파일당 최대 100MB 지원",
        "기본 파일 변환",
        "일반적인 형식 지원",
        "브라우저에서 직접 처리",
        "개인정보 보호"
      ]
    },
    {
      title: "프리미엄 플랜",
      price: "한정 기간 무료",
      features: [
        "파일당 최대 500MB 지원",
        "모든 변환 기능 무료 제공",
        "고급 변환 옵션",
        "일괄 처리 기능",
        "우선 지원",
        "광고 없는 경험"
      ],
      isPopular: true
    },
    {
      title: "향후 계획",
      price: "개발 예정",
      features: [
        "더 큰 파일 크기 지원",
        "API 접근 권한",
        "사용자 맞춤 기능",
        "엔터프라이즈 지원",
        "커뮤니티 의견 반영"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="pt-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            QuokkaConverter
            <br />
            무료 온라인 파일 변환기
          </h1>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            QuokkaConverter로 비디오, 오디오, 이미지를 다양한 형식으로 변환하세요. 
            브라우저에서 바로 작동하여 개인정보를 보호하면서 원하는 파일 형식으로 빠르게 변환할 수 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="border-gray-400 text-white hover:bg-blue-600 hover:font-bold font-medium px-12 py-6 cursor-pointer transition-all duration-200"
              onClick={handleStartFree}
            >
              바로 사용하기
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              QuokkaConverter의 특징
            </h2>
            <p className="text-lg text-gray-400">
              비디오, 오디오, 이미지 변환과 GIF 생성, PDF 관리 기능을 제공하는 무료 온라인 파일 변환기
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16">
            사용 방법
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto">
                <Upload className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-lg font-semibold">1. 파일 선택</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                변환할 파일을 드래그하거나 클릭해서 선택합니다.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto">
                <FileText className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-lg font-semibold">2. 형식 선택</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                변환하고 싶은 파일 형식을 선택합니다.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto">
                <Download className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-lg font-semibold">3. 변환 완료</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                변환된 파일을 바로 다운로드할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              요금제
            </h2>
            <p className="text-lg text-gray-400">
              현재 프리미엄 기능을 한정 기간 무료로 체험하실 수 있습니다
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {pricingPlans.map((plan, index) => (
              <PricingCard
                key={index}
                title={plan.title}
                price={plan.price}
                features={plan.features}
                isPopular={plan.isPopular}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            QuokkaConverter 사용해보기
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            무료 온라인 파일 변환기로 확장자 변환, GIF 생성, PDF 관리 기능을 지금 바로 사용해보세요.
          </p>
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-100 font-medium px-6 py-3 cursor-pointer"
            onClick={handleStartFree}
          >
            지금 시작하기
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;