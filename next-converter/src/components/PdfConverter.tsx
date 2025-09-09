'use client';
import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import { useTranslations } from 'next-intl';
import { downloadBlob, makeFilename } from '@/lib/utils';
import ErrorMessage from '@/components/ErrorMessage';
import ResultPlaceholder from '@/components/ResultPlaceholder';
import usePdfEstimates from '@/lib/hooks/usePdfEstimates';
import CustomFileInput from '@/components/CustomFileInput';

export default function PdfConverter() {
  const t = useTranslations('Pdf');
  const [operation, setOperation] = useState<'images' | 'merge' | 'split'>('images');
  const [files, setFiles] = useState<FileList | null>(null);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { getEstimatedFileSize, getEstimatedTime } = usePdfEstimates();
  const operationLabel = {
    images: t('imagesToPdf'),
    merge: t('mergePdf'),
    split: t('splitPdf'),
  }[operation];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
    setResult(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      setError(t('selectFile'));
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
        throw new Error(data.error || t('processingFailed'));
      }
      const blob = await res.blob();
      setResult(blob);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('unknownError'));
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!result) return;
    const baseName = files?.[0]?.name || 'result';
    const name =
      operation === 'split'
        ? makeFilename(`${baseName.replace(/\.[^.]+$/, '')}-page-${page}`, 'pdf')
        : makeFilename(baseName, 'pdf');
    downloadBlob(result, name);
  };

  const loadingInfo = useMemo(() => {
    return [
      { label: t('operation'), value: operationLabel },
      { label: t('estimatedSize'), value: getEstimatedFileSize(files, operation) },
      { label: t('estimatedTime'), value: getEstimatedTime(files) },
    ];
  }, [t, operationLabel, files, operation, getEstimatedFileSize, getEstimatedTime]);

  const preparedInfo = useMemo(() => {
    if (!files) return [] as { label: string; value: React.ReactNode }[];
    const base = [
      files.length === 1
        ? { label: t('inputFile'), value: files[0].name }
        : { label: t('fileCount'), value: files.length },
      { label: t('operation'), value: operationLabel },
      ...(operation === 'split' ? [{ label: t('page'), value: page }] : []),
      { label: t('estimatedSize'), value: getEstimatedFileSize(files, operation) },
      { label: t('estimatedTime'), value: getEstimatedTime(files) },
    ];
    return base;
  }, [t, files, operation, page, operationLabel, getEstimatedFileSize, getEstimatedTime]);

  return (
    <div className="container rounded-[15px]">
      <Header subtitle={t('subtitle')} />
      <form onSubmit={handleSubmit}>
        <div className="file-section">
          <label>{t('uploadFiles')}</label>
          <CustomFileInput
            id="pdfFiles"
            multiple={operation !== 'split'}
            accept={
              operation === 'images'
                ? 'image/jpeg,image/png'
                : 'application/pdf'
            }
            onChange={handleChange}
            selectedFiles={files}
            required
          />
        </div>
        <div className="format-section">
          <label htmlFor="operation">{t('operation')}</label>
          <select
            id="operation"
            value={operation}
            onChange={(e) => setOperation(e.target.value as 'images' | 'merge' | 'split')}
          >
            <option value="images">{t('imagesToPdf')}</option>
            <option value="merge">{t('mergePdf')}</option>
            <option value="split">{t('splitPdf')}</option>
          </select>
        </div>
        {operation === 'split' && (
          <div className="option-row">
            <label htmlFor="page">{t('pageNumber')}</label>
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
            <h2>{t('complete')}</h2>
            <button type="button" onClick={download} className="download-btn">
              {t('downloadFile')}
            </button>
          </div>
        )}
        <button type="submit" disabled={loading}>
          {loading ? t('processing') : t('process')}
        </button>
      </form>

      {loading && (
        <ResultPlaceholder
          icon="⏳"
          title={t('resultReady')}
          message={t('readyMessage')}
          info={loadingInfo}
        />
      )}

      {files && !loading && !result && !error && (
        <ResultPlaceholder
          ready
          icon="📁"
          title={t('readyToProcess')}
          message={t('readyMessage')}
          info={preparedInfo}
        />
      )}
    </div>
  );
}
