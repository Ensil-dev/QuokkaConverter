'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';
import { FaSpinner } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import Image from 'next/image';

interface ConversionResult {
  url: string;
  filename: string;
  size: string;
}

// 파일 타입 감지
const detectFileType = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  const videoExts = [
    'mp4',
    'avi',
    'mov',
    'mkv',
    'webm',
    'flv',
    'wmv',
    '3gp',
    'm4v',
  ];
  const audioExts = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma', 'opus'];
  const imageExts = ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'webp', 'tiff'];

  if (videoExts.includes(ext || '')) return 'video';
  if (audioExts.includes(ext || '')) return 'audio';
  if (imageExts.includes(ext || '')) return 'image';
  return 'unknown';
};

function isInAppBrowser() {
  const ua =
    typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
  return (
    ua.includes('kakaotalk') ||
    ua.includes('naver') ||
    ua.includes('fbav') ||
    ua.includes('instagram')
  );
}

function redirectToExternalBrowser() {
  alert(
    '카카오톡 등 인앱 브라우저에서는 Google 로그인이 지원되지 않습니다. 크롬 또는 사파리 브라우저로 열어주세요.'
  );
  const ua =
    typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
  if (ua.includes('iphone') || ua.includes('ipad')) {
    window.location.href = 'x-web-search://www.quokkaconvert.com';
  } else {
    window.location.href =
      'intent://www.quokkaconvert.com#Intent;scheme=https;package=com.android.chrome;end';
  }
}

const handleGoogleLogin = () => {
  if (typeof window !== 'undefined' && isInAppBrowser()) {
    redirectToExternalBrowser();
  } else {
    signIn('google');
  }
};

export default function Home() {
  const { data: session, status } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState('');
  const [availableFormats, setAvailableFormats] = useState<string[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState('');
  const [ffmpeg, setFfmpeg] = useState<FFmpeg | null>(null);
  const [isFFmpegLoaded, setIsFFmpegLoaded] = useState(false);

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

  // FFmpeg 로드
  useEffect(() => {
    const initFFmpeg = async () => {
      try {
        const ffmpegInstance = new FFmpeg();
        await ffmpegInstance.load({
          coreURL: await toBlobURL('/ffmpeg/ffmpeg-core.js', 'text/javascript'),
          wasmURL: await toBlobURL(
            '/ffmpeg/ffmpeg-core.wasm',
            'application/wasm'
          ),
        });
        setFfmpeg(ffmpegInstance);
        setIsFFmpegLoaded(true);
        console.log('FFmpeg 로드 완료');
      } catch (error) {
        console.error('FFmpeg 로드 실패:', error);
        setError('FFmpeg 로드에 실패했습니다.');
      }
    };

    initFFmpeg();
  }, []);

  // 슬라이더 초기 색상 설정
  useEffect(() => {
    const slider = document.getElementById('playbackSpeed') as HTMLInputElement;
    if (slider) {
      slider.style.setProperty('--slider-color', 'var(--primary-color)');
    }
  }, [outputFormat]);

  // 출력 형식 필터링
  const filterOutputFormats = (inputType: string) => {
    const filteredFormats: string[] = [];

    // 같은 타입 내 변환
    if (inputType === 'video') {
      filteredFormats.push(
        'mp4',
        'avi',
        'mov',
        'mkv',
        'webm',
        'gif',
        'flv',
        'wmv',
        'm4v',
        '3gp'
      );
    } else if (inputType === 'audio') {
      filteredFormats.push(
        'mp3',
        'wav',
        'flac',
        'aac',
        'ogg',
        'm4a',
        'wma',
        'opus'
      );
    } else if (inputType === 'image') {
      filteredFormats.push('jpg', 'jpeg', 'png', 'bmp', 'gif', 'tiff', 'webp');
    }

    // 비디오에서 이미지/오디오 추출 (실제로 지원하는 조합만)
    if (inputType === 'video') {
      // 비디오에서 이미지 추출 (첫 프레임)
      filteredFormats.push('jpg', 'png', 'webp');
      // 비디오에서 오디오 추출
      filteredFormats.push('mp3', 'aac', 'wav');
    }

    // 중복 제거 및 정렬
    const uniqueFormats = Array.from(new Set(filteredFormats)).sort();
    setAvailableFormats(uniqueFormats);
  };

  // 변환 조합이 지원되는지 확인
  const isConversionSupported = (
    inputType: string | null,
    outputFormat: string
  ): boolean => {
    if (!inputType || !outputFormat) return false;

    // 같은 타입 내 변환은 항상 지원
    if (
      inputType === 'video' &&
      [
        'mp4',
        'avi',
        'mov',
        'mkv',
        'webm',
        'gif',
        'flv',
        'wmv',
        'm4v',
        '3gp',
      ].includes(outputFormat)
    ) {
      return true;
    }
    if (
      inputType === 'audio' &&
      ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma', 'opus'].includes(
        outputFormat
      )
    ) {
      return true;
    }
    if (
      inputType === 'image' &&
      ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'tiff', 'webp'].includes(
        outputFormat
      )
    ) {
      return true;
    }

    // 비디오에서 이미지/오디오 추출
    if (
      inputType === 'video' &&
      ['jpg', 'png', 'webp', 'mp3', 'aac', 'wav'].includes(outputFormat)
    ) {
      return true;
    }

    return false;
  };

  // 파일 업로드 처리
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        // 파일 크기 제한 검증 (100MB)
        const maxSize = 100 * 1024 * 1024; // 100MB
        if (selectedFile.size > maxSize) {
          setError(
            '파일 크기가 너무 큽니다. 100MB 이하의 파일을 선택해주세요.'
          );
          setFile(null);
          setFileType(null);
          setOutputFormat('');
          return;
        }

        setFile(selectedFile);
        const detectedType = detectFileType(selectedFile.name);

        if (detectedType === 'unknown') {
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
    },
    []
  );

  // 파일 변환 (클라이언트 사이드에서만 동작)
  const convertFile = useCallback(
    async (
      inputFile: File,
      targetFormat: string,
      options: Record<string, unknown> = {}
    ) => {
      if (!ffmpeg || !isFFmpegLoaded) {
        throw new Error('FFmpeg가 로드되지 않았습니다.');
      }

      try {
        const inputExt = inputFile.name.split('.').pop()?.toLowerCase() || '';
        const inputFileName = `input.${inputExt}`;
        const outputFileName = `output.${targetFormat}`;

        // 파일을 FFmpeg에 로드
        const arrayBuffer = await inputFile.arrayBuffer();
        await ffmpeg.writeFile(inputFileName, new Uint8Array(arrayBuffer));

        // 변환 명령어 생성
        const args = ['-i', inputFileName];

        // 비디오 옵션 처리
        if (options.resolution && options.resolution !== 'original') {
          args.push('-vf', `scale=${options.resolution}:flags=fast_bilinear`);
        }

        if (options.fps) {
          args.push('-r', String(options.fps));
        }

        if (options.bitrate) {
          args.push('-b:v', options.bitrate as string);
        }

        // 품질 설정
        if (options.quality) {
          const qualityMap: Record<string, number> = {
            낮음: 28,
            보통: 23,
            높음: 18,
          };
          const qualityValue = qualityMap[options.quality as string];
          if (qualityValue !== undefined) {
            args.push('-crf', String(qualityValue));
          }
        }

        // 재생속도 설정
        if (options.playbackSpeed && options.playbackSpeed !== 1) {
          args.push(
            '-filter:v',
            `setpts=${1 / (options.playbackSpeed as number)}*PTS`
          );
        }

        // 출력 파일
        args.push(outputFileName);

        console.log('FFmpeg 명령어:', args.join(' '));

        // 변환 실행
        await ffmpeg.exec(args);

        // 결과 파일 읽기
        const outputData = await ffmpeg.readFile(outputFileName);

        // 임시 파일 정리
        try {
          await ffmpeg.deleteFile(inputFileName);
          await ffmpeg.deleteFile(outputFileName);
        } catch (cleanupError) {
          console.warn('파일 정리 중 오류:', cleanupError);
        }

        return new Blob([outputData], { type: `application/octet-stream` });
      } catch (error) {
        console.error('변환 오류:', error);
        throw new Error(
          `파일 변환에 실패했습니다: ${
            error instanceof Error ? error.message : '알 수 없는 오류'
          }`
        );
      }
    },
    [ffmpeg, isFFmpegLoaded]
  );

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
        if (resolution && resolution !== 'original')
          options.resolution = resolution;
        if (fps) options.fps = fps;
        if (bitrate) options.bitrate = bitrate;
        if (videoQuality) options.quality = videoQuality;
        if (playbackSpeed) options.playbackSpeed = playbackSpeed;
      }

      // 오디오 옵션들
      if (fileType === 'audio') {
        if (sampleRate) options.sampleRate = sampleRate;
        if (channels) options.channels = channels;
        if (audioQuality) options.quality = audioQuality;
      }

      // 이미지 옵션들
      if (fileType === 'image') {
        if (imageResolution && imageResolution !== 'original')
          options.resolution = imageResolution;
        if (imageQuality) options.quality = imageQuality;
      }

      setProgress(25);

      // 파일 변환 실행
      const convertedBlob = await convertFile(file, outputFormat, options);

      setProgress(100);
      setConvertedFile(convertedBlob);

      // 결과 설정
      const resultUrl = URL.createObjectURL(convertedBlob);
      setResult({
        url: resultUrl,
        filename: `converted.${outputFormat}`,
        size: (convertedBlob.size / (1024 * 1024)).toFixed(2),
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
    convertFile,
    isFFmpegLoaded,
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
  ]);

  // 변환된 파일 다운로드
  const handleDownload = useCallback(() => {
    if (convertedFile) {
      const url = URL.createObjectURL(convertedFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted.${outputFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [convertedFile, outputFormat]);

  // 재생속도 변경
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseFloat(e.target.value);
    setPlaybackSpeed(newSpeed);

    // 슬라이더 색상 변경
    const slider = e.target;
    slider.style.setProperty(
      '--slider-color',
      newSpeed < 1
        ? '#28a745'
        : newSpeed > 1
        ? '#dc3545'
        : 'var(--primary-color)'
    );
  };

  // 예상 시간 계산
  const getEstimatedTime = (
    fileSize: number,
    inputType: string | null,
    outputFormat: string,
    playbackSpeed: number,
    resolution: string,
    fps: number,
    videoQuality: string
  ): string => {
    const sizeInMB = fileSize / (1024 * 1024);
    let estimatedSeconds = 0;

    if (inputType === 'video') {
      const baseTime = estimateVideoDuration(
        sizeInMB,
        resolution,
        fps,
        videoQuality
      );
      estimatedSeconds = baseTime / playbackSpeed;
    } else if (inputType === 'audio') {
      estimatedSeconds = estimateAudioDuration(sizeInMB, audioQuality);
    } else if (inputType === 'image') {
      estimatedSeconds = 5; // 이미지는 빠름
    }

    if (estimatedSeconds < 60) {
      return `${Math.ceil(estimatedSeconds)}초`;
    } else {
      return `${Math.ceil(estimatedSeconds / 60)}분`;
    }
  };

  // 예상 파일 크기 계산
  const getEstimatedFileSize = (
    fileSize: number,
    inputType: string | null,
    outputFormat: string,
    playbackSpeed: number,
    resolution: string,
    fps: number,
    bitrate: string,
    videoQuality: string
  ): string => {
    const sizeInMB = fileSize / (1024 * 1024);
    let estimatedSize = sizeInMB;

    if (inputType === 'video') {
      if (outputFormat === 'gif') {
        // GIF는 품질에 따라 크기 계산
        const sizePerMinute = getGifSizePerMinute(
          resolution,
          fps,
          videoQuality
        );
        const duration =
          estimateVideoDuration(sizeInMB, resolution, fps, videoQuality) / 60;
        estimatedSize = sizePerMinute * duration;
      } else {
        // 비디오는 품질과 해상도에 따라 크기 조정
        let qualityFactor = 1;
        if (videoQuality === '낮음') qualityFactor = 0.6;
        else if (videoQuality === '높음') qualityFactor = 1.4;

        let resolutionFactor = 1;
        if (resolution === '640x360') resolutionFactor = 0.5;
        else if (resolution === '1280x720') resolutionFactor = 0.8;
        else if (resolution === '1920x1080') resolutionFactor = 1.2;

        estimatedSize = sizeInMB * qualityFactor * resolutionFactor;
      }
    } else if (inputType === 'audio') {
      // 오디오는 품질에 따라 크기 조정
      if (audioQuality === '낮음') estimatedSize *= 0.5;
      else if (audioQuality === '높음') estimatedSize *= 1.5;
    } else if (inputType === 'image') {
      // 이미지는 품질에 따라 크기 조정
      if (imageQuality === '낮음') estimatedSize *= 0.3;
      else if (imageQuality === '높음') estimatedSize *= 1.5;
    }

    // WebP 변환 시 크기 감소
    if (outputFormat === 'webp') {
      estimatedSize *= 0.3;
    }

    if (estimatedSize < 1) {
      return `${(estimatedSize * 1024).toFixed(1)} KB`;
    } else {
      return `${estimatedSize.toFixed(1)} MB`;
    }
  };

  // 비디오 길이 추정
  const estimateVideoDuration = (
    sizeInMB: number,
    resolution: string,
    fps: number,
    quality: string
  ): number => {
    let bitrate = 2000; // 기본 2Mbps

    if (resolution === '640x360') bitrate = 800;
    else if (resolution === '1280x720') bitrate = 1500;
    else if (resolution === '1920x1080') bitrate = 3000;

    if (quality === '낮음') bitrate *= 0.7;
    else if (quality === '높음') bitrate *= 1.3;

    // 비트레이트로부터 길이 계산 (초 단위)
    return (sizeInMB * 8 * 1024) / bitrate;
  };

  // 오디오 길이 추정
  const estimateAudioDuration = (sizeInMB: number, quality: string): number => {
    let bitrate = 128; // 기본 128kbps

    if (quality === '낮음') bitrate = 64;
    else if (quality === '높음') bitrate = 320;

    return (sizeInMB * 8 * 1024) / bitrate;
  };

  // GIF 크기 계산 (분당)
  const getGifSizePerMinute = (
    resolution: string,
    fps: number,
    quality: string
  ): number => {
    let sizePerMinute = 10; // 기본 10MB/분

    if (resolution === '640x360') sizePerMinute = 5;
    else if (resolution === '1280x720') sizePerMinute = 15;
    else if (resolution === '1920x1080') sizePerMinute = 30;

    if (fps > 15) sizePerMinute *= 1.5;
    if (fps > 20) sizePerMinute *= 1.3;

    if (quality === '낮음') sizePerMinute *= 0.5;
    else if (quality === '높음') sizePerMinute *= 1.5;

    return sizePerMinute;
  };

  // 로그인 상태 확인
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin w-8 h-8 text-blue-500 mx-auto mb-4" />
          <p className="text-sm text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 font-sans max-w-[400px] min-w-[340px]">
        {/* QuokkaConvert 로고 */}
        <div
          onClick={handleGoogleLogin}
          className="flex items-center gap-3 cursor-pointer"
          style={{ marginBottom: '10px' }}
        >
          <Image
            src="/apple-touch-icon.png"
            alt="QuokkaConvert"
            width={64}
            height={64}
            className="mr-[8px]"
          />
          <span className="text-2xl font-bold text-gray-900 select-none">
            QuokkaConvert
          </span>
        </div>
        {/* 카드 */}
        <div
          className="w-full max-w-[400px] min-w-[340px] bg-white rounded-2xl shadow-lg flex flex-col items-center gap-4 p-[10px]"
          style={{
            marginTop: 0,
            maxWidth: '400px',
            minWidth: '320px',
          }}
        >
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="cursor-pointer w-full flex items-center justify-center gap-3 border border-gray-300 bg-white text-gray-800 font-semibold rounded-lg py-3 text-lg shadow hover:shadow-md transition p-4"
          >
            <FcGoogle size={48} />
            <span className="text-2xl">Google로 로그인</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mx-auto my-5 max-w-[800px] p-[30px] bg-background rounded-[15px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-border dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)] max-[768px]:w-full max-[768px]:max-w-[100vw] max-[768px]:box-border max-[768px]:m-[10px_0] max-[768px]:p-[20px] max-[768px]:rounded-[10px] max-[480px]:m-[5px_0] max-[480px]:p-[10px] lg:flex lg:flex-col lg:items-center"
      suppressHydrationWarning={true}
    >
      {/* 헤더 */}
      <div className="mb-[30px] pb-[20px] border-b-2 border-border">
        <div className="flex flex-wrap items-center justify-between gap-[20px] max-[550px]:justify-center">
          <h1 className="select-none m-0 text-[2.2em]">QuokkaConvert</h1>
          <div className="flex items-center gap-[15px] bg-[var(--gray-alpha-100)] px-[15px] py-[10px] rounded-[25px] border border-border">
            <span className="text-[var(--text-muted)] text-[0.9em] font-medium">
              {session.user?.email}
            </span>
            <button
              onClick={() => signOut()}
              className="bg-error text-white px-4 py-2 rounded-[20px] text-[0.9em] font-medium cursor-pointer transition-all duration-300 transform hover:bg-[#c82333] hover:-translate-y-px"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-muted mb-[30px] text-[1.1em] leading-[1.5]">
        비디오, 오디오, 이미지 파일을 다양한 형식으로 변환하세요
      </p>

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
          <p className="file-limit-note">
            최대 파일 크기: 100MB (로컬 실행 제한)
          </p>
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
                <select
                  id="bitrate"
                  value={bitrate}
                  onChange={(e) => setBitrate(e.target.value)}
                >
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
                <span className="option-note">
                  GIF는 품질 설정으로 크기를 조절합니다
                </span>
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
              <select
                id="channels"
                value={channels}
                onChange={(e) => setChannels(e.target.value)}
              >
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
            isConverting || !isConversionSupported(fileType, outputFormat)
          }
        >
          {isConverting ? '변환 중...' : '변환하기'}
        </button>

        {/* 지원하지 않는 변환 조합 안내 */}
        {outputFormat && !isConversionSupported(fileType, outputFormat) && (
          <div className="warning-message">
            <p>
              ⚠️ 이 변환 조합은 현재 지원되지 않습니다. 다른 출력 형식을
              선택해주세요.
            </p>
          </div>
        )}
      </form>

      {/* 변환 진행 상태 */}
      {isConverting && (
        <div className="conversion-progress">
          <div className="progress-spinner"></div>
          <p>변환 중... {progress}%</p>
          <p className="progress-note">
            변환 시간은 파일 크기와 형식에 따라 달라질 수 있습니다.
          </p>
        </div>
      )}

      {/* 변환 중일 때 결과 영역 미리 확보 */}
      {isConverting && (
        <div className="result-placeholder">
          <div className="placeholder-content">
            <div className="placeholder-icon">⏳</div>
            <h2>변환 결과 준비 중...</h2>
            <p>변환이 완료되면 여기에 결과가 표시됩니다</p>
            <div className="placeholder-info">
              <div className="placeholder-item">
                <span className="placeholder-label">출력 형식:</span>
                <span className="placeholder-value">
                  {outputFormat.toUpperCase()}
                </span>
              </div>
              <div className="placeholder-item">
                <span className="placeholder-label">예상 크기:</span>
                <span className="placeholder-value">
                  {getEstimatedFileSize(
                    file!.size,
                    fileType,
                    outputFormat,
                    playbackSpeed,
                    resolution,
                    fps,
                    bitrate,
                    videoQuality
                  )}
                </span>
              </div>
              <div className="placeholder-item">
                <span className="placeholder-label">예상 시간:</span>
                <span className="placeholder-value">
                  {getEstimatedTime(
                    file!.size,
                    fileType,
                    outputFormat,
                    playbackSpeed,
                    resolution,
                    fps,
                    videoQuality
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 파일 업로드 및 출력 형식 선택 완료 시 결과 영역 미리 확보 */}
      {file && outputFormat && !isConverting && !result && !error && (
        <div className="result-placeholder ready">
          <div className="placeholder-content">
            <div className="placeholder-icon">📁</div>
            <h2>변환 준비 완료</h2>
            <p>변환 버튼을 클릭하면 여기에 결과가 표시됩니다</p>
            <div className="placeholder-info">
              <div className="placeholder-item">
                <span className="placeholder-label">입력 파일:</span>
                <span className="placeholder-value">{file.name}</span>
              </div>
              <div className="placeholder-item">
                <span className="placeholder-label">출력 형식:</span>
                <span className="placeholder-value">
                  {outputFormat.toUpperCase()}
                </span>
              </div>
              <div className="placeholder-item">
                <span className="placeholder-label">파일 크기:</span>
                <span className="placeholder-value">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              <div className="placeholder-item">
                <span className="placeholder-label">예상 크기:</span>
                <span className="placeholder-value">
                  {getEstimatedFileSize(
                    file.size,
                    fileType,
                    outputFormat,
                    playbackSpeed,
                    resolution,
                    fps,
                    bitrate,
                    videoQuality
                  )}
                </span>
              </div>
              {fileType === 'video' && outputFormat === 'gif' && (
                <div className="placeholder-item">
                  <span className="placeholder-label">재생속도:</span>
                  <span className="placeholder-value">{playbackSpeed}x</span>
                </div>
              )}
              {fileType === 'video' && resolution !== 'original' && (
                <div className="placeholder-item">
                  <span className="placeholder-label">해상도:</span>
                  <span className="placeholder-value">{resolution}</span>
                </div>
              )}
              {fileType === 'video' && fps !== 10 && (
                <div className="placeholder-item">
                  <span className="placeholder-label">프레임레이트:</span>
                  <span className="placeholder-value">{fps} FPS</span>
                </div>
              )}
              {fileType === 'video' && bitrate && outputFormat !== 'gif' && (
                <div className="placeholder-item">
                  <span className="placeholder-label">비트레이트:</span>
                  <span className="placeholder-value">{bitrate}</span>
                </div>
              )}
              {fileType === 'video' && videoQuality !== '보통' && (
                <div className="placeholder-item">
                  <span className="placeholder-label">품질:</span>
                  <span className="placeholder-value">{videoQuality}</span>
                </div>
              )}
              <div className="placeholder-item">
                <span className="placeholder-label">예상 시간:</span>
                <span className="placeholder-value">
                  {getEstimatedTime(
                    file.size,
                    fileType,
                    outputFormat,
                    playbackSpeed,
                    resolution,
                    fps,
                    videoQuality
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GIF에서 WebP 변환 시 특별 안내 */}
      {file &&
        file.name.toLowerCase().endsWith('.gif') &&
        outputFormat === 'webp' && (
          <div className="info-message">
            <p>
              💡 <strong>GIF → WebP 변환 팁:</strong> WebP는 GIF보다 훨씬
              효율적인 압축을 사용하여 파일 크기가 90% 이상 감소할 수 있습니다!
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
            <p>출력 형식: {outputFormat.toUpperCase()}</p>
          </div>
          <button onClick={handleDownload} className="download-btn">
            파일 다운로드
          </button>
        </div>
      )}

      {error && (
        <div className="error-message">
          <h3>오류 발생</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
