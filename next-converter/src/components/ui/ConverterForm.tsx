'use client';

import React, { ReactNode } from 'react';

interface ConverterFormProps {
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
  submitLabel: string;
  loading?: boolean;
  loadingLabel?: string;
}

export default function ConverterForm({
  onSubmit,
  children,
  submitLabel,
  loading = false,
  loadingLabel = '처리 중...'
}: ConverterFormProps) {
  return (
    <form onSubmit={onSubmit}>
      {children}
      
      <button type="submit" disabled={loading}>
        {loading ? loadingLabel : submitLabel}
      </button>
    </form>
  );
}