'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import Loading from '@/components/Loading';
import { loginWithGoogle, downloadBlob } from '@/lib/utils';
import useConversionEstimates from '@/lib/hooks/useConversionEstimates';
import { getAvailableOutputFormats } from '@/lib/utils/conversionHelper';

import LoginCard from '@/components/LoginCard';
import PdfConverter from '@/components/PdfConverter';
import ResultPlaceholder from '@/components/ResultPlaceholder';
import Header from '@/components/Header';
import ErrorMessage from '@/components/ErrorMessage';
import { convertFileWithWasm } from '@/lib/ffmpegWasm';
import useFFmpeg from '@/lib/hooks/useFFmpeg';
import { detectFileType, isConversionSupported } from '@/lib/utils/fileFormats';

interface ConversionResult {
  url: string;
  filename: string;
  size: string;
  format: string;
}

interface ConverterProps {
  showModeSelector?: boolean;
}

export default function Converter({ showModeSelector = true }: ConverterProps) {
  const { session, status } = useAuth();
  const [mode, setMode] = useState<'media' | 'pdf'>('media');
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState('');
  const [availableFormats, setAvailableFormats] = useState<string[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState('');
  const { isReady: isFFmpegLoaded, error: ffmpegError } = useFFmpeg();

  const { getEstimatedTime, getEstimatedFileSize } = useConversionEstimates();

  // 비디오 설정 옵션들 상태 관리
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [resolution, setResolution] = useState('original');
  const [fps, setFps] = useState(10);
  const [bitrate, setBitrate] = useState('');
  const [videoQuality, setVideoQuality] = useState('보통');

  // 오디오 설정 옵션들 상태 관리
  const [sampleRate, setSampleRate] = useState('');
  const [channels, setChannels] = useState('');
  const [audioQuality, setAudioQuality] = useState('보통');

  // 이미지 설정 옵션들 상태 관리
  const [imageResolution, setImageResolution] = useState('original');
  const [imageQuality, setImageQuality] = useState('보통');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (ffmpegError) {
      setError(ffmpegError);
    }
  }, [ffmpegError]);

  // 슬라이더 초기 색상 설정
  useEffect(() => {
    const slider = document.getElementById('playbackSpeed') as HTMLInputElement;
    if (slider) {
      slider.style.setProperty('--slider-color', 'var(--primary-color)');
    }
  }, [outputFormat]);

  // 출력 형식 필터링
  const filterOutputFormats = (inputType: string) => {
    setAvailableFormats(getAvailableOutputFormats(inputType));
  };


  // 파일 업로드 처리
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // 파일 크기 제한 검증 (100MB)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (selectedFile.size > maxSize) {
        setError('파일 크기가 너무 큽니다. 100MB 이하의 파일을 선택해주세요.');
        setFile(null);
        setFileType(null);
        setOutputFormat('');
        return;
      }

      setFile(selectedFile);
      const detectedType = detectFileType(selectedFile.name);

      if (!detectedType) {
        setError('지원하지 않는 파일 형식입니다. 다른 파일을 선택해주세요.');
        setFile(null);
        setFileType(null);
        setOutputFormat('');
        return;
      }

      setFileType(detectedType);
      setError('');
      setConvertedFile(null);
      setResult(null);

      // 파일 타입에 따라 출력 형식 필터링
      if (detectedType) {
        filterOutputFormats(detectedType);
      }
    } else {
      setFile(null);
      setFileType(null);
      setOutputFormat('');
      setError('');
      setConvertedFile(null);
      setResult(null);
    }
  }, []);

  // 변환 실행
  const handleConvert = useCallback(async () => {
    if (!file || !outputFormat || !isFFmpegLoaded) {
      setError('파일과 출력 형식을 선택해주세요.');
      return;
    }

    setIsConverting(true);
    setError('');
    setProgress(0);
    setResult(null);

    try {
      // 변환 옵션 수집
      const options: Record<string, unknown> = {};

      // 비디오 옵션들
      if (fileType === 'video') {
        if (resolution && resolution !== 'original') options.resolution = resolution;
        if (fps) options.fps = fps;
        if (bitrate) options.bitrate = bitrate;
        if (videoQuality) options.quality = videoQuality;
        if (playbackSpeed) options.playbackSpeed = playbackSpeed;
      }

      setProgress(25);

      // 오디오 옵션들
      if (fileType === 'audio') {
        if (sampleRate) options.sampleRate = sampleRate;
        if (channels) options.channels = channels;
        if (audioQuality) options.quality = audioQuality;
      }

      setProgress(50);

      // 이미지 옵션들
      if (fileType === 'image') {
        if (imageResolution && imageResolution !== 'original') options.resolution = imageResolution;
        if (imageQuality) options.quality = imageQuality;
      }

      setProgress(75);

      // 파일 변환 실행
      const inputExt = file.name.split('.').pop()?.toLowerCase() || 'mp4';
      const buffer = await file.arrayBuffer();
      const { data } = await convertFileWithWasm(buffer, inputExt, outputFormat, options);

      const convertBlob = new Blob([data], { type: 'application/octet-stream' });
      setProgress(100);
      setConvertedFile(convertBlob);

      // 결과 설정
      // const resultUrl = URL.createObjectURL(convertBlob);

      setResult({
        url: URL.createObjectURL(convertBlob),
        filename: `converted.${outputFormat}`,
        size: (convertBlob.size / 1024 / 1024).toFixed(2),
        format: outputFormat,
      });
    } catch (error) {
      console.error('변환 오류:', error);
      setError(error instanceof Error ? error.message : '변환에 실패했습니다.');
    } finally {
      setIsConverting(false);
      setProgress(0);
    }
  }, [
    file,
    outputFormat,
    fileType,
    resolution,
    fps,
    bitrate,
    videoQuality,
    playbackSpeed,
    sampleRate,
    channels,
    audioQuality,
    imageResolution,
    imageQuality,
    isFFmpegLoaded
  ]);

  // 변환된 파일 다운로드
  const handleDownload = useCallback(() => {
    if (convertedFile) {
      const format = result?.format || outputFormat;
      downloadBlob(convertedFile, `converted.${format}`);
    }
  }, [convertedFile, result, outputFormat]);

  // 재생속도 변경
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseFloat(e.target.value);
    setPlaybackSpeed(newSpeed);

    // 슬라이더 색상 변경
    const slider = e.target;
    slider.style.setProperty(
      '--slider-color',
      newSpeed < 1 ? '#28a745' : newSpeed > 1 ? '#dc3545' : 'var(--primary-color)'
    );
  };


  // 로그인 상태 확인
  if (status === 'loading') {
    return <Loading />;
  }

  if (!session) {
    return <LoginCard onLogin={loginWithGoogle} />;
  }

  return (
    <div className="container rounded-[15px]" suppressHydrationWarning={true}>
      {/* 헤더 */}
      <Header subtitle="비디오, 오디오, 이미지 파일을 다양한 형식으로 변환하세요" />

      {showModeSelector && (
        <div className="format-section">
          <label htmlFor="mode">메뉴 선택:</label>
          <select
            id="mode"
            value={mode}
            onChange={(e) => setMode(e.target.value as 'media' | 'pdf')}
          >
            <option value="media">미디어 변환</option>
            <option value="pdf">PDF 변환</option>
          </select>
        </div>
      )}

      {mode === 'media' && (
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            handleConvert();
          }}
        >
          <div className="file-section">
            <label htmlFor="fileInput">파일 업로드:</label>
            <input
              ref={fileInputRef}
              type="file"
              id="fileInput"
              onChange={handleFileUpload}
              required
            />
            <p className="file-limit-note">최대 파일 크기: 100MB (로컬 실행 제한)</p>
            {file && (
              <div className="file-info">
                <p>
                  <strong>파일명:</strong> {file.name}
                </p>
                <p>
                  <strong>크기:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p>
                  <strong>타입:</strong>{' '}
                  {fileType
                    ? fileType.charAt(0).toUpperCase() + fileType.slice(1)
                    : '지원하지 않는 형식'}
                </p>
              </div>
            )}
          </div>

          <div className="format-section">
            <label htmlFor="outputFormat">출력 형식:</label>
            <select
              id="outputFormat"
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              required
            >
              <option value="">변환할 형식을 선택하세요</option>
              {availableFormats.map((format, index) => (
                <option key={`${format}-${index}`} value={format}>
                  {format.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* GIF 변환 시에만 재생속도 옵션을 컨테이너 상단에 표시 */}
          {fileType === 'video' && outputFormat === 'gif' && (
            <div className="speed-control-section">
              <div className="speed-header">
                <label htmlFor="playbackSpeed" className="speed-title">
                  재생속도 조절
                </label>
                <div className="speed-display">{playbackSpeed}x</div>
              </div>
              <div className="speed-slider-container">
                <div className="speed-labels">
                  <span className="speed-indicator slow">
                    <span className="speed-icon">🐌</span>
                    <span className="speed-text">느림</span>
                  </span>
                  <span className="speed-indicator fast">
                    <span className="speed-icon">⚡</span>
                    <span className="speed-text">빠름</span>
                  </span>
                </div>
                <div className="slider-track">
                  <input
                    type="range"
                    id="playbackSpeed"
                    min="0.25"
                    max="2.0"
                    step="0.25"
                    value={playbackSpeed}
                    className="speed-slider"
                    onChange={handleSpeedChange}
                  />
                  <div className="slider-markers">
                    <span className="marker">0.25x</span>
                    <span className="marker">0.5x</span>
                    <span className="marker">0.75x</span>
                    <span className="marker">1.0x</span>
                    <span className="marker">1.25x</span>
                    <span className="marker">1.5x</span>
                    <span className="marker">1.75x</span>
                    <span className="marker">2.0x</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 비디오 옵션 */}
          {fileType === 'video' && (
            <div className="options-section">
              <h3>비디오 설정</h3>
              <div className="option-row">
                <label htmlFor="resolution">해상도:</label>
                <select
                  id="resolution"
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                >
                  <option value="original">원본</option>
                  <option value="640x360">640x360</option>
                  <option value="1280x720">1280x720</option>
                  <option value="1920x1080">1920x1080</option>
                </select>
              </div>
              <div className="option-row">
                <label htmlFor="fps">프레임레이트:</label>
                <input
                  type="number"
                  id="fps"
                  value={fps}
                  onChange={(e) => setFps(Number(e.target.value))}
                  min="1"
                  max="60"
                />
              </div>
              {/* GIF 변환 시에는 비트레이트 옵션 숨김 */}
              {outputFormat !== 'gif' && (
                <div className="option-row">
                  <label htmlFor="bitrate">비트레이트:</label>
                  <select id="bitrate" value={bitrate} onChange={(e) => setBitrate(e.target.value)}>
                    <option value="">자동</option>
                    <option value="1000k">1000k</option>
                    <option value="2000k">2000k</option>
                    <option value="5000k">5000k</option>
                  </select>
                </div>
              )}
              <div className="option-row">
                <label htmlFor="videoQuality">품질:</label>
                <select
                  id="videoQuality"
                  value={videoQuality}
                  onChange={(e) => setVideoQuality(e.target.value)}
                >
                  <option value="보통">보통</option>
                  <option value="낮음">낮음 (파일 크기 작음)</option>
                  <option value="높음">높음 (파일 크기 큼)</option>
                </select>
                {outputFormat === 'gif' && (
                  <span className="option-note">GIF는 품질 설정으로 크기를 조절합니다</span>
                )}
              </div>
            </div>
          )}

          {/* 오디오 옵션 */}
          {fileType === 'audio' && (
            <div className="options-section">
              <h3>오디오 설정</h3>
              <div className="option-row">
                <label htmlFor="sampleRate">샘플레이트:</label>
                <select
                  id="sampleRate"
                  value={sampleRate}
                  onChange={(e) => setSampleRate(e.target.value)}
                >
                  <option value="">원본</option>
                  <option value="22050">22050 Hz</option>
                  <option value="44100">44100 Hz</option>
                  <option value="48000">48000 Hz</option>
                </select>
              </div>
              <div className="option-row">
                <label htmlFor="channels">채널:</label>
                <select id="channels" value={channels} onChange={(e) => setChannels(e.target.value)}>
                  <option value="">원본</option>
                  <option value="1">모노</option>
                  <option value="2">스테레오</option>
                </select>
              </div>
              <div className="option-row">
                <label htmlFor="audioQuality">품질:</label>
                <select
                  id="audioQuality"
                  value={audioQuality}
                  onChange={(e) => setAudioQuality(e.target.value)}
                >
                  <option value="보통">보통</option>
                  <option value="낮음">낮음 (파일 크기 작음)</option>
                  <option value="높음">높음 (파일 크기 큼)</option>
                </select>
              </div>
            </div>
          )}

          {/* 이미지 옵션 */}
          {fileType === 'image' && (
            <div className="options-section">
              <h3>이미지 설정</h3>
              <div className="option-row">
                <label htmlFor="imageResolution">해상도:</label>
                <select
                  id="imageResolution"
                  value={imageResolution}
                  onChange={(e) => setImageResolution(e.target.value)}
                >
                  <option value="original">원본</option>
                  <option value="800x600">800x600</option>
                  <option value="1024x768">1024x768</option>
                  <option value="1920x1080">1920x1080</option>
                </select>
              </div>
              <div className="option-row">
                <label htmlFor="imageQuality">품질:</label>
                <select
                  id="imageQuality"
                  value={imageQuality}
                  onChange={(e) => setImageQuality(e.target.value)}
                >
                  <option value="보통">보통</option>
                  <option value="낮음">낮음 (파일 크기 작음)</option>
                  <option value="높음">높음 (파일 크기 큼)</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={
              isConverting ||
              !file ||
              !isConversionSupported(file.name, outputFormat)
            }
          >
            {isConverting ? '변환 중...' : '변환하기'}
          </button>

          {/* 지원하지 않는 변환 조합 안내 */}
          {outputFormat && file && !isConversionSupported(file.name, outputFormat) && (
            <div className="warning-message">
              <p>⚠️ 이 변환 조합은 현재 지원되지 않습니다. 다른 출력 형식을 선택해주세요.</p>
            </div>
          )}
        </form>
      )}

      {mode === 'pdf' && <PdfConverter />}

      {/* 변환 진행 상태 */}
      {isConverting && (
        <div className="conversion-progress">
          <div className="progress-spinner"></div>
          <p>변환 중... {progress}%</p>
          <p className="progress-note">변환 시간은 파일 크기와 형식에 따라 달라질 수 있습니다.</p>
        </div>
      )}

      {/* 변환 중일 때 결과 영역 미리 확보 */}
      {isConverting && (
        <ResultPlaceholder
          icon="⏳"
          title="변환 결과 준비 중..."
          message="변환이 완료되면 여기에 결과가 표시됩니다"
          info={[
            { label: '출력 형식', value: outputFormat.toUpperCase() },
            {
              label: '예상 크기',
              value: getEstimatedFileSize(
                file!.size,
                fileType,
                outputFormat,
                playbackSpeed,
                resolution,
                fps,
                bitrate,
                videoQuality,
                audioQuality,
                imageQuality,
              ),
            },
            {
              label: '예상 시간',
              value: getEstimatedTime(
                file!.size,
                fileType,
                outputFormat,
                playbackSpeed,
                resolution,
                fps,
                videoQuality,
                audioQuality,
              ),
            },
          ]}
        />
      )}

      {/* 파일 업로드 및 출력 형식 선택 완료 시 결과 영역 미리 확보 */}
      {file && outputFormat && !isConverting && !result && !error && (
        <ResultPlaceholder
          ready
          icon="📁"
          title="변환 준비 완료"
          message="변환 버튼을 클릭하면 여기에 결과가 표시됩니다"
          info={[
            { label: '입력 파일', value: file.name },
            { label: '출력 형식', value: outputFormat.toUpperCase() },
            { label: '파일 크기', value: `${(file.size / 1024 / 1024).toFixed(2)} MB` },
            {
              label: '예상 크기',
              value: getEstimatedFileSize(
                file.size,
                fileType,
                outputFormat,
                playbackSpeed,
                resolution,
                fps,
                bitrate,
                videoQuality,
                audioQuality,
                imageQuality,
              ),
            },
            ...(fileType === 'video' && outputFormat === 'gif'
              ? [{ label: '재생속도', value: `${playbackSpeed}x` }]
              : []),
            ...(fileType === 'video' && resolution !== 'original'
              ? [{ label: '해상도', value: resolution }]
              : []),
            ...(fileType === 'video' && fps !== 10
              ? [{ label: '프레임레이트', value: `${fps} FPS` }]
              : []),
            ...(fileType === 'video' && bitrate && outputFormat !== 'gif'
              ? [{ label: '비트레이트', value: bitrate }]
              : []),
            ...(fileType === 'video' && videoQuality !== '보통'
              ? [{ label: '품질', value: videoQuality }]
              : []),
            {
              label: '예상 시간',
              value: getEstimatedTime(
                file.size,
                fileType,
                outputFormat,
                playbackSpeed,
                resolution,
                fps,
                videoQuality,
                audioQuality,
              ),
            },
          ]}
        />
      )}

      {/* GIF에서 WebP 변환 시 특별 안내 */}
      {file && file.name.toLowerCase().endsWith('.gif') && outputFormat === 'webp' && (
        <div className="info-message">
          <p>
            💡 <strong>GIF → WebP 변환 팁:</strong> WebP는 GIF보다 훨씬 효율적인 압축을 사용하여
            파일 크기가 90% 이상 감소할 수 있습니다!
          </p>
        </div>
      )}

      {result && (
        <div className="result">
          <h2>변환 결과</h2>
          <div className="resultInfo">
            <p>
              <strong>변환 완료!</strong>
            </p>
            <p>파일 크기: {result.size} MB</p>
            <p>출력 형식: {result.format.toUpperCase()}</p>
          </div>
          <button onClick={handleDownload} className="download-btn">
            파일 다운로드
          </button>
        </div>
      )}

      {error && <ErrorMessage title="오류 발생" message={error} />}
    </div>
  );
}
