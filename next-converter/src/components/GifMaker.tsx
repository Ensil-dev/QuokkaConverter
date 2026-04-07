'use client';

import { useState } from 'react';
import useFFmpeg from '@/lib/hooks/useFFmpeg';
import { useTranslations } from 'next-intl';
import { imagesToGifWithWasm } from '@/lib/ffmpegWasm';
import { CustomFileInput, ConverterLayout, ConverterForm, ConverterResult } from '@/components/ui';
import { useConverter } from '@/hooks/useConverter';

interface GifResult {
  blob: Blob;
  size: number;
}

export default function GifMaker() {
  const t = useTranslations('Gif');
  const [files, setFiles] = useState<FileList | null>(null);
  const [fps, setFps] = useState(5);
  const [quality, setQuality] = useState<'낮음' | '보통' | '높음' | 'low' | 'medium' | 'high'>('medium');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [imgSize, setImgSize] = useState<{ width: number; height: number } | null>(null);
  const { isReady, loadFFmpeg, error: ffmpegError } = useFFmpeg();
  
  const [state, actions] = useConverter<GifResult>();
  const { loading, error, result } = state;
  const { setLoading, setError, setResult } = actions;

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    setFiles(selected);
    setResult(null);
    setResultUrl(null);
    setError('');
    
    if (selected && selected[0]) {
      try {
        const bmp = await createImageBitmap(selected[0]);
        setImgSize({ width: bmp.width, height: bmp.height });
        bmp.close?.();
      } catch {
        setImgSize(null);
      }
    } else {
      setImgSize(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length < 2) {
      setError(t('errorTwoImages'));
      return;
    }
    if (!isReady) {
      try {
        await loadFFmpeg();
      } catch {
        return;
      }
    }
    
    setLoading(true);
    try {
      const inputs = await Promise.all(
        Array.from(files).map(async (f) => ({
          buffer: await f.arrayBuffer(),
          ext: f.name.split('.').pop()?.toLowerCase() || 'png',
        }))
      );
      
      const { data, size } = await imagesToGifWithWasm(
        inputs,
        fps,
        quality,
        6,
        imgSize?.width,
        imgSize?.height
      );
      
      const blob = new Blob([data], { type: 'image/gif' });
      const gifResult = { blob, size };
      setResult(gifResult);
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorCreationFailed'));
    } finally {
      setLoading(false);
    }
  };

  const loadingInfo = files
    ? [
        { label: t('fileCount'), value: files.length },
        { label: 'FPS', value: fps },
        { label: t('quality'), value: t(`quality${quality.charAt(0).toUpperCase() + quality.slice(1)}`) },
      ]
    : [];

  const readyInfo = files
    ? [
        { label: t('fileCount'), value: files.length },
        { label: 'FPS', value: fps },
        { label: t('quality'), value: t(`quality${quality.charAt(0).toUpperCase() + quality.slice(1)}`) },
      ]
    : [];

  const resultComponent = result && resultUrl ? (
    <ConverterResult
      result={result}
      filename={files?.[0]?.name || 'result'}
      format="gif"
      previewUrl={resultUrl}
      downloadLabel={t('downloadGif')}
    />
  ) : null;

  return (
    <ConverterLayout
      subtitle={t('title')}
      error={error || ffmpegError || ''}
      loading={loading}
      loadingInfo={loadingInfo}
      loadingTitle={t('conversionTitle')}
      loadingMessage={t('readyMessage')}
      ready={(files?.length ?? 0) >= 2}
      readyInfo={readyInfo}
      readyTitle={t('readyToCreate')}
      readyMessage={t('readyMessage')}
      result={resultComponent}
    >
      <ConverterForm
        onSubmit={handleSubmit}
        submitLabel={t('createGif')}
        loading={loading}
        loadingLabel={t('creating')}
      >
        <div className="file-section">
          <label>{t('selectImages')}</label>
          <CustomFileInput
            id="gifImages"
            accept="image/*"
            multiple
            onChange={handleChange}
            selectedFiles={files}
            required
          />
        </div>
        
        <div className="option-row">
          <label htmlFor="fps">{t('fps')}</label>
          <input
            id="fps"
            type="number"
            min={1}
            max={30}
            value={fps}
            onChange={(e) => setFps(Number(e.target.value))}
          />
        </div>
        
        <div className="option-row">
          <label htmlFor="quality">{t('quality')}</label>
          <select
            id="quality"
            value={quality}
            onChange={(e) => setQuality(e.target.value as '낮음' | '보통' | '높음')}
          >
            <option value="보통">{t('qualityMedium')}</option>
            <option value="낮음">{t('qualityLow')}</option>
            <option value="높음">{t('qualityHigh')}</option>
          </select>
        </div>
      </ConverterForm>
    </ConverterLayout>
  );
}
