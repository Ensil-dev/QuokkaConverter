'use client';
import React from 'react';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';

interface LoginCardProps {
  onLogin: () => void;
}

const LoginCard = React.memo(function LoginCard({ onLogin }: LoginCardProps) {
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
            alt="QuokkaConverter"
            priority
            width={64}
            height={64}
            className="mr-[8px] select-none"
          />
          <span className="select-none text-2xl font-bold text-black dark:text-white z-50">
            QuokkaConverter
          </span>
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
            <span className="select-none text-2xl">Google로 로그인</span>
          </button>
        </div>
      </div>
    </div>
  );
});

export default LoginCard;
