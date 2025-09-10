'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import usePdfEstimates from '@/lib/hooks/usePdfEstimates';
import { CustomFileInput, ConverterLayout, ConverterForm, ConverterResult } from '@/components/ui';
import { useConverter } from '@/hooks/useConverter';

export default function PdfConverter() {
  const t = useTranslations('Pdf');
  const [operation, setOperation] = useState<'images' | 'merge' | 'split'>('images');
  const [files, setFiles] = useState<FileList | null>(null);
  const [page, setPage] = useState(1);
  const { getEstimatedFileSize, getEstimatedTime } = usePdfEstimates();
  
  const [state, actions] = useConverter<Blob>();
  const { loading, error, result } = state;
  const { setLoading, setError, setResult } = actions;

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

  const loadingInfo = useMemo(() => {
    return [
      { label: t('operation'), value: operationLabel },
      { label: t('estimatedSize'), value: getEstimatedFileSize(files, operation) },
      { label: t('estimatedTime'), value: getEstimatedTime(files) },
    ];
  }, [t, operationLabel, files, operation, getEstimatedFileSize, getEstimatedTime]);

  const readyInfo = useMemo(() => {
    if (!files) return [] as { label: string; value: React.ReactNode }[];
    return [
      files.length === 1
        ? { label: t('inputFile'), value: files[0].name }
        : { label: t('fileCount'), value: files.length },
      { label: t('operation'), value: operationLabel },
      ...(operation === 'split' ? [{ label: t('page'), value: page }] : []),
      { label: t('estimatedSize'), value: getEstimatedFileSize(files, operation) },
      { label: t('estimatedTime'), value: getEstimatedTime(files) },
    ];
  }, [t, files, operation, page, operationLabel, getEstimatedFileSize, getEstimatedTime]);

  const getDownloadFilename = () => {
    const baseName = files?.[0]?.name || 'result';
    if (operation === 'split') {
      return `${baseName.replace(/\.[^.]+$/, '')}-page-${page}`;
    }
    return baseName;
  };

  const resultComponent = result ? (
    <ConverterResult
      result={result}
      filename={getDownloadFilename()}
      format="pdf"
      downloadLabel={t('downloadFile')}
    >
      <h2>{t('complete')}</h2>
    </ConverterResult>
  ) : null;

  return (
    <ConverterLayout
      subtitle={t('subtitle')}
      error={error}
      loading={loading}
      loadingInfo={loadingInfo}
      loadingTitle={t('resultReady')}
      loadingMessage={t('readyMessage')}
      ready={!!files}
      readyInfo={readyInfo}
      readyTitle={t('readyToProcess')}
      readyMessage={t('readyMessage')}
      result={resultComponent}
    >
      <ConverterForm
        onSubmit={handleSubmit}
        submitLabel={t('process')}
        loading={loading}
        loadingLabel={t('processing')}
      >
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
      </ConverterForm>
    </ConverterLayout>
  );
}