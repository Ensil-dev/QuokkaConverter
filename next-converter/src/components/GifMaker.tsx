'use client';
import { useState } from 'react';
import useFFmpeg from '@/lib/hooks/useFFmpeg';
import { imagesToGifWithWasm } from '@/lib/ffmpegWasm';
import { downloadBlob, makeFilename } from '@/lib/utils';
import Header from '@/components/Header';
import ResultPlaceholder from '@/components/ResultPlaceholder';
import ErrorMessage from '@/components/ErrorMessage';
import PreviewImage from '@/components/PreviewImage';

export default function GifMaker() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [fps, setFps] = useState(5);
  const [quality, setQuality] = useState<'낮음' | '보통' | '높음'>('보통');
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
      setError('두 개 이상의 이미지를 선택하세요.');
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
      setError(err instanceof Error ? err.message : 'GIF 생성 실패');
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
      { label: '파일 수', value: files.length },
      { label: 'FPS', value: fps },
      { label: '품질', value: quality },
    ]
    : [];

  const preparedInfo = files
    ? [
      { label: '파일 수', value: files.length },
      { label: 'FPS', value: fps },
      { label: '품질', value: quality },
    ]
    : [];

  return (
    <div className="container rounded-[15px]">
      <Header subtitle="이미지를 이어붙여 하나의 GIF로 만들 수 있어요" />
      <form onSubmit={handleSubmit}>
        <div className="file-section">
          <label htmlFor="gifImages">이미지 선택:</label>
          <input
            id="gifImages"
            type="file"
            accept="image/*"
            multiple
            onChange={handleChange}
            required
          />
        </div>
        <div className="option-row">
          <label htmlFor="fps">
            <span>FPS:</span>
            <span className='text-[gray]'> 초당 프레임 수</span></label>
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
          <label htmlFor="quality">품질:</label>
          <select
            id="quality"
            value={quality}
            onChange={(e) => setQuality(e.target.value as '낮음' | '보통' | '높음')}
          >
            <option value="보통">보통</option>
            <option value="낮음">낮음 (파일 크기 작음)</option>
            <option value="높음">높음 (파일 크기 큼)</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? '변환 중...' : 'GIF 만들기'}
        </button>
      </form>
      {loading && (
        <ResultPlaceholder
          icon="⏳"
          title="GIF 변환 중"
          message="변환이 완료되면 여기에 결과가 표시됩니다"
          info={loadingInfo}
        />
      )}
      {files && files.length >= 2 && !loading && !result && !error && (
        <ResultPlaceholder
          ready
          icon="📁"
          title="변환 준비 완료"
          message="변환 버튼을 클릭하면 여기에 결과가 표시됩니다"
          info={preparedInfo}
        />
      )}
      {result && (
        <div className="result">
          <h2>미리보기</h2>
          {resultUrl && <PreviewImage url={resultUrl} />}
          <div className="resultInfo">
            <p>파일 크기: {(result.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          {/* <button
            type="button"
            onClick={() => resultUrl && window.open(resultUrl, '_blank')}
            className="open-btn"
          >
            새 탭에서 열기
          </button> */}
          <button type="button" onClick={download} className="download-btn">
            파일 다운로드
          </button>
        </div>
      )}
      {(error || ffmpegError) && <ErrorMessage message={error || ffmpegError || ''} />}
    </div>
  );
}
