'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FileText, Zap, Shield, Globe, ArrowRight, Check, Upload, Download, Cpu } from 'lucide-react';

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
  <div className={`bg-gray-900 border rounded-lg p-6 relative ${isPopular ? 'border-white' : 'border-gray-800'
    }`}>
    {isPopular && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <Badge className="bg-white text-black px-3 py-1 text-xs font-medium">
          인기
        </Badge>
      </div>
    )}
    <div className="text-center mb-6">
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <div className="text-2xl font-bold text-white">{price}</div>
    </div>
    <ul className="space-y-3 mb-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
          <span className="text-gray-300 text-sm">{feature}</span>
        </li>
      ))}
    </ul>
    <Button
      className={`w-full font-medium ${isPopular
          ? 'bg-white text-black hover:bg-gray-100'
          : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
        }`}
    >
      시작하기
    </Button>
  </div>
);

const Landing: React.FC = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "빠른 변환",
      description: "서버리스 아키텍처로 즉시 파일 변환을 시작하세요. 대기 시간 없이 빠르게 처리됩니다."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "보안 우선",
      description: "클라이언트 사이드 처리로 파일이 서버에 업로드되지 않아 완벽한 보안을 보장합니다."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "어디서나 접근",
      description: "웹 브라우저만 있으면 언제 어디서나 파일 변환 서비스를 이용할 수 있습니다."
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "다양한 포맷",
      description: "PDF, 이미지, 문서, 비디오 등 다양한 파일 포맷을 지원하는 변환 엔진을 제공합니다."
    }
  ];

  const pricingPlans = [
    {
      title: "무료",
      price: "₩0",
      features: [
        "월 100회 변환",
        "기본 파일 포맷 지원",
        "5MB 파일 크기 제한",
        "커뮤니티 지원"
      ]
    },
    {
      title: "프로",
      price: "₩9,900/월",
      features: [
        "무제한 변환",
        "모든 파일 포맷 지원",
        "100MB 파일 크기 제한",
        "우선 지원",
        "배치 변환"
      ],
      isPopular: true
    },
    {
      title: "엔터프라이즈",
      price: "문의",
      features: [
        "무제한 변환",
        "커스텀 포맷 지원",
        "무제한 파일 크기",
        "전용 지원",
        "API 접근",
        "화이트라벨"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            안전하고 빠른
            <br />
            파일 변환 서비스
          </h1>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            클라이언트 사이드에서 직접 처리되는 서버리스 파일 변환으로 보안과 속도를 동시에
            확보하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-100 font-medium px-6 py-3"
            >
              무료로 시작하기
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-900 font-medium px-6 py-3"
            >
              데모 보기
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              왜 우리 서비스를 선택해야 할까요?
            </h2>
            <p className="text-lg text-gray-400">
              서버리스 아키텍처의 장점을 활용한 혁신적인 파일 변환 경험
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
            간단한 3단계로 완성
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto">
                <Upload className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-lg font-semibold">1. 파일 업로드</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                변환하고 싶은 파일을 드래그 앤 드롭하거나 클릭해서 선택하세요.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto">
                <FileText className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-lg font-semibold">2. 포맷 선택</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                원하는 출력 포맷을 선택하고 필요한 옵션을 설정하세요.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto">
                <Download className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-lg font-semibold">3. 다운로드</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                변환이 완료되면 즉시 변환된 파일을 다운로드하세요.
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
              합리적인 가격으로 시작하세요
            </h2>
            <p className="text-lg text-gray-400">
              필요에 맞는 플랜을 선택하고 언제든지 업그레이드하세요
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
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
            지금 바로 시작해보세요
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            회원가입 없이도 무료로 파일 변환을 체험할 수 있습니다.
          </p>
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-100 font-medium px-6 py-3"
          >
            무료 체험하기
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;