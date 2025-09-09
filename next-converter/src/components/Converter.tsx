'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useAtom } from 'jotai';
import { useAuth } from '@/lib/auth';
import { useTranslations } from 'next-intl';
import Loading from '@/components/Loading';
import { loginWithGoogle, downloadBlob, makeFilename } from '@/lib/utils';
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
import PreviewImage from '@/components/PreviewImage';
import { maxUploadSizeAtom } from '@/lib/atoms';
import CustomFileInput from '@/components/CustomFileInput';

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
  const [maxUploadSize] = useAtom(maxUploadSizeAtom);
  const t = useTranslations('Convert');
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
  const { isReady: isFFmpegLoaded, error: ffmpegError, loadFFmpeg } = useFFmpeg();

  const { getEstimatedTime, getEstimatedFileSize } = useConversionEstimates();

  // 비디오 설정 옵션들 상태 관리
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [resolution, setResolution] = useState('original');
  const [fps, setFps] = useState(10);
  const [bitrate, setBitrate] = useState('');
  const [videoQuality, setVideoQuality] = useState('medium');

  // 오디오 설정 옵션들 상태 관리
  const [sampleRate, setSampleRate] = useState('');
  const [channels, setChannels] = useState('');
  const [audioQuality, setAudioQuality] = useState('medium');

  // 이미지 설정 옵션들 상태 관리
  const [imageResolution, setImageResolution] = useState('original');
  const [imageQuality, setImageQuality] = useState('medium');

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

  // 결과 미리보기 URL 정리
  useEffect(() => {
    return () => {
      if (result?.url) {
        URL.revokeObjectURL(result.url);
      }
    };
  }, [result]);

  // 출력 형식 필터링
  const filterOutputFormats = (inputType: string) => {
    setAvailableFormats(getAvailableOutputFormats(inputType));
  };


  // 파일 업로드 처리
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // 파일 크기 제한 검증
      const maxSize = maxUploadSize * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        setError(t('fileSizeError', { maxSize: maxUploadSize }));
        setFile(null);
        setFileType(null);
        setOutputFormat('');
        return;
      }

      setFile(selectedFile);
      const detectedType = detectFileType(selectedFile.name);

      if (!detectedType) {
        setError(t('unsupportedFileType'));
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
  }, [maxUploadSize, t]);

  // 변환 실행
  const handleConvert = useCallback(async () => {
    if (!file || !outputFormat) {
      setError(t('selectFileAndFormat'));
      return;
    }

    if (!isFFmpegLoaded) {
      try {
        await loadFFmpeg();
      } catch {
        return;
      }
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
        filename: makeFilename(file.name, outputFormat),
        size: (convertBlob.size / 1024 / 1024).toFixed(2),
        format: outputFormat,
      });
    } catch (error) {
      console.error('Conversion error:', error);
      setError(error instanceof Error ? error.message : t('error'));
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
    isFFmpegLoaded,
    loadFFmpeg,
    t
  ]);

  // 변환된 파일 다운로드
  const handleDownload = useCallback(() => {
    if (convertedFile) {
      const format = result?.format || outputFormat;
      const name = file ? makeFilename(file.name, format) : `converted.${format}`;
      downloadBlob(convertedFile, name);
    }
  }, [convertedFile, result, outputFormat, file]);

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

  const convertingInfo = useMemo(() => {
    if (!file) return [] as { label: string; value: React.ReactNode }[];
    return [
      { label: t('outputFormat'), value: outputFormat.toUpperCase() },
      {
        label: t('estimatedSize'),
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
      {
        label: t('estimatedTime'),
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
    ];
  }, [
    t,
    file,
    fileType,
    outputFormat,
    playbackSpeed,
    resolution,
    fps,
    bitrate,
    videoQuality,
    audioQuality,
    imageQuality,
    getEstimatedFileSize,
    getEstimatedTime,
  ]);

  const readyInfo = useMemo(() => {
    if (!file) return [] as { label: string; value: React.ReactNode }[];
    const base = [
      { label: t('inputFile'), value: file.name },
      { label: t('outputFormat'), value: outputFormat.toUpperCase() },
      { label: t('fileSize'), value: `${(file.size / 1024 / 1024).toFixed(2)} MB` },
      {
        label: t('estimatedSize'),
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
    ];
    if (fileType === 'video' && outputFormat === 'gif') {
      base.push({ label: t('playbackSpeed'), value: `${playbackSpeed}x` });
    }
    if (fileType === 'video' && resolution !== 'original') {
      base.push({ label: t('resolution'), value: resolution });
    }
    if (fileType === 'video' && fps !== 10) {
      base.push({ label: t('frameRate'), value: `${fps} FPS` });
    }
    if (fileType === 'video' && bitrate && outputFormat !== 'gif') {
      base.push({ label: t('bitrate'), value: bitrate });
    }
    if (fileType === 'video' && videoQuality !== 'medium') {
      base.push({ label: t('quality'), value: t(`quality_${videoQuality}`) });
    }
    base.push({
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
    });
    return base;
  }, [
    t,
    file,
    fileType,
    outputFormat,
    playbackSpeed,
    resolution,
    fps,
    bitrate,
    videoQuality,
    audioQuality,
    imageQuality,
    getEstimatedFileSize,
    getEstimatedTime,
  ]);


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
      <Header subtitle={t('subtitle')} />

      {showModeSelector && (
        <div className="format-section">
          <label htmlFor="mode">{t('menuSelect')}</label>
          <select
            id="mode"
            value={mode}
            onChange={(e) => setMode(e.target.value as 'media' | 'pdf')}
          >
            <option value="media">{t('mediaConvert')}</option>
            <option value="pdf">{t('pdfConvert')}</option>
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
            <label>{t('fileUpload')}</label>
            <CustomFileInput
              ref={fileInputRef}
              id="fileInput"
              onChange={handleFileUpload}
              selectedFiles={file ? (() => { 
                const dt = new DataTransfer(); 
                dt.items.add(file); 
                return dt.files; 
              })() : null}
              required
            />
            <p className="file-limit-note">{t('maxFileSize', { maxSize: maxUploadSize })}</p>
            {file && (
              <div className="file-info">
                <p>
                  <strong>{t('fileName')}</strong> {file.name}
                </p>
                <p>
                  <strong>{t('size')}</strong> {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p>
                  <strong>{t('type')}</strong>{' '}
                  {fileType
                    ? fileType.charAt(0).toUpperCase() + fileType.slice(1)
                    : t('unsupportedFormat')}
                </p>
              </div>
            )}
          </div>

          <div className="format-section">
            <label htmlFor="outputFormat">{t('outputFormat')}:</label>
            <select
              id="outputFormat"
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              required
            >
              <option value="">{t('selectFormat')}</option>
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
                  {t('playbackSpeedControl')}
                </label>
                <div className="speed-display">{playbackSpeed}x</div>
              </div>
              <div className="speed-slider-container">
                <div className="speed-labels">
                  <span className="speed-indicator slow">
                    <span className="speed-icon">🐌</span>
                    <span className="speed-text">{t('slow')}</span>
                  </span>
                  <span className="speed-indicator fast">
                    <span className="speed-icon">⚡</span>
                    <span className="speed-text">{t('fast')}</span>
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
              <h3>{t('videoSettings')}</h3>
              <div className="option-row">
                <label htmlFor="resolution">{t('resolution')}:</label>
                <select
                  id="resolution"
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                >
                  <option value="original">{t('original')}</option>
                  <option value="640x360">640x360</option>
                  <option value="1280x720">1280x720</option>
                  <option value="1920x1080">1920x1080</option>
                </select>
              </div>
              <div className="option-row">
                <label htmlFor="fps">{t('frameRate')}:</label>
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
                  <label htmlFor="bitrate">{t('bitrate')}:</label>
                  <select id="bitrate" value={bitrate} onChange={(e) => setBitrate(e.target.value)}>
                    <option value="">{t('auto')}</option>
                    <option value="1000k">1000k</option>
                    <option value="2000k">2000k</option>
                    <option value="5000k">5000k</option>
                  </select>
                </div>
              )}
              <div className="option-row">
                <label htmlFor="videoQuality">{t('quality')}:</label>
                <select
                  id="videoQuality"
                  value={videoQuality}
                  onChange={(e) => setVideoQuality(e.target.value)}
                >
                  <option value="medium">{t('quality_medium')}</option>
                  <option value="low">{t('quality_low')}</option>
                  <option value="high">{t('quality_high')}</option>
                </select>
                {outputFormat === 'gif' && (
                  <span className="option-note">{t('gifQualityNote')}</span>
                )}
              </div>
            </div>
          )}

          {/* 오디오 옵션 */}
          {fileType === 'audio' && (
            <div className="options-section">
              <h3>{t('audioSettings')}</h3>
              <div className="option-row">
                <label htmlFor="sampleRate">{t('sampleRate')}</label>
                <select
                  id="sampleRate"
                  value={sampleRate}
                  onChange={(e) => setSampleRate(e.target.value)}
                >
                  <option value="">{t('original')}</option>
                  <option value="22050">22050 Hz</option>
                  <option value="44100">44100 Hz</option>
                  <option value="48000">48000 Hz</option>
                </select>
              </div>
              <div className="option-row">
                <label htmlFor="channels">{t('channels')}</label>
                <select id="channels" value={channels} onChange={(e) => setChannels(e.target.value)}>
                  <option value="">{t('original')}</option>
                  <option value="1">{t('mono')}</option>
                  <option value="2">{t('stereo')}</option>
                </select>
              </div>
              <div className="option-row">
                <label htmlFor="audioQuality">{t('quality')}:</label>
                <select
                  id="audioQuality"
                  value={audioQuality}
                  onChange={(e) => setAudioQuality(e.target.value)}
                >
                  <option value="medium">{t('quality_medium')}</option>
                  <option value="low">{t('quality_low')}</option>
                  <option value="high">{t('quality_high')}</option>
                </select>
              </div>
            </div>
          )}

          {/* 이미지 옵션 */}
          {fileType === 'image' && (
            <div className="options-section">
              <h3>{t('imageSettings')}</h3>
              <div className="option-row">
                <label htmlFor="imageResolution">{t('resolution')}:</label>
                <select
                  id="imageResolution"
                  value={imageResolution}
                  onChange={(e) => setImageResolution(e.target.value)}
                >
                  <option value="original">{t('original')}</option>
                  <option value="800x600">800x600</option>
                  <option value="1024x768">1024x768</option>
                  <option value="1920x1080">1920x1080</option>
                </select>
              </div>
              <div className="option-row">
                <label htmlFor="imageQuality">{t('quality')}:</label>
                <select
                  id="imageQuality"
                  value={imageQuality}
                  onChange={(e) => setImageQuality(e.target.value)}
                >
                  <option value="medium">{t('quality_medium')}</option>
                  <option value="low">{t('quality_low')}</option>
                  <option value="high">{t('quality_high')}</option>
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
            {isConverting ? t('converting') : t('convertButton')}
          </button>

          {/* 지원하지 않는 변환 조합 안내 */}
          {outputFormat && file && !isConversionSupported(file.name, outputFormat) && (
            <div className="warning-message">
              <p>{t('unsupportedConversion')}</p>
            </div>
          )}
        </form>
      )}

      {mode === 'pdf' && <PdfConverter />}

      {/* 변환 진행 상태 */}
      {isConverting && (
        <div className="conversion-progress">
          <div className="progress-spinner"></div>
          <p>{t('conversionProgress', { progress })}</p>
          <p className="progress-note">{t('conversionNote')}</p>
        </div>
      )}

      {/* 변환 중일 때 결과 영역 미리 확보 */}
      {isConverting && (
        <ResultPlaceholder
          icon="⏳"
          title={t('resultReady')}
          message={t('resultMessage')}
          info={convertingInfo}
        />
      )}

      {/* 파일 업로드 및 출력 형식 선택 완료 시 결과 영역 미리 확보 */}
      {file && outputFormat && !isConverting && !result && !error && (
        <ResultPlaceholder
          ready
          icon="📁"
          title={t('readyToConvert')}
          message={t('clickToConvert')}
          info={readyInfo}
        />
      )}

      {/* GIF에서 WebP 변환 시 특별 안내 */}
      {file && file.name.toLowerCase().endsWith('.gif') && outputFormat === 'webp' && (
        <div className="info-message">
          <p>
            💡 <strong>GIF → WebP 변환 팁:</strong> WebP는 GIF보다 훨씬 효율적인 압축을 사용하여
            {t('gifToWebpTip')}
          </p>
        </div>
      )}

      {result && (
        <div className="result">
          <h2>{t('conversionResult')}</h2>
          {result.format === 'gif' && <PreviewImage url={result.url} />}
          <div className="resultInfo">
            <p>
              <strong>{t('conversionComplete')}</strong>
            </p>
            <p>{t('fileSize')}: {result.size} MB</p>
            <p>{t('outputFormat')}: {result.format.toUpperCase()}</p>
          </div>
          <button onClick={handleDownload} className="download-btn">
            {t('downloadFile')}
          </button>
        </div>
      )}

      {error && <ErrorMessage title={t('errorOccurred')} message={error} />}
    </div>
  );
}
