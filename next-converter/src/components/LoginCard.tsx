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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-5">
      <div className="flex items-center gap-4 mb-5">
        <Image
          src="/apple-touch-icon.png"
          alt={t('title')}
          priority
          width={52}
          height={52}
          className="rounded-full select-none"
        />
        <span className="text-3xl font-bold text-white tracking-tight select-none">
          {t('title')}
        </span>
      </div>
      <p className="text-base text-[#888] mb-10">
        {t('subtitle')}
      </p>
      <button
        type="button"
        onClick={onLogin}
        className="flex items-center gap-4 rounded-xl bg-white px-12 py-4 text-base font-semibold text-[#111] shadow-lg transition hover:opacity-90 cursor-pointer select-none"
      >
        <FcGoogle size={24} />
        <span>{t('googleLogin')}</span>
      </button>
      <div className="flex gap-10 mt-14 text-sm text-[#555]">
        <span className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-[#444]" />
          {t('featureMedia')}
        </span>
        <span className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-[#444]" />
          {t('featureGif')}
        </span>
        <span className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-[#444]" />
          {t('featurePdf')}
        </span>
      </div>
    </div>
  );
});

export default LoginCard;
