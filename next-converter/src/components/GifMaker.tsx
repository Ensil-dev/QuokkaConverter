'use client';
import { useState } from 'react';
import useFFmpeg from '@/lib/hooks/useFFmpeg';
import { useTranslations } from 'next-intl';
import { imagesToGifWithWasm } from '@/lib/ffmpegWasm';
import { downloadBlob, makeFilename } from '@/lib/utils';
import Header from '@/components/Header';
import ResultPlaceholder from '@/components/ResultPlaceholder';
import ErrorMessage from '@/components/ErrorMessage';
import PreviewImage from '@/components/PreviewImage';
import CustomFileInput from '@/components/CustomFileInput';

export default function GifMaker() {
  const t = useTranslations('Gif');
  const [files, setFiles] = useState<FileList | null>(null);
  const [fps, setFps] = useState(5);
  const [quality, setQuality] = useState<'낮음' | '보통' | '높음' | 'low' | 'medium' | 'high'>('medium');
  const [result, setResult] = useState<{ blob: Blob; size: number } | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imgSize, setImgSize] = useState<{ width: number; height: number } | null>(null);
  const { isReady, loadFFmpeg, error: ffmpegError } = useFFmpeg();


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
      setResult({ blob, size });
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorCreationFailed'));
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (result) {
      const baseName = files?.[0]?.name || 'result';
      const name = makeFilename(baseName, 'gif');
      downloadBlob(result.blob, name);
    }
  };

  const loadingInfo = files
    ? [
      { label: t('fileCount'), value: files.length },
      { label: 'FPS', value: fps },
      { label: t('quality'), value: t(`quality${quality.charAt(0).toUpperCase() + quality.slice(1)}`) },
    ]
    : [];

  const preparedInfo = files
    ? [
      { label: t('fileCount'), value: files.length },
      { label: 'FPS', value: fps },
      { label: t('quality'), value: t(`quality${quality.charAt(0).toUpperCase() + quality.slice(1)}`) },
    ]
    : [];

  return (
    <div className="container rounded-[15px]">
      <Header subtitle={t('title')} />
      <form onSubmit={handleSubmit}>
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
        <button type="submit" disabled={loading}>
          {loading ? t('creating') : t('createGif')}
        </button>
      </form>
      {loading && (
        <ResultPlaceholder
          icon="⏳"
          title={t('conversionTitle')}
          message={t('readyMessage')}
          info={loadingInfo}
        />
      )}
      {files && files.length >= 2 && !loading && !result && !error && (
        <ResultPlaceholder
          ready
          icon="📁"
          title={t('readyToCreate')}
          message={t('readyMessage')}
          info={preparedInfo}
        />
      )}
      {result && (
        <div className="result">
          <h2>{t('preview')}</h2>
          {resultUrl && <PreviewImage url={resultUrl} />}
          <div className="resultInfo">
            <p>{t('fileSize')} {(result.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          {/* <button
            type="button"
            onClick={() => resultUrl && window.open(resultUrl, '_blank')}
            className="open-btn"
          >
            새 탭에서 열기
          </button> */}
          <button type="button" onClick={download} className="download-btn">
            {t('downloadGif')}
          </button>
        </div>
      )}
      {(error || ffmpegError) && <ErrorMessage message={error || ffmpegError || ''} />}
    </div>
  );
}
