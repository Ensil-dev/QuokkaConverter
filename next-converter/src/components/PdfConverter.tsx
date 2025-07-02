'use client';
import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import { downloadBlob } from '@/lib/utils';
import ErrorMessage from '@/components/ErrorMessage';
import ResultPlaceholder from '@/components/ResultPlaceholder';
import usePdfEstimates from '@/lib/hooks/usePdfEstimates';

export default function PdfConverter() {
  const [operation, setOperation] = useState<'images' | 'merge' | 'split'>('images');
  const [files, setFiles] = useState<FileList | null>(null);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { getEstimatedFileSize, getEstimatedTime } = usePdfEstimates();
  const operationLabel = {
    images: '이미지 → PDF 변환',
    merge: 'PDF 병합',
    split: 'PDF 페이지 분할',
  }[operation];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
    setResult(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      setError('파일을 선택하세요.');
      return;
    }
    const formData = new FormData();
    formData.append('operation', operation);
    if (operation === 'split') {
      formData.append('file', files[0]);
      formData.append('page', String(page));
    } else {
      Array.from(files).forEach((f) => formData.append('files', f));
    }

    setLoading(true);
    try {
      const res = await fetch('/api/pdf', { method: 'POST', body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '처리 실패');
      }
      const blob = await res.blob();
      setResult(blob);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!result) return;
    downloadBlob(result, 'result.pdf');
  };

  const loadingInfo = useMemo(() => {
    return [
      { label: '작업', value: operationLabel },
      { label: '예상 크기', value: getEstimatedFileSize(files, operation) },
      { label: '예상 시간', value: getEstimatedTime(files) },
    ];
  }, [operationLabel, files, operation, getEstimatedFileSize, getEstimatedTime]);

  const preparedInfo = useMemo(() => {
    if (!files) return [] as { label: string; value: React.ReactNode }[];
    const base = [
      files.length === 1
        ? { label: '입력 파일', value: files[0].name }
        : { label: '파일 수', value: files.length },
      { label: '작업', value: operationLabel },
      ...(operation === 'split' ? [{ label: '페이지', value: page }] : []),
      { label: '예상 크기', value: getEstimatedFileSize(files, operation) },
      { label: '예상 시간', value: getEstimatedTime(files) },
    ];
    return base;
  }, [files, operation, page, operationLabel, getEstimatedFileSize, getEstimatedTime]);

  return (
    <div className="container rounded-[15px]">
      <Header subtitle="이미지 → PDF 변환과 병합 및 분할 기능을 제공합니다" />
      <form onSubmit={handleSubmit}>
        <div className="file-section">
          <label htmlFor="pdfFiles">파일 업로드:</label>
          <input
            id="pdfFiles"
            type="file"
            multiple={operation !== 'split'}
            accept={
              operation === 'images'
                ? 'image/jpeg,image/png'
                : 'application/pdf'
            }
            onChange={handleChange}
            required
          />
        </div>
        <div className="format-section">
          <label htmlFor="operation">작업 선택:</label>
          <select
            id="operation"
            value={operation}
            onChange={(e) => setOperation(e.target.value as 'images' | 'merge' | 'split')}
          >
            <option value="images">이미지 → PDF 변환</option>
            <option value="merge">PDF 병합</option>
            <option value="split">PDF 페이지 분할</option>
          </select>
        </div>
        {operation === 'split' && (
          <div className="option-row">
            <label htmlFor="page">페이지 번호:</label>
            <input
              id="page"
              type="number"
              min={1}
              value={page}
              onChange={(e) => setPage(Number(e.target.value))}
            />
          </div>
        )}
        {error && <ErrorMessage message={error} />}
        {result && (
          <div className="result">
            <h2>완료</h2>
            <button type="button" onClick={download} className="download-btn">
              파일 다운로드
            </button>
          </div>
        )}
        <button type="submit" disabled={loading}>
          {loading ? '처리 중...' : '실행'}
        </button>
      </form>

      {loading && (
        <ResultPlaceholder
          icon="⏳"
          title="변환 결과 준비 중..."
          message="변환이 완료되면 여기에 결과가 표시됩니다"
          info={loadingInfo}
        />
      )}

      {files && !loading && !result && (
        <ResultPlaceholder
          ready
          icon="📁"
          title="변환 준비 완료"
          message="실행 버튼을 클릭하면 여기에 결과가 표시됩니다"
          info={preparedInfo}
        />
      )}
    </div>
  );
}
