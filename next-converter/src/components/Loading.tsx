'use client';
import { FaSpinner } from 'react-icons/fa';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <FaSpinner className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-500" />
        <p className="text-sm text-gray-600 pt-[10px]">로딩 중...</p>
      </div>
    </div>
  );
}
