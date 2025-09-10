'use client';

import React, { ReactNode } from 'react';
import Header from '@/components/Header';
import ErrorMessage from '@/components/ErrorMessage';
import ResultPlaceholder from '@/components/ResultPlaceholder';

interface ConverterLayoutProps {
  children: ReactNode;
  subtitle: string;
  error?: string;
  loading?: boolean;
  loadingInfo?: { label: string; value: React.ReactNode }[];
  loadingTitle?: string;
  loadingMessage?: string;
  loadingIcon?: string;
  ready?: boolean;
  readyInfo?: { label: string; value: React.ReactNode }[];
  readyTitle?: string;
  readyMessage?: string;
  readyIcon?: string;
  result?: ReactNode;
}

export default function ConverterLayout({
  children,
  subtitle,
  error,
  loading,
  loadingInfo,
  loadingTitle = '변환 중...',
  loadingMessage = '잠시만 기다려 주세요.',
  loadingIcon = '⏳',
  ready,
  readyInfo,
  readyTitle = '변환 준비 완료',
  readyMessage = '변환 버튼을 클릭하세요.',
  readyIcon = '📁',
  result
}: ConverterLayoutProps) {
  return (
    <div className="container rounded-[15px]">
      <Header subtitle={subtitle} />
      
      {children}
      
      {loading && (
        <ResultPlaceholder
          icon={loadingIcon}
          title={loadingTitle}
          message={loadingMessage}
          info={loadingInfo}
        />
      )}
      
      {ready && !loading && !result && !error && (
        <ResultPlaceholder
          ready
          icon={readyIcon}
          title={readyTitle}
          message={readyMessage}
          info={readyInfo}
        />
      )}
      
      {result}
      
      {error && <ErrorMessage message={error} />}
    </div>
  );
}