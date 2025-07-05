'use client';
import { useState } from 'react';
import useFFmpeg from '@/lib/hooks/useFFmpeg';
import { imagesToGifWithWasm } from '@/lib/ffmpegWasm';
import { downloadBlob } from '@/lib/utils';
import Header from '@/components/Header';
import ResultPlaceholder from '@/components/ResultPlaceholder';
import ErrorMessage from '@/components/ErrorMessage';

export default function GifMaker() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [fps, setFps] = useState(5);
  const [result, setResult] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isReady, loadFFmpeg, error: ffmpegError } = useFFmpeg();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
    setResult(null);
    setError('');
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
      const buffers = await Promise.all(
        Array.from(files).map((f) => f.arrayBuffer())
      );
      const { data } = await imagesToGifWithWasm(buffers, fps);
      setResult(new Blob([data], { type: 'image/gif' }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'GIF 생성 실패');
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (result) downloadBlob(result, 'result.gif');
  };

  const loadingInfo = files
    ? [
        { label: '파일 수', value: files.length },
        { label: 'FPS', value: fps },
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
          <label htmlFor="fps">FPS:</label>
          <input
            id="fps"
            type="number"
            min={1}
            max={30}
            value={fps}
            onChange={(e) => setFps(Number(e.target.value))}
          />
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
      {result && (
        <div className="result">
          <h2>완료</h2>
          <button type="button" onClick={download} className="download-btn">
            파일 다운로드
          </button>
        </div>
      )}
      {(error || ffmpegError) && (
        <ErrorMessage message={error || ffmpegError || ''} />
      )}
    </div>
  );
}
