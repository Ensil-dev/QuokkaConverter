'use client';

import React from 'react';
import { downloadBlob, makeFilename } from '@/lib/utils';
import PreviewImage from '@/components/PreviewImage';

interface ConverterResultProps {
  result: Blob | { blob: Blob; size: number };
  filename?: string;
  format: string;
  previewUrl?: string;
  downloadLabel?: string;
  children?: React.ReactNode;
}

export default function ConverterResult({
  result,
  filename = 'result',
  format,
  previewUrl,
  downloadLabel = '다운로드',
  children
}: ConverterResultProps) {
  
  const handleDownload = () => {
    const blob = 'blob' in result ? result.blob : result;
    const name = makeFilename(filename, format);
    downloadBlob(blob, name);
  };

  const sizeBytes = 'blob' in result ? result.size : (result as Blob).size;
  const fileSize = (sizeBytes / 1024 / 1024).toFixed(2);

  return (
    <div className="result">
      <h2>변환 완료</h2>
      
      {previewUrl && <PreviewImage url={previewUrl} />}
      
      <div className="resultInfo">
        <p>파일 크기: {fileSize} MB</p>
      </div>
      
      {children}
      
      <button type="button" onClick={handleDownload} className="download-btn">
        {downloadLabel}
      </button>
    </div>
  );
}
