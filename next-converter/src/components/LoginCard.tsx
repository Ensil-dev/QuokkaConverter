'use client';
import React from 'react';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { useTranslations } from 'next-intl';

interface LoginCardProps {
  onLogin: () => void;
}

const LoginCard = React.memo(function LoginCard({ onLogin }: LoginCardProps) {
  const t = useTranslations('HomePage');

  return (
    <div className="flex justify-center">
      <div className="flex min-h-screen min-w-[340px] max-w-[400px] flex-col items-center justify-center bg-gray-100 font-sans">
        <div
          onClick={onLogin}
          className="flex cursor-pointer items-center gap-3"
          style={{ marginBottom: '10px' }}
        >
          <Image
            src="/apple-touch-icon.png"
            alt={t('title')}
            priority
            width={64}
            height={64}
            className="mr-[8px] select-none"
          />
          <span className="select-none text-2xl font-bold text-black dark:text-white z-50">
            {t('title')}
          </span>
        </div>
        
        {/* SEO 친화적인 콘텐츠 */}
        <div className="text-center mb-6 px-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {t('title')} - 무료 온라인 파일 변환기
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t('description')}
          </p>
          
          {/* 주요 기능 소개 */}
          <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h2 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">📁 확장자 변환</h2>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                비디오, 오디오, 이미지 파일을 다양한 형식으로 변환
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h2 className="font-semibold text-green-800 dark:text-green-200 mb-2">🎬 GIF 생성</h2>
              <p className="text-sm text-green-700 dark:text-green-300">
                이미지들을 합쳐서 움직이는 GIF 애니메이션 제작
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <h2 className="font-semibold text-red-800 dark:text-red-200 mb-2">📄 PDF 관리</h2>
              <p className="text-sm text-red-700 dark:text-red-300">
                PDF 병합, 분할, 이미지를 PDF로 변환
              </p>
            </div>
          </div>
        </div>
        
        <div
          className="flex w-full min-w-[340px] max-w-[400px] flex-col items-center gap-4 rounded-2xl bg-white shadow-lg"
          style={{
            padding: '10px',
            marginTop: 0,
            maxWidth: '400px',
            minWidth: '320px',
          }}
        >
          <button
            type="button"
            onClick={onLogin}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white p-4 py-3 text-lg font-semibold text-gray-800 shadow transition hover:shadow-md"
          >
            <FcGoogle size={48} />
            <span className="select-none text-2xl">{t('googleLogin')}</span>
          </button>
        </div>
      </div>
    </div>
  );
});

export default LoginCard;
